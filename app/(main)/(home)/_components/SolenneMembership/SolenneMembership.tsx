/* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import NetworkCardModal from "@/app/(main)/network/_components/NetworkCardModal/PartnerDetailsModal";
// import { getPartners } from "@/services/partner/getpartner";
// import { ArrowRight } from "lucide-react";
// import { useEffect, useState } from "react";
// import PartnersMap from "../PartnersMap/PartnersMap";

// export default function SolenneMembership() {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [partners, setPartners] = useState<any[]>([]);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   // Load partners
//   useEffect(() => {
//   const loadPartners = async () => {
//     const res = await getPartners();
//     if ("data" in res) {
//       setPartners(res.data);

//       // ✅ Find the first partner with isFeaturedMap === "true"
//       const featuredPartner = res.data.find(
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         (p: any) => p.isFeaturedMap === "true"
//       );

//       // ✅ If found, set as default selected partner; otherwise fallback to first
//       setSelectedPartner(featuredPartner || res.data[0]);
//     }
//   };

//   loadPartners();
// }, []);

//   return (
//     <div className="text-white flex items-center justify-center my-16 lg:my-38 p-4 lg:px-12">
//       <div className="w-full">
//         {/* Main Grid Container */}
//         <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0 overflow-hidden rounded-b-xl lg:rounded-none">
//           {/* Left Section */}
//           <div className="relative bg-black order-1 lg:order-0 border-t-2 border-black">
//             {/* Background Image */}
//             <div
//               className="absolute inset-0 bg-cover bg-center"
//               style={{
//                 backgroundImage: selectedPartner
//                   ? `url(${selectedPartner.thumbnail})`
//                   : "url('/assets/home/map_bg.svg')",
//               }}
//             >
//               <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80"></div>
//             </div>

//             <div className="relative z-10 p-12 h-full flex flex-col justify-end min-h-100">
//               <button
//                 onClick={() => selectedPartner && setShowModal(true)}
//                 className="group inline-flex flex-col cursor-pointer text-left"
//               >
//                 <h2 className="text-3xl font-light mb-3 tracking-wide transition group-hover:text-white/90">
//                   {selectedPartner ? selectedPartner.name : "Lumé Aesthetics"}
//                 </h2>

//                 <div className="flex items-center gap-2 text-sm lg:text-base text-white">
//                   <span className="transition group-hover:text-white/90">
//                     {selectedPartner
//                       ? selectedPartner.about?.title ||
//                         selectedPartner.activity
//                       : "15% off facial and rejuvenation treatments"}
//                   </span>
//                   <ArrowRight className="w-5 h-5 transition text-white" />
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Right Section */}
//           <div className="relative bg-gray-100 min-h-100 rounded-xl lg:rounded-none">
//             <PartnersMap
//               partners={partners}
//               onMarkerClick={(partner) => setSelectedPartner(partner)}
//             />
//           </div>
//         </div>

//         {/* Bottom Description */}
//         <div className="mt-12 lg:mt-38 text-center">
//           <p className="text-gray-300 text-lg lg:text-2xl leading-relaxed font-light">
//             Solenne is a digital lifestyle membership for women in Dubai,
//             connecting members to a curated network of wellness, beauty and
//             lifestyle destinations across the city. Members exclusively have
//             access to enjoy preferred rates and experiences designed to elevate
//             everyday living.
//           </p>
//         </div>
//       </div>

//       {/* Partner Modal */}
//       {showModal && selectedPartner && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-999 overflow-y-auto scrollbar-hide">
//           <NetworkCardModal
//             onClose={() => setShowModal(false)}
//             partner={selectedPartner}
//           />
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import NetworkCardModal from "@/app/(main)/network/_components/NetworkCardModal/PartnerDetailsModal";
import { getPartners } from "@/services/partner/getpartner";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import PartnersMap from "../PartnersMap/PartnersMap";

export default function SolenneMembership() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [partners, setPartners] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hoveredPartner, setHoveredPartner] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load partners
  useEffect(() => {
    const loadPartners = async () => {
      const res = await getPartners();
      if ("data" in res) {
        setPartners(res.data);

        // ✅ Find the first partner with isFeaturedMap === "true"
        const featuredPartner = res.data.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (p: any) => p.isFeaturedMap === "true"
        );

        // ✅ If found, set as default selected partner; otherwise fallback to first
        setSelectedPartner(featuredPartner || res.data[0]);
      }
    };

    loadPartners();
  }, []);

  // Helper function to get activity title
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getActivityTitle = (partner: any) => {
    if (partner.activity && Array.isArray(partner.activity) && partner.activity.length > 0) {
      return partner.activity[0].title;
    }
    return "";
  };

  // Use hovered partner if available, otherwise use selected partner
  const displayPartner = hoveredPartner || selectedPartner;

  return (
    <div className="text-white flex items-center justify-center my-16 lg:my-38 p-4 lg:px-12">
      <div className="w-full">
        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0 overflow-hidden rounded-b-xl lg:rounded-none">
          {/* Left Section */}
          <div className="relative bg-black order-1 lg:order-0 border-t-2 border-black">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{
                backgroundImage: displayPartner
                  ? `url(${displayPartner.thumbnail})`
                  : "url('/assets/home/map_bg.svg')",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80"></div>
            </div>

            <div className="relative z-10 p-12 h-full flex flex-col justify-end min-h-128">
              <button
                onClick={() => displayPartner && setShowModal(true)}
                className="group inline-flex flex-col cursor-pointer text-left"
              >
                <h2 className="text-3xl font-light mb-3 tracking-wide transition-all duration-300 group-hover:text-white/90">
                  {displayPartner ? displayPartner.name : "Lumé Aesthetics"}
                </h2>

                <div className="flex items-center gap-2 text-sm lg:text-base text-white">
                  <span className="transition-all duration-300 group-hover:text-white/90">
                    {displayPartner
                      ? displayPartner.about || getActivityTitle(displayPartner) || "Exclusive member benefits"
                      : "15% off facial and rejuvenation treatments"}
                  </span>
                  <ArrowRight className="w-5 h-5 transition text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative bg-gray-100 min-h-128 rounded-xl lg:rounded-none">
            <PartnersMap
              partners={partners}
              onMarkerClick={(partner) => setSelectedPartner(partner)}
              onMarkerHover={(partner: any) => setHoveredPartner(partner)}
            />
          </div>
        </div>

        {/* Bottom Description */}
        <div className="mt-12 lg:mt-38 text-center">
          <p className="text-gray-300 text-lg lg:text-2xl leading-relaxed font-light">
            {"Solenne is a digital lifestyle membership for women in Dubai, centred on a curated network of the city's most considered wellness, beauty and lifestyle destinations. Members are extended preferred access and partner privileges, shaping a more elevated everyday."}
          </p>
        </div>
      </div>

      {/* Partner Modal */}
      {showModal && displayPartner && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-999 overflow-y-auto scrollbar-hide">
          <NetworkCardModal
            onClose={() => setShowModal(false)}
            partner={displayPartner}
          />
        </div>
      )}
    </div>
  );
}