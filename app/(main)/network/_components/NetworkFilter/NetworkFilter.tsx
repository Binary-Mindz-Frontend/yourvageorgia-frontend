"use client";
import { Button } from "@/components/ui/button";
import img1 from "@/public/assets/network/1.svg";
import img2 from "@/public/assets/network/2.svg";
import img3 from "@/public/assets/network/3.svg";
import img4 from "@/public/assets/network/4.svg";
import { ArrowRight, ChevronDown, Heart, ListFilter } from "lucide-react";
import { useState } from "react";
import NetworkCardModal from "../NetworkCardModal/NetworkCardModal";
import { FilterDrawer } from "./FilterDrawer"; // Import the new component

const NetworkFilter = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Filter drawer state

  const data = [
    {
      img: img1,
      title: "The Hundred Wellness Centre",
      location: "Jumeirah",
      category: "Movement",
      activity: "Gym",
    },
    {
      img: img2,
      title: "Reform Studio",
      location: "Al Quoz",
      category: "Recovery",
      activity: "Reformer Pilates",
    },
    {
      img: img3,
      title: "Urban Yoga",
      location: "Downtown",
      category: "Radiance",
      activity: "Spa",
    },
    {
      img: img4,
      title: "Seva Table",
      location: "Jumeirah",
      category: "Taste",
      activity: "Coffee",
    },
    {
      img: img4,
      title: "New one",
      location: "Palm Jumeirah",
      category: "Taste",
      activity: "Massage",
    },
  ];

  const [appliedFilters, setAppliedFilters] = useState({
    locations: [] as string[],
    activities: [] as string[],
  });

  const filteredData =
    activeFilter === "All"
      ? data
      : data.filter((item) => item.category === activeFilter);

  // Apply drawer filters
  let finalData = showAll ? data : filteredData;

  if (appliedFilters.locations.length > 0) {
    finalData = finalData.filter((item) =>
      appliedFilters.locations.includes(item.location)
    );
  }

  if (appliedFilters.activities.length > 0) {
    finalData = finalData.filter((item) =>
      appliedFilters.activities.includes(item.activity)
    );
  }

  const filters = ["All", "Movement", "Recovery", "Radiance", "Taste"];

  const handleFilterChange = (filters: {
    locations: string[];
    activities: string[];
  }) => {
    setAppliedFilters(filters);
  };

  return (
    <div className="text-white p-4 max-w-4xl mx-auto">

      <div>
        <h2 className="font-serif text-[26px] text-center md:text-5xl lg:my-20">The Network</h2>
      </div>

      <header className="flex justify-end mb-8">
        <Button
          variant="ghost"
          size={"lg"}
          className="text-white focus:outline-none hover:bg-gray-800 p-2 rounded transition cursor-pointer [&_svg:not([class*='size-'])]:size-6"
          onClick={() => setIsFilterOpen(true)}
        >
          <ListFilter className="h-6 w-6" />
        </Button>
      </header>

      {/* Filters */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 lg:overflow-visible">
        {filters.map((filter) => (
          <Button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setShowAll(false);
            }}
            className={`md:py-2.5 rounded lg:rounded-lg whitespace-nowrap min-w-max
        ${
          activeFilter === filter && !showAll
            ? "bg-white text-black hover:bg-white"
            : "text-white"
        }
      `}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-10">
        {finalData.map((item, index) => (
          <div
            key={index}
            onClick={() => setIsModalOpen(true)}
            className="relative w-full h-61 lg:h-auto aspect-video rounded-xl overflow-hidden shadow-2xl cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${item.img.src})`,
                filter: "brightness(0.9) saturate(1.1)",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-1">
                      <h2 className="text-3xl font-light mb-1 font-serif">
                        {item.title}
                      </h2>
                      <button className="text-white hover:text-red-400 p-2">
                        <Heart />
                      </button>
                    </div>

                    <div className="flex items-center text-lg font-light gap-2 italic opacity-80">
                      {item.location}
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
            className="p-3 rounded-full hover:bg-gray-900 transition"
          >
            <ChevronDown className="lg:w-10 lg:h-10" />
          </button>
        </div>
      )}

      {/* Network Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-999 overflow-y-auto">
          <NetworkCardModal onClose={() => setIsModalOpen(false)} />
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
