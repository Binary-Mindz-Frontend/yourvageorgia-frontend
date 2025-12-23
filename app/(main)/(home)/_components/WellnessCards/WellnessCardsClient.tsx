// // "use client";

// // import { useState } from "react";
// // import { Circle, CircleDot } from "lucide-react";
// // import { cn } from "@/lib/utils";

// // import Image from "next/image";
// // import { useRouter } from "next/navigation";
// // import { ICategory } from "@/types/category.types";

// // interface Props {
// //   categories: ICategory[];
// // }

// // export default function WellnessCardsClient({ categories }: Props) {
// //   const router = useRouter();
// //   const [activeCardId, setActiveCardId] = useState<string | null>(null);

// //   const handleCardClick = (title: string) => {
// //     router.push(`/network?filter=${encodeURIComponent(title)}`);
// //   };

// //   const handleInfoClick = (e: React.MouseEvent, id: string) => {
// //     e.stopPropagation();
// //     setActiveCardId(activeCardId === id ? null : id);
// //   };

// //   return (
// //     <section className="px-4 mt-16 md:my-38 md:px-12">
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //         {categories.map((card) => {
// //           const isActive = activeCardId === card._id;
// //           return (
// //             <div
// //               key={card._id}
// //               className="group relative h-[330px] sm:h-auto sm:aspect-3/4 overflow-hidden rounded-lg cursor-pointer icon-trigger"
// //               role="button"
// //               aria-label={`${card.title} - ${card.description}`}
// //               onClick={() => handleCardClick(card.title)}
// //             >
// //               {/* Image */}
// //               <Image
// //                 src={card?.image}
// //                 alt={card.title}
// //                 unoptimized
// //                 fill
// //                 className={cn(
// //                   "object-cover transition-all duration-500 ease-out group-hover:blur-sm group-hover:scale-105",
// //                   isActive && "blur-sm scale-105"
// //                 )}
// //               />

// //               {/* Dark Overlay */}
// //               <div
// //                 className={cn(
// //                   "absolute inset-0 lg:bg-black/50 group-hover:bg-black/50 transition-all duration-500 ease-out pointer-events-none",
// //                   isActive && "bg-black/50"
// //                 )}
// //               ></div>

// //               {/* Info Button (Mobile/Tablet) - Improved */}
// //               <button
// //                 onClick={(e) => handleInfoClick(e, card._id as string)}
// //                 className={cn(
// //                   "absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md text-white transition-all duration-300 ease-out lg:hidden shadow-lg",
// //                   isActive 
// //                     ? "bg-white/30 scale-110 rotate-0" 
// //                     : "bg-white/20 hover:bg-white/25 hover:scale-105"
// //                 )}
// //                 aria-label={isActive ? "Hide description" : "Show description"}
// //                 aria-expanded={isActive}
// //               >
// //                 <div className="relative w-4 h-4">
// //                   {/* Circle Icon (Empty) */}
// //                   <Circle
// //                     size={16}
// //                     className={cn(
// //                       "absolute inset-0 transition-all duration-400 ease-out",
// //                       isActive 
// //                         ? "opacity-0 scale-75 rotate-90" 
// //                         : "opacity-100 scale-100 rotate-0"
// //                     )}
// //                     strokeWidth={2}
// //                   />
// //                   {/* CircleDot Icon (Filled) */}
// //                   <CircleDot
// //                     size={16}
// //                     className={cn(
// //                       "absolute inset-0 transition-all duration-400 ease-out",
// //                       isActive 
// //                         ? "opacity-100 scale-100 rotate-0" 
// //                         : "opacity-0 scale-75 -rotate-90"
// //                     )}
// //                     strokeWidth={2}
// //                   />
// //                 </div>
// //               </button>

// //               {/* Title */}
// //               <div
// //                 className={cn(
// //                   "absolute bottom-3 left-0 right-0 transition-all duration-500 ease-out pointer-events-none",
// //                   isActive 
// //                     ? "opacity-0 translate-y-4" 
// //                     : "opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-4"
// //                 )}
// //               >
// //                 <h3 className="text-white text-[32px] font-semibold lg:text-5xl font-serif text-center">
// //                   {card.title}
// //                 </h3>
// //               </div>

// //               {/* Hover Text */}
// //               <div
// //                 className={cn(
// //                   "absolute inset-0 flex items-end justify-center p-6 transition-all duration-500 ease-out pointer-events-none",
// //                   isActive 
// //                     ? "opacity-100 translate-y-0" 
// //                     : "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
// //                 )}
// //               >
// //                 <p className="text-white font-light italic leading-relaxed max-w-md text-left">
// //                   {card.description}
// //                 </p>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </section>
// //   );
// // }






// "use client";

// import { useState } from "react";
// import { cn } from "@/lib/utils";

// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { ICategory } from "@/types/category.types";

// interface Props {
//   categories: ICategory[];
// }

// export default function WellnessCardsClient({ categories }: Props) {
//   const router = useRouter();
//   const [activeCardId, setActiveCardId] = useState<string | null>(null);

//   const handleCardClick = (title: string) => {
//     router.push(`/network?filter=${encodeURIComponent(title)}`);
//   };

//   const handleInfoClick = (e: React.MouseEvent, id: string) => {
//     e.stopPropagation();
//     setActiveCardId(activeCardId === id ? null : id);
//   };

//   return (
//     <section className="px-4 mt-16 md:my-38 md:px-12">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {categories.map((card) => {
//           const isActive = activeCardId === card._id;
//           return (
//             <div
//               key={card._id}
//               className="group relative h-[330px] sm:h-auto sm:aspect-3/4 overflow-hidden rounded-lg cursor-pointer icon-trigger"
//               role="button"
//               aria-label={`${card.title} - ${card.description}`}
//               onClick={() => handleCardClick(card.title)}
//             >
//               {/* Image */}
//               <Image
//                 src={card?.image}
//                 alt={card.title}
//                 unoptimized
//                 fill
//                 className={cn(
//                   "object-cover transition-all duration-500 ease-out group-hover:blur-sm group-hover:scale-105",
//                   isActive && "blur-sm scale-105"
//                 )}
//               />

//               {/* Dark Overlay */}
//               <div
//                 className={cn(
//                   "absolute inset-0 lg:bg-black/50 group-hover:bg-black/50 transition-all duration-500 ease-out pointer-events-none",
//                   isActive && "bg-black/50"
//                 )}
//               ></div>

//               {/* Info Button (Mobile/Tablet) - Simple Dot */}
//               <button
//                 onClick={(e) => handleInfoClick(e, card._id as string)}
//                 className={cn(
//                   "absolute top-4 right-4 z-10 w-10 h-10 rounded-full backdrop-blur-md transition-all duration-300 ease-out lg:hidden shadow-lg flex items-center justify-center",
//                   isActive
//                     ? "bg-white/30 scale-110"
//                     : "bg-white/20 hover:bg-white/25 hover:scale-105"
//                 )}
//                 aria-label={isActive ? "Hide description" : "Show description"}
//                 aria-expanded={isActive}
//               >
//                 <div className="relative w-5 h-5 flex items-center justify-center">
//                   {/* Animated Dot */}
//                   <div
//                     className={cn(
//                       "w-2 h-2 rounded-full bg-white transition-all duration-300 ease-out",
//                       isActive
//                         ? "scale-150"
//                         : "scale-100"
//                     )}
//                   />
//                   {/* Pulse Ring */}
//                   <div
//                     className={cn(
//                       "absolute inset-0 rounded-full border-2 border-white transition-all duration-300 ease-out",
//                       isActive
//                         ? "scale-0 opacity-0"
//                         : "scale-100 opacity-40 animate-ping"
//                     )}
//                   />
//                 </div>
//               </button>

//               {/* Title */}
//               <div
//                 className={cn(
//                   "absolute bottom-3 left-0 right-0 transition-all duration-500 ease-out pointer-events-none",
//                   isActive
//                     ? "opacity-0 translate-y-4"
//                     : "opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-4"
//                 )}
//               >
//                 <h3 className="text-white text-[32px] font-semibold lg:text-5xl font-serif text-center">
//                   {card.title}
//                 </h3>
//               </div>

//               {/* Hover Text */}
//               <div
//                 className={cn(
//                   "absolute inset-0 flex items-end justify-center p-6 transition-all duration-500 ease-out pointer-events-none",
//                   isActive
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
//                 )}
//               >
//                 <p className="text-white font-light italic leading-relaxed max-w-md text-left">
//                   {card.description}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }


"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ICategory } from "@/types/category.types";

interface Props {
  categories: ICategory[];
}

export default function WellnessCardsClient({ categories }: Props) {
  const router = useRouter();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleCardClick = (title: string) => {
    router.push(`/network?filter=${encodeURIComponent(title)}`);
  };

  const handleInfoClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveCardId(activeCardId === id ? null : id);
  };

  return (
    <section className="px-4 mt-16 md:my-38 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((card) => {
          const isActive = activeCardId === card._id;
          return (
            <div
              key={card._id}
              className="group relative h-[330px] sm:h-auto sm:aspect-3/4 overflow-hidden rounded-lg cursor-pointer icon-trigger"
              role="button"
              aria-label={`${card.title} - ${card.description}`}
              onClick={() => handleCardClick(card.title)}
            >
              {/* Image */}
              <Image
                src={card?.image}
                alt={card.title}
                unoptimized
                fill
                className={cn(
                  "object-cover transition-all duration-500 ease-out group-hover:blur-sm group-hover:scale-105",
                  isActive && "blur-sm scale-105"
                )}
              />

              {/* Dark Overlay */}
              <div
                className={cn(
                  "absolute inset-0 lg:bg-black/50 group-hover:bg-black/50 transition-all duration-500 ease-out pointer-events-none",
                  isActive && "bg-black/50"
                )}
              ></div>

              {/* Info Button (Mobile/Tablet) - Improved */}
              <button
                onClick={(e) => handleInfoClick(e, card._id as string)}
                className={cn(
                  "absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md text-white transition-all duration-300 ease-out lg:hidden shadow-lg",
                  isActive
                    ? "bg-white/30 scale-110 rotate-0"
                    : "bg-white/20 hover:bg-white/25 hover:scale-105"
                )}
                aria-label={isActive ? "Hide description" : "Show description"}
                aria-expanded={isActive}
              >
                <Plus
                  size={20}
                  className={cn(
                    "transition-all duration-300 ease-out",
                    isActive && "rotate-135"
                  )}
                  strokeWidth={2}
                />
              </button>

              {/* Title */}
              <div
                className={cn(
                  "absolute bottom-3 left-0 right-0 transition-all duration-500 ease-out pointer-events-none",
                  isActive
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-4"
                )}
              >
                <h3 className="text-white text-[32px] font-semibold lg:text-5xl font-serif text-center">
                  {card.title}
                </h3>
              </div>

              {/* Hover Text */}
              <div
                className={cn(
                  "absolute inset-0 flex items-end justify-center p-6 transition-all duration-500 ease-out pointer-events-none",
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                )}
              >
                <p className="text-white font-light italic leading-relaxed max-w-md text-left">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}