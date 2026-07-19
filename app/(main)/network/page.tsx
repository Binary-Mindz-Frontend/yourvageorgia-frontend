import { getCategoriesForSelect } from "@/services/category/category";
import { getPartnerFiltered } from "@/services/partner/getpartner";
import { ViewTransition } from "react";
import { Suspense } from "react";
import NetworkFilter from "./_components/NetworkFilter/NetworkFilter";
import { NetworkSkeleton } from "@/components/Shared/Loading/NetworkSkeleton";

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
    <Suspense
      fallback={
        <ViewTransition exit="slide-down">
          <NetworkSkeletonShell />
        </ViewTransition>
      }
    >
      <ViewTransition enter="slide-up" default="none">
        <NetworkFilterContent filter={filter} search={search} />
      </ViewTransition>
    </Suspense>
  );
}

/**
 * Static-shell wrapper for the skeleton. Mirrors the NetworkFilter layout so
 * the skeleton matches the final content's outer container (prevents layout
 * shift when the stream resolves).
 */
function NetworkSkeletonShell() {
  return (
    <div className="text-white p-4 max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl lg:text-5xl font-bold lg:font-semibold text-center py-4 lg:py-20">
        The Network
      </h2>
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
