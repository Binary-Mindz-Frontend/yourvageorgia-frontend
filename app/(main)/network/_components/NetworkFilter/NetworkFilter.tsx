
'use client'

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, ListFilter } from "lucide-react";
import { FilterDrawer } from "./FilterDrawer";
import PartnerCard from "./PartnerCard";
import { getPartners } from "@/services/partner/getpartner";
import { Partner, PartnerCategory } from "@/types/partner.types";
import { NetworkSkeleton } from "@/components/Shared/Loading/NetworkSkeleton";
import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";

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
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(10); // Display er jonno count

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    locations: [],
    activities: [],
  });

  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Fetch ALL partners at once (no limit)
  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      try {
        // Fetch without limit to get all partners for filtering
        const result = await getPartners({ limit: 1000 }); // Large limit or modify API to fetch all
        // console.log(result);

        if ("error" in result) {
          console.error("Failed to fetch partners:", result.error);
          setPartners([]);
        } else {
          const sortedPartners = [...(result.data || [])].sort(
            (a, b) => (a.position ?? 0) - (b.position ?? 0)
          );

          setPartners(sortedPartners);
        }
      } catch (err) {
        console.error("Failed to fetch partners:", err);
        setPartners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Set active filter from URL
  useEffect(() => {
    if (filterFromUrl) {
      setActiveFilter(filterFromUrl);
    }
  }, [filterFromUrl]);

  // Update activeFilter if search query matches category
  useEffect(() => {
    if (searchQuery) {
      const matchedCategory = filters.find((filter) => filter.toLowerCase() === searchQuery.toLowerCase());
      if (matchedCategory) {
        setActiveFilter(matchedCategory);
      }
    }
  }, [searchQuery]);

  const filters = ["All", "Movement", "Recovery", "Radiance", "Taste"];

  // Helper function to get category titles
  const getCategoryTitles = (partner: Partner): string[] => {
    if (partner.categories && Array.isArray(partner.categories)) {
      return partner.categories.map(cat =>
        typeof cat === "string" ? cat : cat.title
      );
    }

    if (partner.category) {
      const categoryTitle = typeof partner.category === "string"
        ? partner.category
        : (partner.category as PartnerCategory)?.title;
      return categoryTitle ? [categoryTitle] : [];
    }

    return [];
  };

  // COMPLETE FILTERING (on all partners)
  let filteredPartners =
    activeFilter === "All"
      ? partners
      : partners.filter((p) => {
        const categoryTitles = getCategoryTitles(p);
        return categoryTitles.includes(activeFilter);
      });

  // Apply drawer filters
  if (appliedFilters.locations.length > 0) {
    filteredPartners = filteredPartners.filter((p) => {
      if (!p.contacts || !Array.isArray(p.contacts) || p.contacts.length === 0) return false;

      return p.contacts.some((contact) => {
        const location = contact.area || contact.address;
        return location !== undefined && appliedFilters.locations.includes(location);
      });
    });
  }

  if (appliedFilters.activities.length > 0) {
    filteredPartners = filteredPartners.filter((p) => {
      if (!p.activity || !Array.isArray(p.activity) || p.activity.length === 0) return false;

      return p.activity.some((act) => {
        if (typeof act === 'object' && act !== null && 'title' in act) {
          const activityObj = act as { title: string };
          return appliedFilters.activities.includes(activityObj.title);
        }
        return false;
      });
    });
  }

  // Apply search query filter
  if (searchQuery) {
    filteredPartners = filteredPartners.filter((partner) => {
      const nameMatches = partner.name.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryTitles = getCategoryTitles(partner);
      const categoryMatches = categoryTitles.some(title =>
        title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return nameMatches || categoryMatches;
    });
  }

  // PAGINATION: Display only first 'displayCount' items
  const displayedPartners = filteredPartners.slice(0, displayCount);
  const hasMore = displayCount < filteredPartners.length;

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setDisplayCount(10); // Reset to 10 when filter changes

    if (filter === "All") {
      router.push("/network");
    } else {
      router.push(`/network?filter=${encodeURIComponent(filter)}`);
    }
  };

  const handleFilterChange = (filters: AppliedFilters) => {
    setAppliedFilters(filters);
    setDisplayCount(10); // Reset to 10 when drawer filter changes
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10);
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
      {isLoading && partners.length === 0 && (
        <div className="py-10">
          <NetworkSkeleton />
        </div>
      )}

      {!isLoading && (
        <div className="space-y-10">
          {displayedPartners.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg opacity-70">No partners found</p>
            </div>
          ) : (
            displayedPartners.map((partner) => (
              <PartnerCard
                key={partner._id}
                partner={partner}
                onClick={(p) => {
                  router.push(`/network/${p._id}`);
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
            Showing {displayedPartners.length} of {filteredPartners.length}
          </p>
        </div>
      )}

      {isLoading && partners.length > 0 && (
        <div className="mt-10 flex justify-center">
          <BeautifulLoader size="sm" text="Loading more partners" />
        </div>
      )}

      {/* Partner Modal */}
      {/* {isModalOpen && selectedPartner && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-999 overflow-y-auto scrollbar-hide">
          <PartnerDetailsModal
            onClose={() => setIsModalOpen(false)}
            partner={selectedPartner}
          />
        </div>
      )} */}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
        partners={partners}
      />
    </div>
  );
};

export default NetworkFilter;