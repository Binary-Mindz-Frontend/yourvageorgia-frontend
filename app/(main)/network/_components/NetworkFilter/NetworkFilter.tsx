
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import { NetworkSkeleton } from "@/components/Shared/Loading/NetworkSkeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPartnerFiltered } from "@/services/partner/getpartner";
import { Partner, PartnerCategory } from "@/types/partner.types";
import { ArrowUp, ChevronDown, ListFilter } from "lucide-react";
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
  categories: string[];
}

const NetworkFilter = ({
  initialData,
  initialMeta,
  initialFilter = "All",
  searchQuery: initialSearchQuery,
  categories = ["All", "Movement", "Recovery", "Radiance", "Taste"]
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [city, setCity] = useState("Dubai");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

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
        womenOnly: filters.gender === 'women' ? true : undefined,
        mixed: filters.gender === 'mixed' ? true : undefined,
      });

      if (controller.signal.aborted) return;

      if ("error" in result) {
        console.error(result.error);
        return;
      }

      const sorted = result.data || [];

      setPartners(prev => {
        if (resetData) return sorted;
        // Deduplicate by _id when appending paginated results
        const existingIds = new Set(prev.map(p => p._id));
        const newPartners = sorted.filter((p: Partner) => !existingIds.has(p._id));
        return [...prev, ...newPartners];
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
      const matchedCategory = categories.find(
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

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          handleLoadMore();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, handleLoadMore]);

  // Scroll to Top Listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleClickOutside = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePartnerClick = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  }, []);

  // Custom scroll functionality
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);

  const dragThreshold = 5;

  // ------------------------
  // Drag Logic
  // ------------------------
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = scrollRef.current;
    if (!slider) return;

    setIsDragging(true);
    hasDragged.current = false;

    startX.current = e.pageX - slider.offsetLeft;
    scrollLeftStart.current = slider.scrollLeft;
  };

  const onMouseLeave = () => setIsDragging(false);

  const onMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => (hasDragged.current = false), 50);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const slider = scrollRef.current;
    if (!slider) return;

    const x = e.pageX - slider.offsetLeft;
    const walk = x - startX.current;

    if (Math.abs(walk) > dragThreshold) {
      hasDragged.current = true;
    }

    slider.scrollLeft = scrollLeftStart.current - walk * 1.5;
  };

  return (
    <div className="text-white p-4 max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl lg:text-5xl font-bold lg:font-semibold text-center py-4 lg:py-20">
        The Network
      </h2>

      {/* City Selection & Filter Header */}
      <header className="flex items-center justify-between mb-8 relative">
        <div className="relative" ref={cityRef}>
          <button
            onClick={() => setIsCityOpen(!isCityOpen)}
            className="w-auto min-w-35 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full px-5 h-10 focus:outline-none hover:bg-white/5 transition-all font-light tracking-wide shadow-lg flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="truncate">{city}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCityOpen && (
            <div className="absolute top-full left-0 mt-2 w-full min-w-40 bg-black border border-white/10 text-white shadow-2xl rounded-xl p-1.5 animate-in fade-in zoom-in duration-200 origin-top-left space-y-0.5">
              {["Dubai", "London"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setCity(option);
                    setIsCityOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-light transition-all duration-200 rounded-lg hover:bg-white/10 cursor-pointer text-white/70 hover:text-white ${city === option ? 'text-white font-normal bg-white/5' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

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

      <div
        ref={scrollRef}
        className="flex gap-4 mb-8 overflow-x-auto pb-2
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]
        scroll-smooth
        snap-x snap-mandatory
        cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {categories.map((filter) => (
          <button
            key={filter}
            onClick={(e) => {
              if (hasDragged.current) {
                e.preventDefault();
                return;
              }
              handleFilterClick(filter);
            }}
            className={`snap-start py-2.5 px-5 rounded-lg whitespace-nowrap
              border border-white/10
              transition-all duration-200
              min-w-max
              ${activeFilter === filter
                ? "bg-white text-black"
                : "text-white hover:bg-white/10"
              }`}
          >
            {filter}
          </button>
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
              key={`${partner._id}-${index}`}
              partner={partner}
              onClick={handlePartnerClick}
              priority={index < 2}
            />
          ))
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && displayedPartners.length > 0 && (
        <div ref={observerTarget} className="h-10 w-full" />
      )}

      {isLoading && partners.length > 0 && (
        <div className="mt-6 flex justify-center">
          <BeautifulLoader size="sm" text="Loading more partners" />
        </div>
      )}

      {displayedPartners.length > 0 && (
        <div className="mt-10 mb-8 flex flex-col items-center gap-2">
          <p className="text-sm opacity-70">
            {hasMore
              ? `Showing ${partners.length} of ${totalPartners}`
              : `Showing all ${totalPartners} partners`}
          </p>
        </div>
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 p-2 md:p-3 rounded-full  bg-white/10 hover:bg-white/20 md:bg-transparent md:hover:bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all duration-300 z-50 group shadow-xl",
          showScrollTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-y-1 transition-transform" />
      </button>

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