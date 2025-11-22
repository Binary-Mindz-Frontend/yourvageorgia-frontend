"use client";
import { MapPin, Globe, Instagram, ChevronLeft } from "lucide-react";
import img1 from "@/public/assets/network/gallery/1.jpg";
import img2 from "@/public/assets/network/gallery/2.jpg";
import img3 from "@/public/assets/network/gallery/3.jpg";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "./Icon/Icons";
import ImageGallerySlider from "../ImageGallerySlider/ImageGallerySlider";

export default function NetworkCardModal({ onClose }: any) {
  const galleryImages = [img1, img2, img3];
  return (
    <div className="min-h-screen container mx-auto text-white px-4 lg:px-0 py-10 overflow-y-auto scrollbar-hide">
      {/* Back Button */}
      <button
        onClick={onClose}
        className="cursor-pointer text-white mb-6 lg:mb-16 flex items-center gap-2 opacity-70 hover:opacity-100 transition"
      >
        <ChevronLeft className="lg:w-8 lg:h-8" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_40%] gap-6 lg:gap-10">
        {/* Right Section (But appears first on mobile) */}
        <div className="flex flex-col justify-start order-1">
          <div className="flex lg:py-4 pb-4 md:pb-0">
            <Button
              variant="outline"
              className="cursor-pointer py-3 border border-white/70 rounded-md sm:w-auto text-sm lg:text-base text-white/70 px-10"
            >
              Recovery
            </Button>
          </div>

          <h1 className="text-2xl lg:text-4xl font-semibold font-serif lg:mt-6 mb-2">
            Dr Stretch
          </h1>

          <p className="lg:text-lg mb-4 lg:mb-6 text-[#FFFFFFB3]">Offer:</p>
          <ul className="list-disc list-inside lg:text-lg text-[#FFFFFFB3] space-y-1 mb-4">
            <li>15% off single sessions</li>
            <li>20% off packages</li>
          </ul>

          <p className="leading-relaxed text-sm lg:text-base text-[#FFFFFFB3]">
            Present your Solenne member card to enjoy exclusive member rates on
            all classes and wellness programs.
          </p>

          <p className="lg:mt-4 text-sm lg:text-base text-[#FFFFFFB3]">
            Offer valid until 31/12/2026
          </p>
        </div>

        {/* Left Section (Image + About + Footer) */}
        <div className="order-2 lg:order-0">
          <ImageGallerySlider images={galleryImages} />

          {/* About Section */}
          <div className="mt-10">
            <h2 className="lg:text-xl mb-6">
              About The Hundred Wellness Centre
            </h2>
            <p className="text-[#FFFFFFB3] leading-relaxed text-base">
              Dubai’s specialist stretching studio, offering guided one-to-one
              sessions that enhance flexibility, ease muscle tension, and
              support long-term physical alignment
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="mt-10">
            <h2 className="lg:text-xl mb-6">Terms & Conditions</h2>
            <ul className="space-y-1 text-[#FFFFFFB3] text-sm lg:text-base">
              <li>
                1. Cannot be used in conjunction with any other offer or
                discounted service.
              </li>
              {/* <li>2. Cannot be combined with other offers or promotions.</li>
              <li>3. Non-transferable and non-refundable.</li> */}
            </ul>
          </div>

          {/* Contact & Locations */}
          <div className="mt-10 ">
            <h2 className="lg:text-xl mb-6">Contact & Locations</h2>

            <div className="space-y-4 text-[#FFFFFFB3] text-sm lg:text-base">
              {/* Dubai Hills */}
              <div className="flex items-start gap-2">
                <div className="space-y-1">
                  <p className="font-semibold">Dubai Hills</p>
                  <p>
                    Office:{" "}
                    <a
                      href="https://maps.app.goo.gl/9NYL3ofPRZxysEZM8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white"
                    >
                      Dubai Hills Mall, Al Khail Rd, Hadaeq Sheikh Mohammed Bin
                      Rashid
                    </a>
                  </p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:hello@drstretch.ae"
                      className=" hover:text-white"
                    >
                      hello@drstretch.ae
                    </a>
                  </p>
                  <p>
                    Phone: 04 852 9386 | Mobile:{" "}
                   050 491 6854
                  </p>
                </div>
                 <MapPin className="w-5 h-5 mt-1 shrink-0" />
              </div>

              {/* Palm Jumeirah */}
              <div className="flex items-start gap-2">
                <div className="space-y-1">
                  <p className="font-semibold">Palm Jumeirah</p>
                  <p>
                    Office:{" "}
                    <a
                      href="https://maps.app.goo.gl/tXyKNADu8E31eNuM7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white"
                    >
                      Golden Mile 5, Palm Jumeirah
                    </a>
                  </p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:hello@drstretch.ae"
                      className="hover:text-white"
                    >
                      hello@drstretch.ae
                    </a>
                  </p>
                  <p>
                    Phone: 04 577 0433 | Mobile:
                    050 315 6707
                  </p>
                </div>
                 <MapPin className="w-5 h-5 mt-1 shrink-0" />
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-6 mt-10">
              <button className="p-3 rounded-full hover:bg-white/10 transition">
                <Globe className="lg:w-10 lg:h-10" />
              </button>
              <button className="p-3 rounded-full hover:bg-white/10 transition">
                <Instagram className="lg:w-10 lg:h-10" />
              </button>
              <button className="p-3 rounded-full hover:bg-white/10 transition">
                <WhatsappIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
