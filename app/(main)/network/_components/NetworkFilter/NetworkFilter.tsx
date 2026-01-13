/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import { NetworkSkeleton } from "@/components/Shared/Loading/NetworkSkeleton";
import { Button } from "@/components/ui/button";
import { getPartnerFiltered } from "@/services/partner/getpartner";
import { Partner } from "@/types/partner.types";
import { ChevronDown, ListFilter } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

// Dynamic imports for heavy components
const FilterDrawer = dynamic(() => import("./FilterDrawer").then(mod => ({ default: mod.FilterDrawer })), {
  ssr: false,
  loading: () => null,
});

const PartnerCard = dynamic(() => import("./PartnerCard"), {
  loading: () => <div className="w-full aspect-video bg-gray-800 rounded-xl animate-pulse" />
});

const PartnerDetailsModal = dynamic(() => import("../NetworkCardModal/PartnerDetailsModal"), {
  ssr: false,
  loading: () => null,
});

const filters = ["All", "Movement", "Recovery", "Radiance", "Taste"];

const NetworkFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filterFromUrl = searchParams.get("filter");
  const searchQuery = searchParams.get("search");

  const [partners, setPartners] = useState<Partner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPartners, setTotalPartners] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [activeFilter, setActiveFilter] = useState<string>(filterFromUrl || "All");
  const [appliedFilters, setAppliedFilters] = useState({
    locations: [] as string[],
    activities: [] as string[],
  });

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const result = await getPartnerFiltered({
          page: 1,
          limit: 10,
          category: activeFilter === "All" ? undefined : activeFilter,
        });

        if (!("error" in result)) {
          setPartners(result.data || []);

          const meta = result.meta;
          if (meta) {
            const calculatedTotalPages = meta.totalPages || Math.ceil((meta.total || 0) / 10);
            setTotalPages(calculatedTotalPages);
            setTotalPartners(meta.total || 0);

            console.log('Initial Load Meta:', {
              totalPages: calculatedTotalPages,
              total: meta.total,
              dataLength: result.data?.length
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch on filter change
  useEffect(() => {
    if (isInitialLoad) return;

    const controller = new AbortController();

    const fetchPartners = async () => {
      setIsLoading(true);
      try {
        const result = await getPartnerFiltered({
          page: currentPage,
          limit: 10,
          category: activeFilter === "All" ? undefined : activeFilter,
          area: appliedFilters.locations.length > 0 ? appliedFilters.locations : undefined,
          activity: appliedFilters.activities.length > 0 ? appliedFilters.activities : undefined,
        });

        if (controller.signal.aborted) return;

        if (!("error" in result)) {
          const sorted = result.data || [];
          setPartners(prev => (currentPage === 1 ? sorted : [...prev, ...sorted]));

          // Ensure meta is properly set
          const meta = result.meta;
          if (meta) {
            // Calculate totalPages if not provided
            const calculatedTotalPages = meta.totalPages || Math.ceil((meta.total || 0) / 10);

            setTotalPages(calculatedTotalPages);
            setTotalPartners(meta.total || 0);

            console.log('API Response Meta:', {
              totalPages: calculatedTotalPages,
              total: meta.total,
              currentPage: meta.page || currentPage,
              hasNextPage: meta.hasNextPage,
              dataLength: sorted.length
            });
          }
        }
      } catch (err) {
        if ((err as any).name !== 'AbortError') console.error(err);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchPartners();
    return () => controller.abort();
  }, [currentPage, activeFilter, appliedFilters.locations, appliedFilters.activities, isInitialLoad]);

  // Reset on filter change
  useEffect(() => {
    if (isInitialLoad) return;
    setPartners([]);
    setCurrentPage(1);
  }, [activeFilter, appliedFilters.locations, appliedFilters.activities, isInitialLoad]);

  const getCategoryTitles = (partner: Partner): string[] => {
    if (partner.categories && Array.isArray(partner.categories)) {
      return partner.categories.map(cat => typeof cat === "string" ? cat : cat.title);
    }
    if (partner.category) {
      const title = typeof partner.category === "string"
        ? partner.category
        : partner.category?.title;
      return title ? [title] : [];
    }
    return [];
  };

  const filteredPartners = useMemo(() => {
    if (!searchQuery) return partners;

    const query = searchQuery.toLowerCase();
    return partners.filter((partner) => {
      const nameMatches = partner.name?.toLowerCase().includes(query) ?? false;
      const categoryMatches = getCategoryTitles(partner).some(title =>
        title.toLowerCase().includes(query)
      );
      return nameMatches || categoryMatches;
    });
  }, [partners, searchQuery]);

  const hasMore = currentPage < totalPages;

  // Debug logging
  useEffect(() => {
    console.log('Debug Load More:', {
      currentPage,
      totalPages,
      hasMore,
      totalPartners,
      partnersLength: partners.length,
      isLoading
    });
  }, [currentPage, totalPages, hasMore, totalPartners, partners.length, isLoading]);

  const handleFilterClick = useCallback((filter: string) => {
    if (filter === activeFilter) return;

    startTransition(() => {
      setActiveFilter(filter);
      setCurrentPage(1);
      setPartners([]);

      const params = new URLSearchParams(searchParams.toString());
      if (filter === "All") {
        params.delete("filter");
      } else {
        params.set("filter", filter);
      }

      router.push(`/network?${params.toString()}`, { scroll: false });
    });
  }, [activeFilter, router, searchParams]);

  const handleFilterChange = useCallback((filters: any) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setPartners([]);
  }, []);

  const handleLoadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  if (isInitialLoad) {
    return (
      <div className="text-white p-4 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl lg:text-5xl font-bold lg:font-semibold text-center py-4 lg:py-20">
          The Network
        </h2>
        <NetworkSkeleton />
      </div>
    );
  }

  return (
    <div className="text-white p-4 max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl lg:text-5xl font-bold lg:font-semibold text-center py-4 lg:py-20">
        The Network
      </h2>

      <header className="flex justify-end mb-8">
        <Button
          variant="ghost"
          size="lg"
          className="text-white focus:outline-none hover:bg-gray-800 p-2 rounded transition"
          onClick={() => setIsFilterOpen(true)}
        >
          <ListFilter className="h-6 w-6" />
        </Button>
      </header>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 lg:overflow-visible">
        {filters.map((filter) => (
          <Button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            disabled={isPending}
            className={`md:py-2.5 rounded lg:rounded-lg whitespace-nowrap min-w-max ${activeFilter === filter
              ? "bg-white text-black hover:bg-white"
              : "text-white"
              }`}
          >
            {filter}
          </Button>
        ))}
      </div>

      {isLoading && currentPage === 1 && partners.length === 0 && (
        <NetworkSkeleton />
      )}

      <div className="space-y-10">
        {filteredPartners.length === 0 && !isLoading ? (
          <div className="text-center py-10">
            <p className="text-lg opacity-70">No partners found</p>
          </div>
        ) : (
          filteredPartners.map((partner) => (
            <PartnerCard
              key={partner._id}
              partner={partner}
              onClick={(p) => {
                setSelectedPartner(p);
                setIsModalOpen(true);
              }}
            />
          ))
        )}
      </div>

      {!isLoading && hasMore && filteredPartners.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-2">
          <button
            onClick={handleLoadMore}
            className="p-3 rounded-full hover:bg-black/50 cursor-pointer transition"
            aria-label="Load more partners"
          >
            <ChevronDown className="lg:w-10 lg:h-10" />
          </button>
          <p className="text-sm opacity-70">
            Showing {partners.length} of {totalPartners}
          </p>
        </div>
      )}

      {/* Debug info - remove after testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-800 rounded text-xs">
          <p>Current Page: {currentPage}</p>
          <p>Total Pages: {totalPages}</p>
          <p>Has More: {hasMore ? 'Yes' : 'No'}</p>
          <p>Partners: {partners.length} / {totalPartners}</p>
        </div>
      )}

      {isLoading && partners.length > 0 && (
        <div className="mt-10 flex justify-center">
          <BeautifulLoader size="sm" text="Loading..." />
        </div>
      )}

      {isModalOpen && selectedPartner && (
        <PartnerDetailsModal
          onClose={() => setIsModalOpen(false)}
          partner={selectedPartner}
        />
      )}

      {isFilterOpen && (
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
};

export default NetworkFilter;