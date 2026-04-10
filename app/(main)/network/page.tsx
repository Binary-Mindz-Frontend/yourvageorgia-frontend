import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import { getCategoriesForSelect } from "@/services/category/category";
import { getPartnerFiltered } from "@/services/partner/getpartner";
import { Suspense } from "react";
import NetworkFilter from "./_components/NetworkFilter/NetworkFilter";

interface NetworkPageProps {
  searchParams: Promise<{
    filter?: string;
    search?: string;
  }>;
}

// Server Component - runs on server, sends HTML to client
export default async function NetworkPage({ searchParams }: NetworkPageProps) {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  const filter = params.filter || "All";

  // Fetch initial data on server
  const [initialResult, categoriesResult] = await Promise.all([
    getPartnerFiltered({
      page: 1,
      limit: 10,
      category: filter === "All" ? undefined : filter,
    }),
    getCategoriesForSelect()
  ]);

  const initialData = "error" in initialResult
    ? { data: [], meta: { total: 0, totalPages: 1, page: 1, limit: 10, pagingCounter: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null } }
    : { data: initialResult.data, meta: initialResult.meta };

  const categories = "error" in categoriesResult
    ? ["All", "Movement", "Recovery", "Radiance", "Taste"]
    : ["All", ...categoriesResult.data.map((c) => c.title)];

  return (
    <Suspense fallback={<BeautifulLoader fullScreen text="Loading Network" />}>
      <NetworkFilter
        initialData={initialData.data}
        initialMeta={initialData.meta}
        initialFilter={filter}
        searchQuery={params.search}
        categories={categories}
      />
    </Suspense>
  );
}