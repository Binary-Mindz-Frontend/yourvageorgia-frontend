"use client";

import ImageGallerySlider from "@/app/(main)/network/_components/ImageGallerySlider/ImageGallerySlider";
import { WhatsappIcon } from "@/app/(main)/network/_components/NetworkCardModal/Icon/Icons";
import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import { Button } from "@/components/ui/button";
import { getPartnerById } from "@/services/partner/getpartner";
import { Partner } from "@/types/partner.types";
import { ChevronLeft, Globe, Instagram } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PartnerDetailsProps {
    partnerId: string;
}

export default function PartnerDetails({ partnerId }: PartnerDetailsProps) {
    const router = useRouter();
    const [partner, setPartner] = useState<Partner | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                setLoading(true);
                const result = await getPartnerById(partnerId);

                if ('error' in result) {
                    setError(result.error);
                    toast.error(result.error);
                } else {
                    setPartner(result.data);
                }
            } catch (err) {
                setError("Failed to load partner details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (partnerId) {
            fetchPartner();
        }
    }, [partnerId]);

    if (loading) {
        return <BeautifulLoader fullScreen text="Loading details..." />;
    }

    if (error || !partner) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-white">
                <p className="text-xl text-white/70">{error || "Partner not found"}</p>
                <Button
                    variant="outline"
                    onClick={() => router.push('/network')}
                >
                    Back to Network
                </Button>
            </div>
        );
    }

    const galleryImages =
        partner?.gallery && partner.gallery.length > 0 ? partner.gallery : (partner?.thumbnail ? [partner.thumbnail] : []);

    const hasWhatsapp =
        partner?.socials?.whatsapp &&
        typeof partner.socials.whatsapp === "string" &&
        partner.socials.whatsapp.trim().length > 0;

    return (
        <div className="min-h-screen w-full bg-black">
            <div className="container mx-auto px-4 lg:px-0 py-10">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="cursor-pointer text-white mb-6 lg:mb-16 flex items-center gap-2 opacity-70 hover:opacity-100 transition"
                >
                    <ChevronLeft className="lg:w-8 lg:h-8" />
                    <span className="text-lg">Back</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[55%_35%] gap-6 lg:gap-20">
                    {/* Right Section (Details) - swapped order logically in code but visually ordered by grid/flex if needed, 
              but based on original modal, right section was text, left was gallery. 
              Original: grid-cols-[55%_40%]. Right Section is order-1 (Text), Left is order-2 (Gallery).
              Actually in original modal: 
              Right Section (text) has `order-1`
              Left Section (gallery) has `order-2 lg:order-0` -> on LG, gallery comes first (left).
              In grid-cols-[55%_40%], column 1 is 55%, column 2 is 40%.
              If Gallery is order-0, it goes to column 1.
              If Text is order-1, it goes to column 2.
              So 55% is Gallery, 40% is Text.
          */}

                    {/* Gallery Section */}
                    <div className="order-2 lg:order-1">
                        <ImageGallerySlider images={galleryImages} />

                        {/* About Section */}
                        <div className="mt-10">
                            <h2 className="text-xl lg:text-2xl font-serif mb-6 text-white">About</h2>
                            <p className="text-[#FFFFFFB3] leading-relaxed text-base lg:text-lg description whitespace-pre-wrap">
                                {partner?.about}
                            </p>
                        </div>

                        {/* Terms & Conditions */}
                        {partner.terms && partner.terms.length > 0 && (
                            <div className="mt-10">
                                <h2 className="text-xl lg:text-2xl font-serif mb-6 text-white">Terms & Conditions</h2>
                                <ul className="space-y-2 text-[#FFFFFFB3] text-sm lg:text-base">
                                    {partner.terms.map((term: string, index: number) => (
                                        <li key={index} className="flex gap-2">
                                            <span className="min-w-[20px]">{index + 1}.</span>
                                            <span>{term}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Contact & Locations */}
                        <div className="mt-10">
                            <h2 className="text-xl lg:text-2xl font-serif mb-6 text-white">Contact & Locations</h2>

                            <div className="space-y-4 text-[#FFFFFFB3] text-sm lg:text-base">
                                {partner.contacts?.map((contact: any, index: number) => (
                                    <div key={index} className="flex flex-col gap-1 pb-4 border-b border-white/10 last:border-0">
                                        <p className="font-semibold text-white/90">Location {index + 1}</p>
                                        <p>{contact.address}</p>
                                        {contact.phone && <p>{contact.phone}</p>}
                                        {contact.area && <p className="text-white/50 text-sm">{contact.area}</p>}
                                    </div>
                                ))}
                            </div>

                            {/* Social Icons */}
                            <div className="flex justify-start items-center gap-6 mt-10">
                                {partner.socials?.website && (
                                    <Link
                                        href={partner.socials.website}
                                        target="_blank"
                                        className="p-3 bg-white/5 rounded-full hover:bg-white/20 transition group"
                                    >
                                        <Globe className="w-6 h-6 lg:w-8 lg:h-8 text-white/70 group-hover:text-white" />
                                    </Link>
                                )}

                                {partner.socials?.instagram && (
                                    <Link
                                        href={partner.socials.instagram}
                                        target="_blank"
                                        className="p-3 bg-white/5 rounded-full hover:bg-white/20 transition group"
                                    >
                                        <Instagram className="w-6 h-6 lg:w-8 lg:h-8 text-white/70 group-hover:text-white" />
                                    </Link>
                                )}

                                {hasWhatsapp && partner.socials?.whatsapp && (
                                    <Link
                                        href={`https://wa.me/${partner.socials.whatsapp}`}
                                        target="_blank"
                                        className="p-3 bg-white/5 rounded-full hover:bg-white/20 transition group"
                                        aria-label="Contact via WhatsApp"
                                    >
                                        <div className="w-6 h-6 lg:w-8 lg:h-8 text-white/70 group-hover:text-white scale-110">
                                            <WhatsappIcon />
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info/Text Section */}
                    <div className="flex flex-col justify-start order-1 lg:order-2 lg:sticky lg:top-10 h-fit">
                        <div className="flex lg:py-4 pb-4 md:pb-0">
                            {(partner.category as any)?.title && (
                                <div
                                    className="py-2 px-6 border border-white/30 rounded-full text-xs lg:text-sm text-white/70 uppercase tracking-wider"
                                >
                                    {(partner.category as any)?.title}
                                </div>
                            )}
                        </div>

                        <h1 className="text-3xl lg:text-5xl font-semibold font-serif lg:mt-4 mb-4 text-white leading-tight">
                            {partner.name}
                        </h1>

                        {partner.offer?.[0] && (
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-4 backdrop-blur-sm">
                                <p className="text-xl lg:text-2xl font-serif mb-2 text-white">{partner.offer[0].title}</p>

                                <p className="description leading-relaxed text-sm lg:text-base text-[#FFFFFFB3] mb-4">
                                    {partner.offer?.[0]?.description}
                                </p>

                                {partner.offer?.[0]?.validUntil && (
                                    <p className="inline-block px-3 py-1 bg-white/10 rounded-md text-xs lg:text-sm text-[#FFFFFFB3]">
                                        Valid until{" "}
                                        {new Date(partner.offer[0].validUntil).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
