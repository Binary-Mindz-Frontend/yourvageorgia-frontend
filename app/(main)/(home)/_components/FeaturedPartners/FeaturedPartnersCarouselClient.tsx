"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import PartnerDetailsModal from "@/app/(main)/network/_components/NetworkCardModal/PartnerDetailsModal";
import { Partner } from "@/types/partner.types";

export default function FeaturedPartnersCarouselClient({
  partners,
}: {
  partners: Partner[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

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
                      onClick={() => {
                        setSelectedPartner(partner);
                        setShowModal(true);
                      }}
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

      {/* Modal */}
      {showModal && selectedPartner && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-999 overflow-y-auto scrollbar-hide">
          <PartnerDetailsModal
            onClose={() => setShowModal(false)}
            partner={selectedPartner}
          />
        </div>
      )}
    </div>
  );
}
