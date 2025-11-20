import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import img1 from "@/public/assets/home/featured/1.svg";
import img2 from "@/public/assets/home/featured/2.svg";
import img3 from "@/public/assets/home/featured/2.svg";
import img4 from "@/public/assets/home/featured/4.svg";
import Image from "next/image";

const partners = [
  {
    id: 1,
    image: img2,
  },
  {
    id: 2,
    image: img1,
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
    <div className="relative w-full flex flex-col items-center justify-center mb-36 p-4 lg:p-0">
      <h1 className="text-5xl md:text-6xl font-serif text-white lg:mb-16 tracking-wide">
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
              className="pl-4  md:basis-1/2 lg:basis-1/4"
            >
              <div className="p-1">
                <Card className="border-0 bg-transparent">
                  <CardContent className="p-0">
                    <div className="aspect-4/3 w-[320px] lg:h-40 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300">
                      <Image
                        src={partner.image}
                        alt={`Partner ${partner.id}`}
                        className="w-[320px] h-full object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute left-12 right-12 ">
          <CarouselPrevious className="bg-transparent border-none">
            <Image
              src="/icons/arrow-left.svg"
              width={20}
              height={20}
              alt="prev"
            />
          </CarouselPrevious>

          <CarouselNext className="bg-transparent border-none">
            <Image
              src="/icons/arrow-right.svg"
              width={20}
              height={20}
              alt="next"
            />
          </CarouselNext>
        </div>
      </Carousel>
    </div>
  );
}
