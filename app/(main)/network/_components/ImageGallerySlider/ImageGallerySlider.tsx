import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Image, { StaticImageData } from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ZoomModal from "./ZoomModal";

interface ImageGallerySliderProps {
  images: (string | StaticImageData)[];
  viewTransitionName?: string;
}

/* ─── Single Image ─────────────────────────────────────────────────────────── */

const SingleImageSlider = memo(
  ({
    image,
    viewTransitionName,
  }: {
    image: string | StaticImageData;
    viewTransitionName?: string;
  }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const style = useMemo<React.CSSProperties>(
      () => (viewTransitionName ? { viewTransitionName } : {}),
      [viewTransitionName]
    );

    return (
      <div className="relative w-full h-60.5 lg:h-108.75 overflow-hidden rounded-xl select-none bg-white/[0.03]">
        <Image
          src={image}
          alt="Gallery"
          fill
          sizes="(max-width: 640px) 100vw, 800px"
          className={clsx(
            "object-cover transition-all duration-500 ease-out",
            loaded
              ? "opacity-100 scale-100 blur-0"
              : "opacity-20 scale-[1.02] blur-sm"
          )}
          priority
          decoding="async"
          placeholder="empty"
          style={style}
          onLoad={() => setLoaded(true)}
          onClick={() => setIsZoomed(true)}
        />
        {/* Frosted overlay while loading */}
        <div
          className={clsx(
            "absolute inset-0 bg-black/40 transition-opacity duration-500 ease-out pointer-events-none",
            loaded ? "opacity-0" : "opacity-100"
          )}
        />
        {/* Loading dot */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
          </div>
        )}
        <ZoomModal
          images={[image]}
          initialIndex={0}
          isOpen={isZoomed}
          onClose={() => setIsZoomed(false)}
        />
      </div>
    );
  }
);
SingleImageSlider.displayName = "SingleImageSlider";

/* ─── Multi Image (Embla Carousel) ─────────────────────────────────────────── */

const MultiImageSlider = memo(
  ({ images, viewTransitionName }: ImageGallerySliderProps) => {
    const rootRef = useRef<HTMLDivElement>(null);

    /* ── Drag detection: track pointer distance, not time ─────────────────── */
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
    const isDraggingRef = useRef(false);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      isDraggingRef.current = false;
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
      if (!pointerStartRef.current) return;
      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 8) {
        isDraggingRef.current = true;
      }
    }, []);

    const onPointerUp = useCallback(() => {
      pointerStartRef.current = null;
      /* reset after a tick so click handler can read the flag first */
      requestAnimationFrame(() => {
        isDraggingRef.current = false;
      });
    }, []);

    const [emblaRef, emblaApi] = useEmblaCarousel({
      loop: images.length > 2,
      align: "center",
      containScroll: "trimSnaps",
      slidesToScroll: 1,
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomIndex, setZoomIndex] = useState(0);
    const [loadedSet, setLoadedSet] = useState<Set<number>>(() => new Set());
    const [thumbLoadedSet, setThumbLoadedSet] = useState<Set<number>>(
      () => new Set()
    );

    const markLoaded = useCallback((i: number) => {
      setLoadedSet((prev) => {
        if (prev.has(i)) return prev;
        const next = new Set(prev);
        next.add(i);
        return next;
      });
    }, []);

    const markThumbLoaded = useCallback((i: number) => {
      setThumbLoadedSet((prev) => {
        if (prev.has(i)) return prev;
        const next = new Set(prev);
        next.add(i);
        return next;
      });
    }, []);

    const vtStyle = useMemo<React.CSSProperties>(
      () => (viewTransitionName ? { viewTransitionName } : {}),
      [viewTransitionName]
    );

    const openZoom = useCallback((idx: number) => {
      setZoomIndex(idx);
      setIsZoomed(true);
    }, []);

    /* ── Embla events ─────────────────────────────────────────────────────── */

    useEffect(() => {
      if (!emblaApi) return;

      const onSelect = () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      };

      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);

      return () => {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onSelect);
      };
    }, [emblaApi]);

    /* ── Reset loadedSet when slide count changes (partner switch) ────────── */

    useEffect(() => {
      if (!emblaApi) return;
      const slideCount = emblaApi.scrollSnapList().length;
      if (slideCount > 0 && loadedSet.size > slideCount) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate reset when partner changes
        setLoadedSet(new Set());
        emblaApi.scrollTo(0, true);
      }
    }, [emblaApi, loadedSet.size]);

    /* ── Body scroll lock ─────────────────────────────────────────────────── */

    useEffect(() => {
      const lock = isZoomed || isFullscreen;
      document.body.style.overflow = lock ? "hidden" : "";
      return () => {
        document.body.style.overflow = "";
      };
    }, [isZoomed, isFullscreen]);

    /* ── Keyboard ─────────────────────────────────────────────────────────── */

    useEffect(() => {
      if (!isFullscreen && !isZoomed) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (isZoomed) setIsZoomed(false);
          else if (isFullscreen) setIsFullscreen(false);
        } else if (e.key === "ArrowRight") emblaApi?.scrollNext();
        else if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [isFullscreen, isZoomed, emblaApi]);

    /* ── Fullscreen ───────────────────────────────────────────────────────── */

    const enterFullscreen = useCallback(async () => {
      try {
        const el = rootRef.current;
        if (el?.requestFullscreen) await el.requestFullscreen();
        const screenOri = (screen as unknown as {
          orientation?: {
            lock?: (o: string) => Promise<void>;
            unlock?: () => void;
          };
        })?.orientation;
        if (screenOri?.lock) await screenOri.lock("landscape").catch(() => {});
        setIsFullscreen(true);
      } catch {
        setZoomIndex(selectedIndex);
        setIsZoomed(true);
      }
    }, [selectedIndex]);

    const exitFullscreen = useCallback(async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        const screenOri = (screen as unknown as {
          orientation?: {
            lock?: (o: string) => Promise<void>;
            unlock?: () => void;
          };
        })?.orientation;
        if (screenOri?.unlock) screenOri.unlock();
      } catch {
        // ignore
      }
      setIsFullscreen(false);
    }, []);

    useEffect(() => {
      const onChange = () => {
        if (!document.fullscreenElement) setIsFullscreen(false);
      };
      document.addEventListener("fullscreenchange", onChange);
      return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    /* ── Render ───────────────────────────────────────────────────────────── */

    return (
      <div
        ref={rootRef}
        data-fullscreen-root
        className={clsx(isFullscreen && "bg-black")}
      >
        {/* Main carousel */}
        <div className="relative w-full h-60.5 lg:h-108.75 overflow-hidden rounded-xl bg-white/[0.03] select-none">
          <div
            ref={emblaRef}
            className="overflow-hidden w-full h-full"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div
              className="flex h-full"
              style={{ touchAction: "pan-y pinch-zoom" }}
            >
              {images.map((img, i) => {
                const isLoaded = loadedSet.has(i);
                const isSelected = i === selectedIndex;
                return (
                  <div
                    key={i}
                    className="relative shrink-0 w-full h-full min-w-0 cursor-pointer"
                    style={{ flex: "0 0 100%" }}
                    onClick={() =>
                      !isDraggingRef.current && openZoom(i)
                    }
                  >
                    <Image
                      src={img}
                      alt={`Gallery image ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
                      className={clsx(
                        "object-cover transition-all duration-500 ease-out",
                        isLoaded
                          ? "opacity-100 scale-100 blur-0"
                          : "opacity-20 scale-[1.02] blur-sm"
                      )}
                      priority={i === 0}
                      loading={i <= 2 ? "eager" : "lazy"}
                      decoding="async"
                      placeholder="empty"
                      style={isSelected ? vtStyle : undefined}
                      onLoad={() => markLoaded(i)}
                    />
                    {/* Frosted overlay while loading */}
                    <div
                      className={clsx(
                        "absolute inset-0 bg-black/40 transition-opacity duration-500 ease-out pointer-events-none",
                        isLoaded ? "opacity-0" : "opacity-100"
                      )}
                    />
                    {/* Loading dot */}
                    {!isLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fullscreen button (mobile) */}
          <button
            onClick={enterFullscreen}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 z-30 lg:hidden bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-200 active:scale-90 pointer-events-auto"
            aria-label="Enter fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-white" />
          </button>

          {/* Mobile arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-1.5 transition-all duration-200 active:scale-90 lg:hidden pointer-events-auto"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-1.5 transition-all duration-200 active:scale-90 lg:hidden pointer-events-auto"
            aria-label="Next image"
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>

          {/* Counter (desktop) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm hidden lg:block pointer-events-none tabular-nums">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Dots (mobile) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden z-20 pointer-events-auto">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  emblaApi?.scrollTo(i);
                }}
                className={clsx(
                  "rounded-full transition-all",
                  i === selectedIndex
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/40"
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop prev/next */}
        <div className="hidden lg:flex justify-between items-center mt-3 px-1">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="rounded-full cursor-pointer p-1.5 transition-all duration-200 hover:bg-white/10 active:scale-90"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="rounded-full cursor-pointer p-1.5 transition-all duration-200 hover:bg-white/10 active:scale-90"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop thumbnails */}
        <div className="hidden lg:flex gap-2 mt-4 justify-center flex-wrap">
          {images.map((img, i) => {
            const isThumbLoaded = thumbLoadedSet.has(i);
            return (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={clsx(
                  "relative w-16 h-16 shrink-0 rounded-md overflow-hidden transition-all duration-250 ease-out",
                  i === selectedIndex
                    ? "ring-2 ring-white opacity-100 scale-105"
                    : "opacity-50 hover:opacity-90 hover:scale-105"
                )}
                aria-label={`Go to image ${i + 1}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="64px"
                  className={clsx(
                    "object-cover transition-all duration-300",
                    isThumbLoaded
                      ? "opacity-100 blur-0"
                      : "opacity-30 blur-[2px]"
                  )}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => markThumbLoaded(i)}
                />
                {/* Frosted overlay */}
                <div
                  className={clsx(
                    "absolute inset-0 bg-black/30 transition-opacity duration-300 pointer-events-none",
                    isThumbLoaded ? "opacity-0" : "opacity-100"
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Fullscreen viewer */}
        {isFullscreen && (
          <FullscreenViewer
            images={images}
            initialIndex={selectedIndex}
            onClose={exitFullscreen}
          />
        )}

        {/* Zoom modal */}
        <ZoomModal
          images={images}
          initialIndex={zoomIndex}
          isOpen={isZoomed}
          onClose={() => setIsZoomed(false)}
        />
      </div>
    );
  }
);
MultiImageSlider.displayName = "MultiImageSlider";

/* ─── Fullscreen Viewer (Embla) ────────────────────────────────────────────── */

const FullscreenViewer = memo(
  ({
    images,
    initialIndex,
    onClose,
  }: {
    images: (string | StaticImageData)[];
    initialIndex: number;
    onClose: () => void;
  }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
      loop: images.length > 2,
      align: "center",
      startIndex: initialIndex,
    });

    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    useEffect(() => {
      if (!emblaApi) return;
      const onSelect = () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      };
      emblaApi.on("select", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
      };
    }, [emblaApi]);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        else if (e.key === "ArrowRight") emblaApi?.scrollNext();
        else if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [onClose, emblaApi]);

    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center touch-none select-none" style={{ animation: "fadeIn 0.2s ease-out" }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2.5 transition-all duration-200 active:scale-90"
          aria-label="Exit fullscreen"
        >
          <Minimize2 className="w-6 h-6" />
        </button>

        <div ref={emblaRef} className="overflow-hidden w-full h-full">
          <div
            className="flex h-full items-center"
            style={{ touchAction: "pan-y pinch-zoom" }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="relative shrink-0 w-full h-full min-w-0"
                style={{ flex: "0 0 100%" }}
              >
                <Image
                  src={img}
                  alt={`Fullscreen image ${i + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain will-change-transform"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-[110] bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2.5 transition-all duration-200 active:scale-90"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7 text-white" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-[110] bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2.5 transition-all duration-200 active:scale-90"
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7 text-white" />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm tabular-nums pointer-events-none">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>
    );
  }
);
FullscreenViewer.displayName = "FullscreenViewer";

/* ─── Entry Point ──────────────────────────────────────────────────────────── */

const ImageGallerySlider = memo(
  ({ images, viewTransitionName }: ImageGallerySliderProps) => {
    if (!images || images.length <= 1) {
      const single = images?.[0];
      if (!single) return null;
      return (
        <SingleImageSlider
          image={single}
          viewTransitionName={viewTransitionName}
        />
      );
    }
    return (
      <MultiImageSlider
        images={images}
        viewTransitionName={viewTransitionName}
      />
    );
  }
);
ImageGallerySlider.displayName = "ImageGallerySlider";

export default ImageGallerySlider;
