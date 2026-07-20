import { getCategoriesForSelect } from "@/services/category/category";
import { getPartnerFiltered } from "@/services/partner/getpartner";
import { Suspense } from "react";
import NetworkFilter from "./_components/NetworkFilter/NetworkFilter";
import { NetworkSkeleton } from "@/components/Shared/Loading/NetworkSkeleton";
import { ChevronDown, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NetworkPageProps {
  searchParams: Promise<{
    filter?: string;
    search?: string;
  }>;
}

/**
 * Network route — refactored for Next.js 16 Cache Components (PPR).
 *
 * What changes vs the old version:
 * - The async data fetch is split into its own component (NetworkFilterContent)
 *   so it lives behind a <Suspense> boundary and the rest of the route can
 *   be prerendered as a static shell.
 * - The <Suspense> fallback uses <ViewTransition exit="slide-down"> so when
 *   the data resolves, the skeleton slides down & out instead of vanishing.
 * - The real content uses <ViewTransition enter="slide-up" default="none">
 *   so it slides up & fades in. Together these create a "loading handoff".
 */
export default async function NetworkPage({ searchParams }: NetworkPageProps) {
  const params = await searchParams;
  const filter = params.filter || "All";
  const search = params.search;

  return (
    <Suspense fallback={<NetworkSkeletonShell activeFilter={filter} />}>
      <NetworkFilterContent filter={filter} search={search} />
    </Suspense>
  );
}

/**
 * Static-shell wrapper for the skeleton. Mirrors the NetworkFilter layout so
 * the skeleton matches the final content's outer container (prevents layout
 * shift when the stream resolves).
 * Renders static header and categories UI without pulsing skeleton boxes.
 */
function NetworkSkeletonShell({ activeFilter = "All" }: { activeFilter?: string }) {
  const categories = ["All", "Movement", "Recovery", "Radiance", "Taste"];

  return (
    <div className="text-white p-4 max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl lg:text-5xl font-bold lg:font-semibold text-center py-4 lg:py-20">
        The Network
      </h2>

      {/* City Selection & Filter Header (Rendered statically, no pulsing skeleton) */}
      <header className="flex items-center justify-between mb-8 relative z-30">
        <div className="relative">
          <button
            tabIndex={-1}
            className="w-auto min-w-35 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full px-5 h-10 font-light tracking-wide shadow-lg flex items-center justify-between gap-2 cursor-default"
          >
            <span className="capitalize">dubai</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <Button
          variant="ghost"
          size="lg"
          className="text-white focus:outline-none p-2 rounded [&_svg:not([class*='size-'])]:size-6 cursor-default"
          aria-label="Open filter options"
          tabIndex={-1}
        >
          <ListFilter className="h-6 w-6" aria-hidden="true" />
        </Button>
      </header>

      {/* Categories Header (Rendered statically, no pulsing skeleton) */}
      <div
        className="flex gap-4 mb-8 overflow-x-auto pb-2
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]"
      >
        {categories.map((filter) => (
          <button
            key={filter}
            tabIndex={-1}
            className={`snap-start py-2.5 px-5 rounded-lg whitespace-nowrap
              border border-white/10
              transition-all duration-200
              min-w-max cursor-default
              ${activeFilter === filter
                ? "bg-white text-black"
                : "text-white"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <NetworkSkeleton />
    </div>
  );
}

/**
 * Inner async component — runs on the server, behind the Suspense boundary.
 * Anything awaited in here is streamed in; nothing above the Suspense can be
 * blocked by it.
 */
async function NetworkFilterContent({
  filter,
  search,
}: {
  filter: string;
  search?: string;
}) {
  const [initialResult, categoriesResult] = await Promise.all([
    getPartnerFiltered({
      page: 1,
      limit: 10,
      category: filter === "All" ? undefined : filter,
    }),
    getCategoriesForSelect(),
  ]);

  const categories =
    "error" in categoriesResult
      ? ["All", "Movement", "Recovery", "Radiance", "Taste"]
      : ["All", ...categoriesResult.data.map((c) => c.title)];

  const initialData =
    "error" in initialResult
      ? {
          data: [],
          meta: {
            total: 0,
            totalPages: 1,
            page: 1,
            limit: 10,
            pagingCounter: 1,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: null,
            nextPage: null,
          },
        }
      : { data: initialResult.data, meta: initialResult.meta };

  return (
    <NetworkFilter
      initialData={initialData.data}
      initialMeta={initialData.meta}
      initialFilter={filter}
      searchQuery={search}
      categories={categories}
    />
  );
}
