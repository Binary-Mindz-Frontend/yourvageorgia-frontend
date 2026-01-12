import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Partner } from "@/types/partner.types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FavouriteButton from "./FavouriteButton";

interface PartnerCardProps {
    partner: Partner;
    onClick: (partner: Partner) => void;
}

const PartnerCard = ({ partner, onClick }: PartnerCardProps) => {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // Safe access to thumbnail and fallback
    const thumbnailSrc = partner.thumbnail || '/placeholder-image.jpg';

    // Safe access to location
    const location = partner.contacts?.[0]?.area
        || partner.contacts?.[0]?.address
        || "Location not specified";

    return (
        <div
            onClick={() => onClick(partner)}
            className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
        >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full bg-gray-900/20">
                {isImageLoading && !imageError && (
                    <Skeleton className="w-full h-full absolute inset-0 z-10 flex items-center justify-center bg-background/20">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                    </Skeleton>
                )}

                {!imageError && (
                    <Image
                        src={thumbnailSrc}
                        alt={partner.name || 'Partner'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={cn(
                            "object-cover transition-all duration-500",
                            isImageLoading ? "opacity-0" : "opacity-100 group-hover:scale-105"
                        )}
                        style={{
                            filter: "brightness(1.05) saturate(1.2)",
                        }}
                        onLoad={() => setIsImageLoading(false)}
                        onError={() => {
                            setImageError(true);
                            setIsImageLoading(false);
                        }}
                        preload={true}
                        loading="eager"
                        unoptimized
                    />
                )}

                {imageError && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <p className="text-white/50">Image not available</p>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-black/10 to-transparent z-0"></div>
            </div>

            <FavouriteButton
                partnerId={partner._id || ""}
                className="absolute top-4 right-4 z-20 md:hidden"
            />

            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
                <div className="flex items-start gap-3 mb-1">
                    <h2 className="text-lg lg:text-3xl font-semibold mb-1 font-serif">
                        {partner.name || 'Unnamed Partner'}
                        <FavouriteButton
                            partnerId={partner._id || ""}
                            className="absolute ml-4 bottom-14.5 hidden lg:inline-block"
                        />
                    </h2>
                </div>

                <div className="flex items-center text-sm lg:text-lg gap-2 italic opacity-80">
                    <span className="truncate">{location}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                </div>
            </div>

        </div>
    );
};

export default PartnerCard;
