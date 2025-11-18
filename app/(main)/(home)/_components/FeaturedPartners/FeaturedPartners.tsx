
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import img1 from "@/public/assets/home/featured/Screenshot 2025-11-02 at 4.52.10 pm.svg";
import img2 from "@/public/assets/home/featured/Screenshot 2025-11-02 at 4.54.38 pm.svg";
import img3 from "@/public/assets/home/featured/Screenshot 2025-11-02 at 4.55.37 pm.svg";
import img4 from "@/public/assets/home/featured/Screenshot 2025-11-02 at 4.57.42 pm.svg";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const partners = [
  {
    id: 1,
    image: img1,
  },
  {
    id: 2,
    image: img2,
  },
  {
    id: 3,
    image: img3,
  },
  {
    id: 4,
    image: img4,
  },
  {
    id: 5,
    image: img1,
  },
  {
    id: 6,
    image: img2,
  },
];

export default function FeaturedPartnersCarousel() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center mb-36">
      <h1 className="text-5xl md:text-6xl font-serif text-white mb-16 tracking-wide">
        Featured Partners
      </h1>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {partners.map((partner) => (
            <CarouselItem
              key={partner.id}
              className="pl-4 md:basis-1/2 lg:basis-1/4"
            >
              <div className="p-1">
                <Card className="border-0 bg-transparent">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300">
                      <Image
                        src={partner.image}
                        alt={`Partner ${partner.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute left-12 right-12 ">
        <CarouselPrevious className="text-white hover:bg-white/10 border-white/20">
          <ChevronLeft className="h-8 w-8" />
        </CarouselPrevious>
        <CarouselNext className="text-white hover:bg-white/10 border-white/20">
          <ChevronRight className="h-8 w-8" />
        </CarouselNext>
        </div>
      </Carousel>
    </div>
  );
}
