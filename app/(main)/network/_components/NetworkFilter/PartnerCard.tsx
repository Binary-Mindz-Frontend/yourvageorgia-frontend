import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Partner } from "@/types/partner.types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { memo, useState } from "react";
import FavouriteButton from "./FavouriteButton";

interface PartnerCardProps {
    partner: Partner;
    onClick: (partner: Partner) => void;
    priority?: boolean;
}

const PartnerCard = memo(({ partner, onClick, priority = false }: PartnerCardProps) => {
    const [isImageLoading, setIsImageLoading] = useState(true);

    // console.log(partner, 'partner');

    // Extract location once
    const location = partner.contacts?.[0]?.area ||
        partner.contacts?.[0]?.address ||
        "Location not specified";

    const locationText =
        (partner.contacts?.length ?? 0) > 1
            ? "Multiple Locations"
            : location;

    return (
        <div
            onClick={() => onClick(partner)}
            className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
        >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full bg-gray-900/20 -z-50">
                {isImageLoading && (
                    <Skeleton className="w-full h-full absolute inset-0 z-10 flex items-center justify-center bg-background/20">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                    </Skeleton>
                )}
                <Image
                    src={partner.thumbnail || ""}
                    alt={partner.name}
                    fill
                    priority={priority}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={cn(
                        "object-cover transition-all duration-500",
                        isImageLoading ? "opacity-0" : "opacity-100 group-hover:scale-105"
                    )}
                    style={{
                        filter: "brightness(1.05) saturate(1.2)",
                    }}
                    onLoad={() => setIsImageLoading(false)}
                    quality={75}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-black/10 to-transparent z-0"></div>
            </div>

            <FavouriteButton
                partnerId={partner._id || ""}
                className="absolute top-4 right-4 z-20 md:hidden"
            />

            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
                <div className="relative flex items-start gap-3 mb-1">
                    <h2 className="text-lg lg:text-3xl font-semibold mb-1 font-serif">
                        {partner.name}
                        <FavouriteButton
                            partnerId={partner._id || ""}
                            className="absolute ml-4 top-1 hidden lg:inline-block"
                        />
                    </h2>
                </div>

                <div className="flex items-center text-sm lg:text-lg gap-2 italic opacity-80">
                    <span className="truncate">{locationText}</span>
                </div>
                <div className="flex items-center text-sm lg:text-lg gap-2 italic opacity-80">
                    <span className="truncate">View privileges</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                </div>
            </div>
        </div>
    );
});

PartnerCard.displayName = 'PartnerCard';

export default PartnerCard;