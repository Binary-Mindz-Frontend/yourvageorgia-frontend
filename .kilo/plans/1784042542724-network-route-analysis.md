# Network Route Analysis

## Route Overview

**Path:** `/network` (`app/(main)/network/page.tsx`)  
**Type:** Server Component with Client-side interactivity  
**Framework:** Next.js 15 App Router

---

## Architecture Diagram

```
page.tsx (Server)
  ├── getPartnerFiltered()  → Server-side data fetch with caching
  ├── getCategoriesForSelect() → Server-side categories fetch
  │
  └── NetworkFilter (Client)
        ├── Category Tabs (horizontal scroll + drag)
        ├── City Selector (Dubai/London/International)
        ├── Filter Drawer (Location, Activity, Gender)
        ├── Infinite Scroll (IntersectionObserver)
        ├── PartnerCard[] (memoized)
        │     └── FavouriteButton (localStorage + API)
        └── PartnerDetailsModal (on card click)
              └── ImageGallerySlider (touch/drag, fullscreen, zoom)
```

---

## Data Flow

1. **Initial Load (Server):** `page.tsx` fetches partners (page=1, limit=10) + categories in `Promise.all`
2. **URL Sync:** Category filter → URL query param `?filter=X`
3. **Client Fetching:** `NetworkFilter` handles pagination, search, and filter combinations
4. **AbortController:** Cancels in-flight requests on new filter changes
5. **Cache Strategy:** Server uses `revalidate: 180` (3 min), client uses `no-store`

---

## Key Components

| Component | File | Purpose |
|-----------|------|---------|
| `NetworkFilter` | `_components/NetworkFilter/NetworkFilter.tsx` | Main orchestrator, 540 lines |
| `FilterDrawer` | `_components/NetworkFilter/FilterDrawer.tsx` | Location/Activity/Gender filters |
| `PartnerCard` | `_components/NetworkFilter/PartnerCard.tsx` | Partner display card (memoized) |
| `FavouriteButton` | `_components/NetworkFilter/FavouriteButton.tsx` | Heart icon with optimistic update |
| `PartnerDetailsModal` | `_components/NetworkCardModal/PartnerDetailsModal.tsx` | Full partner detail view |
| `ImageGallerySlider` | `_components/ImageGallerySlider/ImageGallerySlider.tsx` | Gallery with touch drag, fullscreen |

---

## State Management

### NetworkFilter State (12+ useState hooks)
- `partners`, `currentPage`, `totalPages`, `totalPartners`
- `appliedFilters` (locations, activities, gender)
- `activeFilter`, `isFilterOpen`, `isCityOpen`
- `isLoading`, `isModalOpen`, `selectedPartner`
- `isDragging`, `showScrollTop`

### Global Contexts
- **CityContext:** City-based filtering (dubai/london/international), persisted to localStorage

---

## Identified Issues & Observations

### 1. **Race Conditions & Stale Data**
- `abortControllerRef` is used, but `appliedFilters` closure in `fetchPartners` may capture stale values if filters change rapidly
- `useEffect` on `[currentPage]` triggers fetch without checking if the request was already superseded

### 2. **Duplicate Logic**
- FavouriteButton has commented-out legacy code (155 lines) alongside new implementation
- Two different fetch implementations in the file

### 3. **Type Safety**
- Heavy use of `any` in `PartnerDetailsModal` (`partner: any`)
- `meta` typed as `any` in `fetchPartners` (line 135)
- `categoriesResult.data.map((c: any) => c.title)` in page.tsx

### 4. **Performance**
- `NetworkFilter` is 540 lines — should be split
- Multiple `useEffect` with overlapping dependencies
- `isFirstRender` ref pattern is fragile

### 5. **Accessibility**
- Gallery slider has `aria-hidden="true"` on prev/next slides but they're still interactive
- Filter drawer overlay click-to-close may conflict with scroll

### 6. **Error Handling**
- Console.error for fetch errors without user-facing error UI
- No retry mechanism for failed requests

### 7. **URL/State Sync Complexity**
- Three `useEffect` hooks for URL sync (filter, search, pagination) — high risk of infinite loops or missed updates

---

## Recommendations

### High Priority
1. **Extract custom hooks** from `NetworkFilter`:
   - `usePartnerFetch()` — fetch logic, abort controller
   - `useInfiniteScroll()` — IntersectionObserver
   - `useFilterSync()` — URL ↔ state sync

2. **Fix race conditions** — use functional state updates or refs for latest filter values

3. **Remove dead code** — delete commented-out FavouriteButton implementation

4. **Add proper typing** — replace `any` with `Partner` and proper interfaces

### Medium Priority
5. **Add error UI** — replace console.error with toast/error boundary

6. **Simplify URL sync** — consolidate into a single reducer or Zustand slice

7. **Split NetworkFilter** — separate FilterBar, PartnerList, and Pagination into their own components

### Low Priority
8. **Add retry logic** for network failures

9. **Add skeleton states** for filter drawer loading

10. **Keyboard navigation** for gallery slider (partially implemented)

---

## ZoomModal Deep Dive: Image Loading Analysis

**File:** `app/(main)/network/_components/ImageGallerySlider/ZoomModal.tsx`

### Current Implementation Issues

| Issue | Impact | Root Cause |
|-------|--------|------------|
| `priority` prop used | Deprecated in Next.js 16; may cause warnings | Should use `preload` or `fetchPriority="high"` |
| No adjacent image preloading | User sees blank/loading state on every navigation | Only current image is fetched |
| Thumbnails all lazy-load simultaneously | Bandwidth contention, slow thumbnail strip | No staggered loading strategy |
| Inaccurate `sizes="95vw"` | Browser may download oversized images | Container uses `object-contain`, actual rendered size varies |
| No `onLoad` tracking | No way to show per-image loading state | Missing callback handler |
| No `onError` handling | Broken images show empty space | No fallback UI |
| Generic blur placeholder | Poor perceived performance | Same SVG for all images, not tailored to content |

### Next.js Image Optimization Opportunities

Based on official Next.js 16.2.10 docs:

1. **`preload` vs `priority`**: `priority` is deprecated. Use `preload={true}` for LCP images or `fetchPriority="high"` for critical above-fold images.

2. **`sizes` accuracy**: When using `fill` + `object-contain`, the actual rendered size depends on aspect ratio. Current `sizes="95vw"` overestimates for tall images. Better: `sizes="(max-width: 768px) 95vw, 85vh"` or calculate based on viewport.

3. **`loading` strategy**: Default is `lazy`. For modal main image, use `loading="eager"` or `fetchPriority="high"`.

4. **`formats`**: Project already configured with `['image/avif', 'image/webp']` — good. AVIF gives ~20% smaller files than WebP.

5. **`minimumCacheTTL`**: Set to 31 days — good for static assets, but modal images may change. Consider shorter TTL for dynamic partner images.

6. **Blur placeholder**: Keep under 10px. Current SVG is small but generic. For dynamic remote images, consider generating per-image LQIPs.

### Recommended Optimizations

#### 1. Preload Adjacent Images
When modal opens, preload `currentIndex ± 1` using `new Image()` or Next.js `preload`:
```tsx
useEffect(() => {
  if (!isOpen) return;
  const prev = (currentIndex - 1 + images.length) % images.length;
  const next = (currentIndex + 1) % images.length;
  [prev, next].forEach(i => {
    const img = new window.Image();
    img.src = typeof images[i] === 'string' ? images[i] : images[i].src;
  });
}, [isOpen, currentIndex, images]);
```

#### 2. Fix Main Image Props
Replace deprecated `priority` with modern alternatives:
```tsx
<Image
  src={images[currentIndex]}
  alt={...}
  fill
  sizes="(max-width: 768px) 95vw, 85vh"
  loading="eager"
  fetchPriority="high"
  placeholder="blur"
  blurDataURL={BLUR_PLACEHOLDER}
  decoding="async"
  onLoad={() => setIsLoaded(true)}
  onError={() => setHasError(true)}
/>
```

#### 3. Stagger Thumbnail Loading
Render only visible thumbnails + buffer, or add `loading="lazy"` explicitly with `fetchPriority="auto"`:
```tsx
{images.slice(0, 5).map((img, i) => ( // Initial batch
  <Image
    key={i}
    src={img}
    loading="lazy"
    fetchPriority="auto"
    ...
  />
))}
```

#### 4. Add Loading/Error States
Track per-image load state and show skeleton/fallback:
```tsx
const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

// In Image onLoad: setLoadedImages(prev => new Set(prev).add(index))
// In Image onError: setErrorImages(prev => new Set(prev).add(index))
```

#### 5. Improve `sizes` Attribute
Current: `sizes="95vw"`  
Better: `sizes="(max-width: 768px) 95vw, (max-height: 800px) 85vh, 75vw"`  
This tells browser to request appropriately sized images based on actual container constraints.

#### 6. Consider `unoptimized` for Already-Optimized CDN Images
If images are served from a CDN with built-in optimization (e.g., Cloudinary, Imgix), consider `unoptimized` to skip Next.js optimization overhead. Verify CDN headers first.

### Open Questions — RESOLVED

1. **Image source CDN**: Images are served from `NEXT_PUBLIC_BASE_API` (API server, not a dedicated image CDN). Next.js optimization **does add value** — it converts to AVIF/WebP, resizes, and caches. No need for `unoptimized`.

2. **Gallery size**: Typical gallery is small (2-5 images from `partner.gallery` or single `partner.thumbnail`). Preloading all images on modal open is acceptable. For galleries with 10+ images, implement lazy preload of adjacent only.

3. **Device targets**: Mobile-first design with `lg:` breakpoints. Modal is used on both mobile and desktop. Need responsive `sizes` and quality adjustments.

4. **Current Next.js version**: **Next.js 16.1.0+** (confirmed via `package.json`). `priority` prop is **deprecated** — must replace with `preload` or `fetchPriority="high"`.

### Recommended Implementation Order

**Phase 1 — Critical Fixes (no behavior change)**
1. Replace deprecated `priority` with `preload={true}` on main modal image
2. Add `fetchPriority="high"` for LCP optimization
3. Fix `sizes` attribute to `(max-width: 768px) 95vw, 85vh`
4. Add `onLoad` and `onError` handlers with state tracking

**Phase 2 — Performance (requires testing)**
5. Add adjacent image preloading (`currentIndex ± 1`) on navigation
6. Implement thumbnail lazy-loading with staggered fetch
7. Add loading/error fallback UI for broken images

**Phase 3 — Polish**
8. Consider per-image LQIP generation if blur placeholder upgrade is needed
9. Add `loading="eager"` fallback for browsers that don't support `fetchPriority`

### Validation Plan

1. **Build check**: Run `next build` and verify no `priority` deprecation warnings
2. **Lighthouse audit**: Measure LCP, image load times before/after (use existing `npm run lighthouse` script)
3. **Network throttling test**: Simulate Slow 3G in DevTools, verify preloading reduces blank time
4. **Bundle size check**: Ensure preload logic adds <5KB gzipped
5. **Visual regression**: Confirm blur placeholders, loading states, and error fallbacks render correctly
6. **Error case test**: Verify broken images show fallback, not empty space
