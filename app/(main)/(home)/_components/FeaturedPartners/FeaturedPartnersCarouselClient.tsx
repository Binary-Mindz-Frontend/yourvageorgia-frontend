"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Partner } from "@/types/partner.types";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FeaturedPartnersCarouselClient({
  partners,
}: {
  partners: Partner[];
}) {
  const router = useRouter();

  return (
    <div className="relative w-full flex flex-col items-center justify-center mb-36 p-4 lg:px-12">
      <h1 className="text-3xl md:text-6xl font-serif text-center text-white lg:mb-16 tracking-wide">
        Featured Partners
      </h1>

      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4">
          {partners.map((partner) => (
            <CarouselItem
              key={partner._id}
              className="pl-4 md:basis-1/2 lg:basis-1/4"
            >
              <div className="p-1">
                <Card className="border-0 bg-transparent">
                  <CardContent className="p-0">
                    <div
                      className="w-full h-32 md:h-40 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 flex items-center justify-center"
                      onClick={() => router.push(`/network/${partner._id}`)}
                    >
                      <Image
                        src={
                          partner.logo ||
                          partner.thumbnail ||
                          "/images/placeholder.png"
                        }
                        width={500}
                        height={250}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute left-12 right-12">
          <CarouselPrevious className="bg-transparent border-none cursor-pointer">
            <Image
              src="/icons/arrow-left.svg"
              width={20}
              height={20}
              alt="prev"
            />
          </CarouselPrevious>
          <CarouselNext className="bg-transparent border-none cursor-pointer">
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
