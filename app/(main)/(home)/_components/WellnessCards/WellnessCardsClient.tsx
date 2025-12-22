"use client";

import { useState } from "react";
import { Info } from "lucide-react";
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
                  "object-cover transition-all duration-500 group-hover:blur-sm group-hover:scale-105",
                  isActive && "blur-sm scale-105"
                )}
              />

              {/* Dark Overlay */}
              <div
                className={cn(
                  "absolute inset-0 lg:bg-black/50 group-hover:bg-black/50 transition-all duration-500 pointer-events-none",
                  isActive && "bg-black/50"
                )}
              ></div>

              {/* Info Button (Mobile/Tablet) */}
              <button
                onClick={(e) => handleInfoClick(e, card._id as string)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors lg:hidden"
                aria-label="Toggle description"
              >
                <Info size={20} />
              </button>

              {/* Title */}
              <div
                className={cn(
                  "absolute bottom-3 left-0 right-0 opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none",
                  isActive && "opacity-0"
                )}
              >
                <h3 className="text-white text-[32px] font-semibold lg:text-5xl font-serif text-center">
                  {card.title}
                </h3>
              </div>

              {/* Hover Text */}
              <div
                className={cn(
                  "absolute inset-0 flex items-end justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                  isActive && "opacity-100"
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
