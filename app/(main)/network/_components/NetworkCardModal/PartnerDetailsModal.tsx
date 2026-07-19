/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ImageGallerySlider from "@/app/(main)/network/_components/ImageGallerySlider/ImageGallerySlider";
import { WhatsappIcon } from "@/app/(main)/network/_components/NetworkCardModal/Icon/Icons";
import { Button } from "@/components/ui/button";
import useUser from "@/hooks/useUser";
import { ChevronLeft, Copy, Globe, Instagram, Mail } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function PartnerDetailsModal({
  onClose,
  partner,
}: {
  onClose: () => void;
  partner: any;
}) {
  // Unique name for the React 19 <ViewTransition> shared-element morph.
  // The originating PartnerCard (or carousel item) passes the same name so
  // the browser animates the thumbnail → hero image smoothly.
  const vtName = partner?._id ? `partner-${partner._id}` : undefined;

  // Start invisible, animate in after mount to avoid black flash
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setModalVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const { user } = useUser();

  // Coupon state
  const [isFetchingCoupon, setIsFetchingCoupon] = useState(false);
  const [fetchedCoupon, setFetchedCoupon] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Normalize galleryImages into an Array<string>. A common upstream shape
  // is `partner.thumbnail` (string) when gallery is empty — a single string
  // would otherwise iterate as one-character fragments. Always wrap.
  const galleryImages: string[] = useMemo(() => {
    const g = partner?.gallery;
    if (Array.isArray(g) && g.length > 0) return g;
    if (typeof partner?.thumbnail === "string" && partner.thumbnail) {
      return [partner.thumbnail];
    }
    return [];
  }, [partner?.gallery, partner?.thumbnail]);

  const hasWhatsapp =
    typeof partner?.socials?.whatsapp === "string" &&
    partner.socials.whatsapp.trim().length > 0;

  const partnerEmail = partner?.contacts?.[0]?.email;

  // Body-scroll lock while the modal is visible. Cleanup on close only.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleViewCoupon = async () => {
    if (!user?.accessToken) {
      toast.error("Available to logged-in members only.");
      return;
    }

    try {
      setIsFetchingCoupon(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/partner/coupon/${partner._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${user.accessToken}`,
          },
        }
      );

      const result = await res.json();

      if (result?.success) {
        setFetchedCoupon(result.data.coupon);
        toast.success("Code retrieved successfully.");
      } else {
        throw new Error(result?.message || "Failed to fetch code.");
      }
    } catch (error: any) {
      console.error("Error fetching code:", error);
      toast.error(error.message || "Something went wrong fetching the code.");
    } finally {
      setIsFetchingCoupon(false);
    }
  };

  const handleCopyCoupon = () => {
    if (fetchedCoupon) {
      navigator.clipboard.writeText(fetchedCoupon);
      setIsCopied(true);
      toast.success("Code copied to clipboard");

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-60 bg-black min-h-dvh h-dvh w-full overflow-y-auto transition-all duration-500 ease-in-out ${modalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
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

            {/* coupon section */}
            {partner.coupon && (
              <div className="mb-4 lg:mb-6">
                {!fetchedCoupon ? (
                  <Button
                    onClick={handleViewCoupon}
                    disabled={isFetchingCoupon}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/30 h-9 px-3 text-sm lg:h-10 lg:px-4 lg:text-base"
                  >
                    {isFetchingCoupon ? "Loading..." : "View code"}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="bg-white/10 border border-white/30 px-3 py-1.5 lg:px-4 lg:py-2 rounded-md font-normal text-base lg:text-lg tracking-wider">
                      {fetchedCoupon}
                    </div>
                    <Button
                      onClick={handleCopyCoupon}
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-white/5 hover:bg-white/20 text-white h-8 w-8 lg:h-10 lg:w-10 shrink-0"
                      title="Copy Coupon"
                    >
                      {/* {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />} */}
                      <Copy className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </Button>
                  </div>
                )}
              </div>
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
            {/* Directional enter: partners open with a forward nav-style slide-up */}
            <ViewTransition enter="slide-up" default="none">
              <ImageGallerySlider images={galleryImages} viewTransitionName={vtName} />
            </ViewTransition>

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
                     <WhatsappIcon className="lg:w-10 lg:h-10" />
                  </Link>
                )}

                {partnerEmail && (
                  <Link
                    href={`mailto:${partnerEmail}`}
                    className="p-3 rounded-full hover:bg-white/10 transition"
                  >
                    <Mail className="lg:w-10 lg:h-10" />
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