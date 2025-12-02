"use client";
import React from "react";

import img1 from "@/public/assets/partnership/1.svg";
import img2 from "@/public/assets/partnership/2.svg";
import img3 from "@/public/assets/partnership/3.svg";
import img4 from "@/public/assets/partnership/4.svg";
import img5 from "@/public/assets/partnership/5.svg";
import img6 from "@/public/assets/partnership/6.svg";
import Image from "next/image";

interface GalleryItemProps {
  src: string;
  alt: string;
  className?: string;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  src,
  alt,
  className = "",
}) => (
  <div
    className={`relative w-full h-[200px] lg:h-[424px] aspect-4/3 overflow-hidden rounded-lg ${className}`}
  >
    <Image
      src={src}
      alt={alt}
      width={500}
      height={500}
      loading="lazy"
      className="absolute inset-0 w-[424px] h-full lg:h-[424px] object-cover transition duration-300 ease-in-out hover:scale-105"
    />
    <div className="absolute inset-0 bg-black/10"></div>
  </div>
);

const WellnessGallery: React.FC = () => {
  return (
    <div className="min-h-screen text-white px-4 sm:px-8 lg:px-16 mt-10 lg:mt-30">
      {/* 6 Image Grid */}
      <div className="max-w-[1320px] mx-auto grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <GalleryItem src={img1.src} alt="Sauna Interior" />
        <GalleryItem src={img2.src} alt="Bar Lounge Area" />
        <GalleryItem src={img3.src} alt="Cryotherapy Treatment" />

        <GalleryItem src={img4.src} alt="Yoga Pose" />
        <GalleryItem src={img5.src} alt="Modern Faucets" />
        <GalleryItem src={img6.src} alt="Shoulder Close-up" />
      </div>

      {/* Partnerships Section */}
      <div className="max-w-7xl mx-auto mt-16 text-center pt-2 lg:pt-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-5">
          Partnerships
        </h2>
        <p className="text-base lg:text-2xl text-[#FFFFFFB3] font-normal">
          For curated partnerships, connect with us via email or socials.
        </p>
      </div>
    </div>
  );
};

export default WellnessGallery;
