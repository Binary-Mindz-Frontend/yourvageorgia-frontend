/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin, Globe, Instagram, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/app/(main)/network/_components/NetworkCardModal/Icon/Icons";
import ImageGallerySlider from "@/app/(main)/network/_components/ImageGallerySlider/ImageGallerySlider";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PartnerDetailsModal({
  onClose,
  partner,
}: {
  onClose: () => void;
  partner: any;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  // console.log(partner);

  const galleryImages =
    partner?.gallery?.length > 0 ? partner.gallery : partner?.thumbnail;

  const hasWhatsapp =
    typeof partner?.socials?.whatsapp === "string" &&
    partner.socials.whatsapp.trim().length > 0;

  useEffect(() => {
    // Use setTimeout to schedule the state update after mount
    // This avoids synchronous state updates during render
    const timer = setTimeout(() => {
      setModalVisible(true);
    }, 0); // Using 0ms delay ensures it runs after the initial render

    return () => {
      clearTimeout(timer);
      setModalVisible(false);
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (modalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalVisible]);

  return (
    <div
      className={`fixed inset-0 z-60 bg-black min-h-screen w-full overflow-y-auto transition-all duration-500 ease-in-out ${modalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
    >
      <div className="container mx-auto px-4 lg:px-0 py-10">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="cursor-pointer text-white mb-6 lg:mb-16 flex items-center gap-2 opacity-70 hover:opacity-100 transition"
        >
          <ChevronLeft className="lg:w-8 lg:h-8" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[55%_40%] gap-6 lg:gap-10">
          {/* Right Section */}
          <div className="flex flex-col justify-start order-1">
            <div className="flex lg:py-4 pb-4 md:pb-0">
              {partner.category?.title && (
                <Button
                  variant="outline"
                  className="cursor-pointer py-3 border border-white/70 rounded-md sm:w-auto text-sm lg:text-base text-white/70 px-10"
                >
                  {partner.category?.title}
                </Button>
              )}
            </div>

            <h1 className="text-2xl lg:text-4xl font-semibold font-serif lg:mt-6 mb-2">
              {partner.name}
            </h1>

            {partner.offer?.[0] && (
              <p className="lg:text-lg mb-4 lg:mb-6">{partner.offer[0].title}</p>
            )}

            <p className="description leading-relaxed text-sm lg:text-base text-[#FFFFFFB3]">
              {partner.offer?.[0]?.description}
            </p>

            {partner.offer?.[0]?.validUntil && (
              <p className="lg:mt-4 text-sm lg:text-base text-[#FFFFFFB3]">
                Offer valid until{" "}
                {new Date(partner.offer[0].validUntil).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Left Section */}
          <div className="order-2 lg:order-0">
            <ImageGallerySlider images={galleryImages} />

            {/* About Section */}
            <div className="mt-10">
              <h2 className="lg:text-xl mb-6">About</h2>
              <p className="text-[#FFFFFFB3] leading-relaxed text-base description">
                {partner?.about}
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="mt-10">
              <h2 className="lg:text-xl mb-6">Terms & Conditions</h2>
              <ul className="space-y-1 text-[#FFFFFFB3] text-sm lg:text-base">
                {partner.terms?.map((term: string, index: number) => (
                  <li key={index}>
                    {index + 1}. {term}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Locations */}
            <div className="mt-10 ">
              <h2 className="lg:text-xl mb-6">Contact & Locations</h2>

              <div className="space-y-3 text-[#FFFFFFB3] text-sm lg:text-base">
                {partner.contacts?.map((contact: any, index: number) => (
                  <p key={index} className="flex items-center gap-2">
                    {index + 1}. {contact.address} {contact.phone}
                    {/* <MapPin className="w-4 h-4" /> */}
                  </p>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex justify-center items-center md:justify-start gap-6 mt-10">
                {partner.socials?.website && (
                  <Link
                    href={partner.socials.website}
                    target="_blank"
                    className="p-3 rounded-full hover:bg-white/10 transition"
                  >
                    <Globe className="lg:w-10 lg:h-10" />
                  </Link>
                )}

                {partner.socials?.instagram && (
                  <Link
                    href={partner.socials.instagram}
                    target="_blank"
                    className="p-3 rounded-full hover:bg-white/10 transition"
                  >
                    <Instagram className="lg:w-10 lg:h-10" />
                  </Link>
                )}

                {hasWhatsapp && (

                  <Link
                    href={`https://wa.me/${partner.socials.whatsapp}`}
                    target="_blank"
                    className="p-3 rounded-full hover:bg-white/10 transition"
                  >
                    <WhatsappIcon />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}