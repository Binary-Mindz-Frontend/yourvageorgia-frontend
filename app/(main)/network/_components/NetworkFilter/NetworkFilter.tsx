/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import { NetworkSkeleton } from "@/components/Shared/Loading/NetworkSkeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPartnerFiltered } from "@/services/partner/getpartner";
import { Partner, PartnerCategory } from "@/types/partner.types";
import { ChevronDown, ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import PartnerDetailsModal from "../NetworkCardModal/PartnerDetailsModal";
import { FilterDrawer } from "./FilterDrawer";
import PartnerCard from "./PartnerCard";

interface AppliedFilters {
  locations: string[];
  activities: string[];
  gender: 'all' | 'women' | 'mixed';
}

interface NetworkFilterProps {
  initialData: Partner[];
  initialMeta: {
    total: number;
    totalPages?: number;
    totalPage?: number;
    page: number;
    limit: number;
  };
  initialFilter?: string;
  searchQuery?: string;
}

const NetworkFilter = ({
  initialData,
  initialMeta,
  initialFilter = "All",
  searchQuery: initialSearchQuery
}: NetworkFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [partners, setPartners] = useState<Partner[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialMeta?.totalPages || initialMeta?.totalPage || 1);
  const [totalPartners, setTotalPartners] = useState(initialMeta?.total || 0);

  // UX improvement: Track first render to prevent "no partners found" flicker
  const isFirstRender = useRef(true);
  const [hasInitialData] = useState(() => initialData.length > 0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    locations: [],
    activities: [],
    gender: 'all',
  });
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);

  const abortControllerRef = useRef<AbortController | null>(null);
  const filterFromUrl = searchParams.get("filter");
  const searchQuery = searchParams.get("search") || initialSearchQuery;

  const appliedFiltersKey = useMemo(
    () => `${appliedFilters.locations.join(',')}-${appliedFilters.activities.join(',')}-${appliedFilters.gender}`,
    [appliedFilters]
  );

  // Track if we should use initial data
  const shouldUseInitialData = useRef(true);

  // Fetch function
  const fetchPartners = useCallback(async (
    page: number,
    filter: string,
    filters: AppliedFilters,
    resetData: boolean = false
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);

    try {
      const result = await getPartnerFiltered({
        page,
        limit: 10,
        category: filter === "All" ? undefined : filter,
        area: filters.locations.length > 0 ? filters.locations : undefined,
        activity: filters.activities.length > 0 ? filters.activities : undefined,
        womenOnly: filters.gender === 'women' ? true : filters.gender === 'mixed' ? false : undefined,
      });

      if (controller.signal.aborted) return;

      if ("error" in result) {
        console.error(result.error);
        return;
      }

      const sorted = result.data || [];

      setPartners(prev => {
        if (resetData) return sorted;
        return [...prev, ...sorted];
      });

      const meta = (result as any).meta;
      if (meta) {
        setTotalPages(meta.totalPages || meta.totalPage || 1);
        setTotalPartners(meta.total || 0);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Fetch error:', err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        isFirstRender.current = false;
      }
    }
  }, []);

  // Sync URL filter changes
  useEffect(() => {
    const filterFromUrlParsed = filterFromUrl || "All";
    if (filterFromUrlParsed !== activeFilter) {
      shouldUseInitialData.current = false;
      setActiveFilter(filterFromUrlParsed);
      setCurrentPage(1);
      fetchPartners(1, filterFromUrlParsed, appliedFilters, true);
    }
  }, [filterFromUrl]);

  // Sync search query
  useEffect(() => {
    if (searchQuery) {
      const filters = ["All", "Movement", "Recovery", "Radiance", "Taste"];
      const matchedCategory = filters.find(
        (filter) => filter.toLowerCase() === searchQuery.toLowerCase()
      );
      if (matchedCategory && matchedCategory !== activeFilter) {
        setActiveFilter(matchedCategory);
        setCurrentPage(1);
        fetchPartners(1, matchedCategory, appliedFilters, true);
      }
    }
  }, [searchQuery]);

  // Handle pagination (page > 1)
  useEffect(() => {
    if (currentPage > 1) {
      shouldUseInitialData.current = false;
      fetchPartners(currentPage, activeFilter, appliedFilters, false);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage]);

  // Handle filter changes (locations/activities/gender)
  useEffect(() => {
    // Skip if it's the first render and we should use initial data
    if (shouldUseInitialData.current) return;

    setCurrentPage(1);
    fetchPartners(1, activeFilter, appliedFilters, true);
  }, [appliedFiltersKey]);

  const filters = ["All", "Movement", "Recovery", "Radiance", "Taste"];

  const getCategoryTitles = useCallback((partner: Partner): string[] => {
    if (partner.categories && Array.isArray(partner.categories)) {
      return partner.categories.map(cat =>
        typeof cat === "string" ? cat : cat.title
      );
    }
    if (partner.category) {
      const title = typeof partner.category === "string"
        ? partner.category
        : (partner.category as PartnerCategory)?.title;
      return title ? [title] : [];
    }
    return [];
  }, []);

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
  }, [partners, searchQuery, getCategoryTitles]);

  const displayedPartners = filteredPartners ?? [];
  const hasMore = currentPage < totalPages;

  const handleFilterClick = useCallback((filter: string) => {
    if (filter === activeFilter) return;

    shouldUseInitialData.current = false;

    // Update button state immediately for instant feedback
    setActiveFilter(filter);
    setCurrentPage(1);

    // Transition only wraps the async operations (URL update + fetch)
    startTransition(() => {
      if (filter === "All") {
        router.push("/network", { scroll: false });
      } else {
        router.push(`/network?filter=${encodeURIComponent(filter)}`, { scroll: false });
      }

      fetchPartners(1, filter, appliedFilters, true);
    });
  }, [activeFilter, router, appliedFilters, fetchPartners]);

  const handleFilterChange = useCallback((filters: AppliedFilters) => {
    shouldUseInitialData.current = false;
    setAppliedFilters(filters);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  const handlePartnerClick = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="text-white p-4 max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl lg:text-5xl font-bold lg:font-semibold text-center py-4 lg:py-20">
        The Network
      </h2>

      {/* Filter Button */}
      <header className="flex justify-end mb-8">
        <Button
          variant="ghost"
          size="lg"
          className="text-white focus:outline-none hover:bg-gray-800 p-2 rounded transition [&_svg:not([class*='size-'])]:size-6"
          onClick={() => setIsFilterOpen(true)}
          aria-label="Open filter options"
        >
          <ListFilter className="h-6 w-6" aria-hidden="true" />
        </Button>
      </header>

      {/* Category Filters */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 lg:overflow-visible">
        {filters.map((filter) => (
          <Button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`md:py-2.5 rounded lg:rounded-lg whitespace-nowrap min-w-max ${activeFilter === filter
              ? "bg-white text-black hover:bg-white"
              : "text-white"
              }`}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Loading State - Only show skeleton when truly empty and loading */}
      {isLoading && partners.length === 0 && !hasInitialData && (
        <div className="py-10">
          <NetworkSkeleton />
        </div>
      )}

      {/* Content with opacity transition for smooth filter changes */}
      <div
        className={cn(
          "space-y-10 transition-opacity duration-200",
          isLoading && currentPage === 1 && partners.length > 0 ? "opacity-60" : "opacity-100"
        )}
      >
        {/* Only show empty state after loading completes and not first render */}
        {!isLoading && displayedPartners.length === 0 && !isFirstRender.current ? (
          <div className="text-center py-10">
            <p className="text-lg opacity-70">No partners found</p>
          </div>
        ) : (
          displayedPartners.map((partner, index) => (
            <PartnerCard
              key={partner._id}
              partner={partner}
              onClick={handlePartnerClick}
              priority={index < 2}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {!isLoading && hasMore && displayedPartners.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-2">
          <button
            onClick={handleLoadMore}
            className="p-3 rounded-full hover:bg-black/50 cursor-pointer transition"
            aria-label="Load more partners"
          >
            <ChevronDown className="lg:w-10 lg:h-10" aria-hidden="true" />
          </button>
          <p className="text-sm opacity-70">
            Showing {partners.length} of {totalPartners}
          </p>
        </div>
      )}

      {isLoading && partners.length > 0 && (
        <div className="mt-10 flex justify-center">
          <BeautifulLoader size="sm" text="Loading more partners" />
        </div>
      )}

      {/* Partner Modal */}
      {isModalOpen && selectedPartner && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-999 overflow-y-auto scrollbar-hide">
          <PartnerDetailsModal
            onClose={() => setIsModalOpen(false)}
            partner={selectedPartner}
          />
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default NetworkFilter;