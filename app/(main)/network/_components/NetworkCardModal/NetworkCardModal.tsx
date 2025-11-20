"use client";

import Image from "next/image";
import {
  MapPin,
  Globe,
  Instagram,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import img5 from "@/public/assets/network/5.svg";
import { Button } from "@/components/ui/button";

export default function NetworkCardModal({ onClose }: any) {
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
              variant={"outline"}
              className="cursor-pointer py-2.5 rounded-sm sm:w-auto text-sm lg:text-base text-white/70 tracking-wide px-10"
            >
              Movement
            </Button>
          </div>

          <h1 className="text-xl lg:text-4xl font-light font-serif lg:mt-6 mb-2">
            The Hundred Wellness Centre
          </h1>

          <p className="text-base lg:text-lg font-light mb-4 lg:mb-6">
            10% Off All Yoga, Pilates, and Wellness Classes
          </p>

          <p className="leading-relaxed text-sm lg:text-base text-[#FFFFFFB3]">
            Present your Solenne member card to enjoy exclusive member rates on
            all classes and wellness programs.
          </p>

          <p className="lg:mt-4 text-sm lg:text-base text-[#FFFFFFB3]">
            Offer valid until 01/04/2026
          </p>
        </div>

        {/* Left Section (Image + About + Footer) */}
        <div className="order-2 lg:order-0">
          <div className="relative w-full h-[242px] lg:h-[435px] overflow-hidden rounded-xl">
            <Image
              src={img5}
              alt="Wellness Centre"
              fill
              className="object-cover"
            />

            {/* Slider Arrows (Centered on Mobile) */}
            <button className="rounded-full hover:bg-white/20 transition absolute left-3 top-1/2 -translate-y-1/2 lg:static lg:hidden z-20">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button className="rounded-full hover:bg-white/20 transition absolute right-3 top-1/2 -translate-y-1/2 lg:static lg:hidden z-20">
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>

          {/* Slider Arrows (Bottom for Desktop) */}
          <div className="hidden lg:flex justify-between items-center mt-3 px-1">
            <button className="p-2 rounded-full hover:bg-white/20 transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/20 transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* About Section */}
          <div className="mt-10">
            <h2 className="lg:text-xl mb-6">
              About The Hundred Wellness Centre
            </h2>
            <p className="text-[#FFFFFFB3] leading-relaxed text-base">
              The Hundred Wellness Centre is one of Dubai’s most serene
              destinations for movement and holistic health. Nestled in
              Jumeirah, it offers Pilates, Yoga, and functional movement classes
              designed to restore balance, strength, and mindfulness. Every
              class combines expert guidance, elegant interiors, and a calm
              community space, inviting women to reconnect with their rhythm.
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="mt-10">
            <h2 className="lg:text-xl mb-6">Terms & Conditions</h2>
            <ul className="space-y-1 text-[#FFFFFFB3] text-sm lg:text-base">
              <li>1. Valid for Solenne members only.</li>
              <li>2. Cannot be combined with other offers or promotions.</li>
              <li>3. Non-transferable and non-refundable.</li>
            </ul>
          </div>

          {/* Contact & Locations */}
          <div className="mt-10 mb-14">
            <h2 className="lg:text-xl mb-6">Contact & Locations</h2>

            <div className="space-y-3 text-[#FFFFFFB3] text-sm lg:text-base">
              <p className="flex items-center gap-2">
                1. Jumeirah 1, Dubai. Phone– 04 344 7333
                <MapPin className="w-4 h-4" />
              </p>

              <p className="flex items-center gap-2">
                2. City Walk, Dubai. Phone– 04 856 9923
                <MapPin className="w-4 h-4" />
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-6 mt-6">
              <button className="p-3 rounded-full hover:bg-white/10 transition">
                <Globe className="lg:w-10 lg:h-10" />
              </button>
              <button className="p-3 rounded-full hover:bg-white/10 transition">
                <Instagram className="lg:w-10 lg:h-10" />
              </button>
              <button className="p-3 rounded-full hover:bg-white/10 transition">
                <MessageCircle className="lg:w-10 lg:h-10" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
