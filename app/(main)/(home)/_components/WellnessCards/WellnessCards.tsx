"use client";

import Image, { StaticImageData } from "next/image";
import img2 from "@/public/assets/home/card/CATEGORYMOVEMENT (1).svg";
import img3 from "@/public/assets/home/card/CATEGORYMOVEMENT (2).svg";
import img4 from "@/public/assets/home/card/CATEGORYMOVEMENT (3).svg";
import img1 from "@/public/assets/home/card/CATEGORYMOVEMENT.svg";
import { useRouter } from "next/navigation";

interface WellnessCard {
  id: number;
  title: string;
  image: StaticImageData;
  hoverText: string;
  showTextByDefault?: boolean;
}

export default function WellnessCards() {
  const router = useRouter();

  const cards: WellnessCard[] = [
    {
      id: 1,
      title: "Movement",
      image: img2,
      hoverText:
        "Beauty lounges, hair salons and advanced skin clinics. Spaces dedicated to providing reliable, trusted services.",
    },
    {
      id: 2,
      title: "Radiance",
      image: img1,
      hoverText:
        "Padel Clubs, low-impact studios and gyms. Designed to support consistent, effective training",
    },
    {
      id: 3,
      title: "Recovery",
      image: img4,
      hoverText:
        "Massage, contrast therapy, IV wellness and restorative treatments curated to promote recovery, balance and reset.",
    },
    {
      id: 4,
      title: "Taste",
      image: img3,
      hoverText:
        "Concept cafes and dining destinations offering thoughtful menus, refined flavours and an elevated culinary approach.",
    },
  ];

  const handleCardClick = (title: string) => {
    // Navigate to /network with query filter
    router.push(`/network?filter=${encodeURIComponent(title)}`);
  };

  return (
    <section className="px-4 mt-16 md:my-38 md:px-12">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group relative h-[330px] sm:h-auto sm:aspect-3/4 overflow-hidden rounded-lg cursor-pointer"
              role="button"
              aria-label={`${card.title} - ${card.hoverText}`}
              onClick={() => handleCardClick(card.title)}
            >
              {/* Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-all duration-500 group-hover:blur-sm group-hover:scale-105"
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
              <div
                className={`absolute inset-0 flex items-end justify-center p-6 transition-opacity duration-500 pointer-events-none ${
                  card.showTextByDefault ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <p className="text-white font-light italic leading-relaxed max-w-md text-left">
                  {card.hoverText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
