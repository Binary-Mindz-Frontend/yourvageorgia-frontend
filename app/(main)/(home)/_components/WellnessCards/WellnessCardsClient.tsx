"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ICategory } from "@/types/category.types";

interface Props {
  categories: ICategory[];
}

export default function WellnessCardsClient({ categories }: Props) {
  const router = useRouter();

  const handleCardClick = (title: string) => {
    router.push(`/network?filter=${encodeURIComponent(title)}`);
  };

  return (
    <section className="px-4 mt-16 md:my-38 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((card) => (
          <div
            key={card._id}
            className="group relative h-[330px] sm:h-auto sm:aspect-3/4 overflow-hidden rounded-lg cursor-pointer"
            role="button"
            aria-label={`${card.title} - ${card.description}`}
            onClick={() => handleCardClick(card.title)}
          >
            {/* Image */}
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover transition-all duration-500 group-hover:blur-sm group-hover:scale-105 "
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 lg:bg-black/50 group-hover:bg-black/50 transition-all duration-500 pointer-events-none"></div>

            {/* Title */}
            <div className="absolute bottom-3 left-0 right-0 opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none">
              <h3 className="text-white text-[32px] font-semibold lg:text-5xl font-serif text-center">
                {card.title}
              </h3>
            </div>

            {/* Hover Text */}
            <div className="absolute inset-0 flex items-end justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <p className="text-white font-light italic leading-relaxed max-w-md text-left">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>

    
  );
}
