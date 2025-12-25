// 'use client'

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, ChevronDown, ListFilter } from "lucide-react";
// import { FilterDrawer } from "./FilterDrawer";
// import PartnerDetailsModal from "../NetworkCardModal/PartnerDetailsModal";
// import FavouriteButton from "./FavouriteButton";
// import { getPartners } from "@/services/partner/getpartner";
// import { Partner, PartnerCategory } from "@/types/partner.types";

// interface AppliedFilters {
//   locations: string[];
//   activities: string[];
// }

// const NetworkFilter = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const filterFromUrl = searchParams.get("filter"); // Category filter from URL
//   const searchQuery = searchParams.get("search"); // Search query from URL

//   const [partners, setPartners] = useState<Partner[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const [showAll, setShowAll] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
//     locations: [],
//     activities: [],
//   });

//   const [activeFilter, setActiveFilter] = useState<string>("All");

//   // Fetch partners using getPartners function
//   useEffect(() => {
//     const fetchPartners = async () => {
//       setIsLoading(true);
//       try {
//         const result = await getPartners({});
//         console.log(result);

//         if ("error" in result) {
//           console.error("Failed to fetch partners:", result.error);
//           setPartners([]);
//         } else {
//           const sortedPartners = [...(result.data || [])].sort(
//             (a, b) => (a.position ?? 0) - (b.position ?? 0)
//           );

//           setPartners(sortedPartners);
//         }
//       } catch (err) {
//         console.error("Failed to fetch partners:", err);
//         setPartners([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPartners();
//   }, []);


//   // Set active filter from URL after first render
//   useEffect(() => {
//     if (filterFromUrl) {
//       setActiveFilter(filterFromUrl); // Set filter when URL query is present
//     }
//   }, [filterFromUrl]);

//   // Update activeFilter if search query matches category title
//   useEffect(() => {
//     if (searchQuery) {
//       // Check if the search query matches any of the category titles
//       const matchedCategory = filters.find((filter) => filter.toLowerCase() === searchQuery.toLowerCase());
//       if (matchedCategory) {
//         setActiveFilter(matchedCategory);
//       }
//     }
//   }, [searchQuery]);

//   const filters = ["All", "Movement", "Recovery", "Radiance", "Taste"];

//   // Filter partners by category
//   let filteredPartners =
//     activeFilter === "All"
//       ? partners
//       : partners.filter((p) => {
//         // Handle both string and PartnerCategory types
//         const categoryTitle = typeof p.category === "string"
//           ? p.category
//           : (p.category as PartnerCategory)?.title;
//         return categoryTitle === activeFilter;
//       });

//   // Apply drawer filters
//   if (appliedFilters.locations.length > 0) {
//   filteredPartners = filteredPartners.filter((p) => {
//     if (!p.contacts || !Array.isArray(p.contacts) || p.contacts.length === 0) return false;

//     // Check if any of the partner's contact areas match the applied filters
//     return p.contacts.some((contact) => {
//       const location = contact.area || contact.address;
//       return location !== undefined && appliedFilters.locations.includes(location);
//     });
//   });
// }

// if (appliedFilters.activities.length > 0) {
//   filteredPartners = filteredPartners.filter((p) => {
//     if (!p.activity || !Array.isArray(p.activity) || p.activity.length === 0) return false;

//     // Check if any of the partner's activities match the applied filters
//     return p.activity.some((act) => {
//       // Type guard to ensure act is an object with a title property
//       if (typeof act === 'object' && act !== null && 'title' in act) {
//         const activityObj = act as { title: string };
//         return appliedFilters.activities.includes(activityObj.title);
//       }
//       return false;
//     });
//   });
// }

//   // Apply search query filter for both partner name and category title
//   if (searchQuery) {
//     filteredPartners = filteredPartners.filter((partner) => {
//       const nameMatches = partner.name.toLowerCase().includes(searchQuery.toLowerCase());
//       const categoryMatches = typeof partner.category === "object"
//         ? (partner.category as PartnerCategory)?.title.toLowerCase().includes(searchQuery.toLowerCase())
//         : partner.categories[0].toLowerCase().includes(searchQuery.toLowerCase());

//       return nameMatches || categoryMatches;
//     });
//   }

//   const handleFilterClick = (filter: string) => {
//     setActiveFilter(filter); // Set the active filter to the selected category
//     setShowAll(false);

//     // Update URL without full reload
//     if (filter === "All") {
//       router.push("/network");
//     } else {
//       router.push(`/network?filter=${encodeURIComponent(filter)}`);
//     }
//   };

//   const handleFilterChange = (filters: AppliedFilters) => {
//     setAppliedFilters(filters);
//   };

//   return (
//     <div className="text-white p-4 max-w-4xl mx-auto">
//       <h2 className="font-serif text-3xl lg:text-5xl font-bold lg:font-semibold text-center py-4 lg:py-20">
//         The Network
//       </h2>

//       {/* Filter Button */}
//       <header className="flex justify-end mb-8">
//         <Button
//           variant="ghost"
//           size="lg"
//           className="text-white focus:outline-none hover:bg-gray-800 p-2 rounded transition [&_svg:not([class*='size-'])]:size-6"
//           onClick={() => setIsFilterOpen(true)}
//         >
//           <ListFilter className="h-6 w-6" />
//         </Button>
//       </header>

//       {/* Category Filters */}
//       <div className="flex gap-4 mb-8 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 lg:overflow-visible">
//         {filters.map((filter) => (
//           <Button
//             key={filter}
//             onClick={() => handleFilterClick(filter)}
//             className={`md:py-2.5 rounded lg:rounded-lg whitespace-nowrap min-w-max ${activeFilter === filter && !showAll
//                 ? "bg-white text-black hover:bg-white"
//                 : "text-white"
//               }`}
//           >
//             {filter}
//           </Button>
//         ))}
//       </div>

//       {/* Loading State */}
//       {isLoading && (
//         <div className="text-center py-10">
//           <p className="text-lg">Loading partners...</p>
//         </div>
//       )}

//       {/* Partner Cards */}
//       {!isLoading && (
//         <div className="space-y-10">
//           {filteredPartners.length === 0 ? (
//             <div className="text-center py-10">
//               <p className="text-lg opacity-70">No partners found</p>
//             </div>
//           ) : (
//             filteredPartners.map((partner) => (
//               <div
//                 key={partner._id}
//                 onClick={() => {
//                   setSelectedPartner(partner);
//                   setIsModalOpen(true);
//                 }}
//                 className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
//               >
//                 <div
//                   className="absolute inset-0 bg-cover bg-center"
//                   style={{
//                     backgroundImage: `url(${partner.thumbnail})`,
//                     filter: "brightness(1.05) saturate(1.2)",
//                   }}
//                 >
//                   <div className="absolute inset-0 bg-linear-to-t from-black/10 via-black/10 to-transparent"></div>

//                   <FavouriteButton
//                     partnerId={partner._id || ""}
//                     className="left-64 bottom-14"
//                   />

//                   <div className="absolute bottom-0 left-0 p-6 text-white">
//                     <h2 className="text-lg lg:text-3xl font-semibold mb-1 font-serif">
//                       {partner.name}
//                     </h2>

//                     <div className="flex items-center text-sm lg:text-lg gap-2 italic opacity-80">
//                       {partner.contacts && partner.contacts.length > 0
//                         ? (partner.contacts[0].area || partner.contacts[0].address || "Location not specified")
//                         : "Location not specified"}
//                       <ArrowRight />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* Show All Arrow */}
//       {!showAll && !isLoading && filteredPartners.length > 0 && (
//         <div className="mt-10 flex justify-center">
//           <button
//             onClick={() => setShowAll(true)}
//             className="p-3 rounded-full hover:bg-black/50 cursor-pointer transition"
//           >
//             <ChevronDown className="lg:w-10 lg:h-10" />
//           </button>
//         </div>
//       )}

//       {/* Partner Modal */}
//       {isModalOpen && selectedPartner && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-999 overflow-y-auto scrollbar-hide">
//           <PartnerDetailsModal
//             onClose={() => setIsModalOpen(false)}
//             partner={selectedPartner}
//           />
//         </div>
//       )}

//       {/* Filter Drawer - Now receives all partners data */}
//       <FilterDrawer
//         isOpen={isFilterOpen}
//         onClose={() => setIsFilterOpen(false)}
//         onFilterChange={handleFilterChange}
//         partners={partners}
//       />
//     </div>
//   );
// };

// export default NetworkFilter;

'use client'

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ListFilter } from "lucide-react";
import { FilterDrawer } from "./FilterDrawer";
import PartnerDetailsModal from "../NetworkCardModal/PartnerDetailsModal";
import FavouriteButton from "./FavouriteButton";
import PartnerCard from "./PartnerCard";
import { getPartners } from "@/services/partner/getpartner";
import { Partner, PartnerCategory } from "@/types/partner.types";

interface AppliedFilters {
  locations: string[];
  activities: string[];
}

const NetworkFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filterFromUrl = searchParams.get("filter"); // Category filter from URL
  const searchQuery = searchParams.get("search"); // Search query from URL

  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    locations: [],
    activities: [],
  });

  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Fetch partners using getPartners function
  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      try {
        const result = await getPartners({});
        console.log(result);

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

  // Set active filter from URL after first render
  useEffect(() => {
    if (filterFromUrl) {
      setActiveFilter(filterFromUrl);
    }
  }, [filterFromUrl]);

  // Update activeFilter if search query matches category title
  useEffect(() => {
    if (searchQuery) {
      const matchedCategory = filters.find((filter) => filter.toLowerCase() === searchQuery.toLowerCase());
      if (matchedCategory) {
        setActiveFilter(matchedCategory);
      }
    }
  }, [searchQuery]);

  const filters = ["All", "Movement", "Recovery", "Radiance", "Taste"];

  // Helper function to get category titles from partner
  const getCategoryTitles = (partner: Partner): string[] => {
    // Handle new multi-category format
    if (partner.categories && Array.isArray(partner.categories)) {
      return partner.categories.map(cat =>
        typeof cat === "string" ? cat : cat.title
      );
    }

    // Handle old single category format (backward compatibility)
    if (partner.category) {
      const categoryTitle = typeof partner.category === "string"
        ? partner.category
        : (partner.category as PartnerCategory)?.title;
      return categoryTitle ? [categoryTitle] : [];
    }

    return [];
  };

  // Filter partners by category
  let filteredPartners =
    activeFilter === "All"
      ? partners
      : partners.filter((p) => {
        const categoryTitles = getCategoryTitles(p);
        // Check if any of the partner's categories match the active filter
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

  // Apply search query filter for both partner name and category titles
  if (searchQuery) {
    filteredPartners = filteredPartners.filter((partner) => {
      const nameMatches = partner.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Check if search query matches any of the partner's categories
      const categoryTitles = getCategoryTitles(partner);
      const categoryMatches = categoryTitles.some(title =>
        title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return nameMatches || categoryMatches;
    });
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
            className={`md:py-2.5 rounded lg:rounded-lg whitespace-nowrap min-w-max ${activeFilter === filter && !showAll
              ? "bg-white text-black hover:bg-white"
              : "text-white"
              }`}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-10">
          <p className="text-lg">Loading partners...</p>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-10">
          {filteredPartners.length === 0 ? (
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
      )}

      {/* Show All Arrow */}
      {!showAll && !isLoading && filteredPartners.length > 0 && (
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
        partners={partners}
      />
    </div>
  );
};

export default NetworkFilter;