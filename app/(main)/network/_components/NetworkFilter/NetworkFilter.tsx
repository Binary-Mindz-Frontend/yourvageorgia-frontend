"use client"
import { useState } from "react";
import img1 from "@/public/assets/network/1.svg";
import img2 from "@/public/assets/network/2.svg";
import img3 from "@/public/assets/network/3.svg";
import img4 from "@/public/assets/network/4.svg";
import { ArrowRight, Heart, ListFilter, ChevronDown } from "lucide-react";

const NetworkFilter = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const data = [
    { img: img1, title: "The Hundred Wellness Centre", location: "Jumeirah", category: "Movement" },
    { img: img2, title: "Reform Studio", location: "Al Quoz", category: "Recovery" },
    { img: img3, title: "Urban Yoga", location: "Downtown Dubai", category: "Radiance" },
    { img: img4, title: "Seva Table", location: "Jumeirah", category: "Taste" },
    { img: img4, title: "New one", location: "Jumeirah", category: "Taste" },
  ];

  // Filter logic
  const filteredData =
    activeFilter === "All" ? data : data.filter((item) => item.category === activeFilter);

  // If "Show All" clicked → ignore filter and show everything
  const finalData = showAll ? data : filteredData;

  const filters = ["All", "Movement", "Recovery", "Radiance", "Taste"];

  return (
    <div className="text-white p-4 max-w-4xl mx-auto">
      <header className="flex justify-end mb-8">
        <button className="text-white focus:outline-none" aria-label="Menu">
          <ListFilter />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex space-x-2 sm:space-x-3 mb-8 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setShowAll(false); // reset show-all
            }}
            className={`px-4 py-3 w-full text-sm lg:text-base font-medium rounded-lg whitespace-nowrap shadow-md transition-colors
              ${
                activeFilter === filter && !showAll
                  ? "bg-white text-black"
                  : "border border-gray-700 text-white hover:bg-gray-800"
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Dynamic Cards */}
      <div className="space-y-10">
        {finalData.map((item, index) => (
          <div
            key={index}
            className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${item.img.src})`,
                filter: "brightness(0.9) saturate(1.1)",
              }}
            >
              <div className="absolute inset-0 bg-leniar-to-t from-black/80 via-black/30 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-1">
                      <h2 className="text-3xl font-light mb-1 font-serif">
                        {item.title}
                      </h2>
                      <button
                        className="text-white hover:text-red-400 transition-colors p-2"
                        aria-label="Favorite"
                      >
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

      {/* Bottom Arrow Button */}
      {!showAll && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="p-3 cursor-pointer rounded-full hover:bg-gray-900 transition"
            aria-label="Show All"
          >
            <ChevronDown className="lg:w-10 lg:h-10 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NetworkFilter;
