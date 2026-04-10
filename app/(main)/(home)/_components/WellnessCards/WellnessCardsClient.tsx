// "use client";

// import { cn } from "@/lib/utils";
// import { Plus } from "lucide-react";
// import { useState } from "react";

// import { ICategory } from "@/types/category.types";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

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

//               {/* Info Button (Mobile/Tablet) - Improved */}
//               <button
//                 onClick={(e) => handleInfoClick(e, card._id as string)}
//                 className={cn(
//                   "absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md text-white transition-all duration-300 ease-out lg:hidden shadow-lg",
//                   isActive
//                     ? "bg-white/30 scale-110 rotate-0"
//                     : "bg-white/20 hover:bg-white/25 hover:scale-105"
//                 )}
//                 aria-label={isActive ? "Hide description" : "Show description"}
//                 aria-expanded={isActive}
//               >
//                 <Plus
//                   size={20}
//                   className={cn(
//                     "transition-all duration-300 ease-out",
//                     isActive && "rotate-135"
//                   )}
//                   strokeWidth={2}
//                 />
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

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ICategory } from "@/types/category.types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  categories: ICategory[];
}

export default function WellnessCardsClient({ categories }: Props) {
  const router = useRouter();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [cardWidth, setCardWidth] = useState<number>(0);
  const [cardHeight, setCardHeight] = useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const LG_BREAKPOINT = 1024;

    const calculateSize = () => {
      if (!containerRef.current) return;
      if (window.innerWidth < LG_BREAKPOINT) return; // mobile handles itself via CSS

      const containerWidth = containerRef.current.offsetWidth;
      const gap = 24;
      const cols = 4;
      const width = (containerWidth - gap * (cols - 1)) / cols;
      const height = width * (4 / 3);
      setCardWidth(width);
      setCardHeight(height);
    };

    calculateSize();
    window.addEventListener("resize", calculateSize);
    return () => window.removeEventListener("resize", calculateSize);
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [cardWidth]);

  const handleCardClick = (title: string) => {
    router.push(`/network?filter=${encodeURIComponent(title)}`);
  };

  const handleInfoClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveCardId(activeCardId === id ? null : id);
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -(cardWidth + 24), behavior: "smooth" });
  };

  const desktopCardStyle =
    cardWidth > 0
      ? { width: `${cardWidth}px`, height: `${cardHeight}px` }
      : { width: "calc(25% - 18px)" };

  return (
    <section className="px-4 mt-16 md:my-38 md:px-12">

      {/* ── MOBILE: vertical stack (< lg) ── */}
      <div className="flex flex-col gap-6 lg:hidden">
        {categories.map((card) => {
          const isActive = activeCardId === card._id;
          return (
            <div
              key={card._id}
              className="group relative h-82.5 overflow-hidden rounded-lg cursor-pointer"
              role="button"
              aria-label={`${card.title} - ${card.description}`}
              onClick={() => handleCardClick(card.title)}
            >
              <Image
                src={card?.image}
                alt={card.title}
                fill
                className={cn(
                  "object-cover transition-all duration-500 ease-out",
                  isActive && "blur-sm scale-105"
                )}
              />

              {/* Dark Overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-black/40 transition-all duration-500 ease-out pointer-events-none",
                  isActive && "bg-black/60"
                )}
              />

              {/* Info Button */}
              <button
                onClick={(e) => handleInfoClick(e, card._id as string)}
                className={cn(
                  "absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md text-white transition-all duration-300 ease-out shadow-lg",
                  isActive ? "bg-white/30 scale-110" : "bg-white/20"
                )}
                aria-label={isActive ? "Hide description" : "Show description"}
              >
                <Plus
                  size={20}
                  className={cn("transition-all duration-300 ease-out", isActive && "rotate-45")}
                  strokeWidth={2}
                />
              </button>

              {/* Title */}
              <div
                className={cn(
                  "absolute bottom-3 left-0 right-0 transition-all duration-500 ease-out pointer-events-none",
                  isActive ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                )}
              >
                <h3 className="text-white text-[32px] font-semibold font-serif text-center">
                  {card.title}
                </h3>
              </div>

              {/* Description */}
              <div
                className={cn(
                  "absolute inset-0 flex items-end justify-center p-6 transition-all duration-500 ease-out pointer-events-none",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <p className="text-white font-light italic leading-relaxed text-left">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DESKTOP: horizontal scroll (lg+) ── */}
      <div className="hidden lg:block relative">
        <div ref={containerRef} className="w-full">
          <div
            ref={scrollRef}
            className="flex flex-row gap-6 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((card) => {
              const isActive = activeCardId === card._id;
              return (
                <div
                  key={card._id}
                  className="group relative shrink-0 overflow-hidden rounded-lg cursor-pointer icon-trigger"
                  style={desktopCardStyle}
                  role="button"
                  aria-label={`${card.title} - ${card.description}`}
                  onClick={() => handleCardClick(card.title)}
                >
                  <Image
                    src={card?.image}
                    alt={card.title}
                    fill
                    className={cn(
                      "object-cover transition-all duration-500 ease-out group-hover:blur-sm group-hover:scale-105",
                      isActive && "blur-sm scale-105"
                    )}
                  />

                  {/* Dark Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-black/50 group-hover:bg-black/50 transition-all duration-500 ease-out pointer-events-none",
                      isActive && "bg-black/50"
                    )}
                  />

                  {/* Title */}
                  <div
                    className={cn(
                      "absolute bottom-3 left-0 right-0 transition-all duration-500 ease-out pointer-events-none",
                      isActive
                        ? "opacity-0 translate-y-4"
                        : "opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-4"
                    )}
                  >
                    <h3 className="text-white text-5xl font-semibold font-serif text-center">
                      {card.title}
                    </h3>
                  </div>

                  {/* Hover Description */}
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
        </div>

        {/* Left Arrow */}
        <button
          onClick={handleScrollLeft}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all duration-300 shadow-lg hover:scale-110",
            canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleScrollRight}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all duration-300 shadow-lg hover:scale-110",
            canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} strokeWidth={2} />
        </button>
      </div>

    </section>
  );
}