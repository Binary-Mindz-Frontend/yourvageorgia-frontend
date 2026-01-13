/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, ListFilter } from "lucide-react";
import { FilterDrawer } from "./FilterDrawer";
import PartnerCard from "./PartnerCard";
import { getPartnerFiltered } from "@/services/partner/getpartner";
import { Partner, PartnerCategory } from "@/types/partner.types";
import { NetworkSkeleton } from "@/components/Shared/Loading/NetworkSkeleton";
import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import PartnerDetailsModal from "../NetworkCardModal/PartnerDetailsModal";

interface AppliedFilters {
  locations: string[];
  activities: string[];
}

const NetworkFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filterFromUrl = searchParams.get("filter");
  const searchQuery = searchParams.get("search");

  const [partners, setPartners] = useState<Partner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [totalPartners, setTotalPartners] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    locations: [],
    activities: [],
  });

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const appliedFiltersKey = useMemo(
    () => `${appliedFilters.locations.join(',')}-${appliedFilters.activities.join(',')}`,
    [appliedFilters.locations, appliedFilters.activities]
  );

  useEffect(() => {
    const controller = new AbortController(); // KILL PREVIOUS CALLS

    const fetchPartners = async () => {
      setIsLoading(true);
      try {
        const result = await getPartnerFiltered({
          page: currentPage,
          category: activeFilter === "All" ? undefined : activeFilter,
          area: appliedFilters.locations.length > 0 ? appliedFilters.locations : undefined,
          activity: appliedFilters.activities.length > 0 ? appliedFilters.activities : undefined,
        });

        console.log("Fetched partners for page", result);
        if (controller.signal.aborted) return;

        if ("error" in result) {
          console.error(result.error);
        } else {
          const sorted = result.data || [];
          setPartners(prev => (currentPage === 1 ? sorted : [...prev, ...sorted]));

          const meta = (result as any).meta;
          if (meta) {
            setTotalPages(meta.totalPages || meta.totalPage || 1);
            setTotalPartners(meta.total || 0);
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
  }, [currentPage, activeFilter, appliedFiltersKey]);

  useEffect(() => {
    if (filterFromUrl) {
      setActiveFilter(filterFromUrl);
    }
  }, [filterFromUrl]);

  useEffect(() => {
    if (searchQuery) {
      const matchedCategory = filters.find((filter) => filter.toLowerCase() === searchQuery.toLowerCase());
      if (matchedCategory) {
        setActiveFilter(matchedCategory);
      }
    }
  }, [searchQuery]);


//No partners found problem solved here
  useEffect(() => {
  setPartners([]);        
  setCurrentPage(1);      
}, [activeFilter, appliedFiltersKey]);


  const filters = ["All", "Movement", "Recovery", "Radiance", "Taste"];

  // const getCategoryTitles = (partner: Partner): string[] => {
  //   if (partner.categories && Array.isArray(partner.categories)) {
  //     return partner.categories.map(cat =>
  //       typeof cat === "string" ? cat : cat.title
  //     );
  //   }

  //   if (partner.category) {
  //     const categoryTitle = typeof partner.category === "string"
  //       ? partner.category
  //       : (partner.category as PartnerCategory)?.title;
  //     return categoryTitle ? [categoryTitle] : [];
  //   }

  //   return [];
  // };

  const getCategoryTitles = (partner: Partner): string[] => {
  if (partner.categories && Array.isArray(partner.categories)) {
    return partner.categories.map(cat => typeof cat === "string" ? cat : cat.title);
  }
  if (partner.category) {
    const title = typeof partner.category === "string" ? partner.category : (partner.category as PartnerCategory)?.title;
    return title ? [title] : [];
  }
  return [];
};

  // let filteredPartners = partners;

  // if (searchQuery) {
  //   filteredPartners = filteredPartners.filter((partner) => {
  //     const nameMatches = partner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
  //     const categoryTitles = getCategoryTitles(partner);
  //     const categoryMatches = categoryTitles.some(title =>
  //       title.toLowerCase().includes(searchQuery.toLowerCase())
  //     );

  //     return nameMatches || categoryMatches;
  //   });
  // }

  const filteredPartners = useMemo(() => {
    if (!searchQuery) return partners;

    const query = searchQuery.toLowerCase();

    return partners.filter((partner) => {
      const nameMatches =
        partner.name?.toLowerCase().includes(query) ?? false;

      const categoryMatches = getCategoryTitles(partner).some(title =>
        title.toLowerCase().includes(query)
      );

      return nameMatches || categoryMatches;
    });
  }, [partners, searchQuery]);


  const displayedPartners = filteredPartners ?? [];
  const hasMore = currentPage < totalPages;

  const handleFilterClick = (filter: string) => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
    setCurrentPage(1);
    setPartners([]);

    if (filter === "All") {
      router.push("/network", { scroll: false });
    } else {
      router.push(`/network?filter=${encodeURIComponent(filter)}`, { scroll: false });
    }
  };

  const handleFilterChange = (filters: AppliedFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setPartners([]);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

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
        >
          <ListFilter className="h-6 w-6" />
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

      {/* Loading State */}
      {isLoading && currentPage === 1 && partners.length === 0 && (
        <div className="py-10">
          <NetworkSkeleton />
        </div>
      )}

      {(partners.length > 0 || !isLoading) && (
        <div className="space-y-10">
          {displayedPartners.length === 0 && !isLoading ? (
            <div className="text-center py-10">
              <p className="text-lg opacity-70">No partners found</p>
            </div>
          ) : (
            displayedPartners.map((partner) => (
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
      )}

      {/* Load More Button */}
      {!isLoading && hasMore && (
        <div className="mt-10 flex flex-col items-center gap-2">
          <button
            onClick={handleLoadMore}
            className="p-3 rounded-full hover:bg-black/50 cursor-pointer transition"
          >
            <ChevronDown className="lg:w-10 lg:h-10" />
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