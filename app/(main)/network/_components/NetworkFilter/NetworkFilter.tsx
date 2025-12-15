"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Heart, ListFilter } from "lucide-react";
import { FilterDrawer } from "./FilterDrawer";
import PartnerDetailsModal from "../NetworkCardModal/PartnerDetailsModal";

interface Partner {
  _id: string;
  name: string;
  address: string;
  category: { title: string };
  thumbnail: string;
}

interface AppliedFilters {
  locations: string[];
  activities: string[];
}

const NetworkFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

const filterFromUrl = searchParams.get("filter");

  const [partners, setPartners] = useState<Partner[]>([]);
  
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    locations: [],
    activities: [],
  });

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("http://82.25.109.232:5000/api/partner", {
          cache: "no-store",
        });
        const data = await res.json();
        setPartners(data.data || []);
      } catch (err) {
        console.error("Failed to fetch partners:", err);
      }
    };
    fetchPartners();
  }, []);

  // Set active filter from URL after first render
  const [activeFilter, setActiveFilter] = useState("All");
  useEffect(() => {
    if (filterFromUrl) {
      setActiveFilter(filterFromUrl);
    }
  }, [filterFromUrl]);

  const filters = ["All", "Movement", "Recovery", "Radiance", "Taste"];

  // Filter partners by category
  let filteredPartners =
    activeFilter === "All"
      ? partners
      : partners.filter((p) => p.category.title === activeFilter);

  // Apply drawer filters
  if (appliedFilters.locations.length > 0) {
    filteredPartners = filteredPartners.filter((p) =>
      appliedFilters.locations.includes(p.address)
    );
  }

  if (appliedFilters.activities.length > 0) {
    filteredPartners = filteredPartners.filter((p) =>
      appliedFilters.activities.includes(p.name)
    );
  }

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setShowAll(false);

    // Update URL without full reload
    if (filter === "All") {
      router.push("/network");
    } else {
      router.push(`/network?filter=${encodeURIComponent(filter)}`);
    }
  };

  const handleFilterChange = (filters: AppliedFilters) => {
    setAppliedFilters(filters);
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
            className={`md:py-2.5 rounded lg:rounded-lg whitespace-nowrap min-w-max ${
              activeFilter === filter && !showAll
                ? "bg-white text-black hover:bg-white"
                : "text-white"
            }`}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Partner Cards */}
      <div className="space-y-10">
        {filteredPartners.map((partner) => (
          <div
            key={partner._id}
            onClick={() => {
              setSelectedPartner(partner);
              setIsModalOpen(true);
            }}
            className="relative w-full h-61 lg:h-auto aspect-video rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${partner.thumbnail})`,
                filter: "brightness(1.05) saturate(1.2)",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/10 via-black/10 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-1">
                      <h2 className="text-lg lg:text-3xl font-semibold mb-1 font-serif">
                        {partner.name}
                      </h2>
                      <button className="text-white hover:text-red-400 cursor-pointer p-2">
                        <Heart />
                      </button>
                    </div>

                    <div className="flex items-center text-sm lg:text-lg gap-2 italic opacity-80">
                      {partner.address}
                      <ArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show All Arrow */}
      {!showAll && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="p-3 rounded-full hover:bg-black/50 cursor-pointer transition"
          >
            <ChevronDown className="lg:w-10 lg:h-10" />
          </button>
        </div>
      )}

      {/* Partner Modal */}
      {isModalOpen && selectedPartner && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-999 overflow-y-auto">
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
