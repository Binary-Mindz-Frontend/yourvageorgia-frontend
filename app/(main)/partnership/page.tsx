"use client";
import React from "react";

import img1 from "@/public/assets/partnership/1.svg";
import img2 from "@/public/assets/partnership/2.svg";
import img3 from "@/public/assets/partnership/3.svg";
import img4 from "@/public/assets/partnership/4.svg";
import img5 from "@/public/assets/partnership/5.svg";
import img6 from "@/public/assets/partnership/6.svg";

interface GalleryItemProps {
  src: string;
  alt: string;
  className?: string;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ src, alt, className = "" }) => (
  <div className={`relative w-full aspect-4/3 overflow-hidden rounded-lg ${className}`}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover transition duration-300 ease-in-out hover:scale-105"
    />
    <div className="absolute inset-0 bg-black/10"></div>
  </div>
);

const WellnessGallery: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white py-16 px-4 sm:px-8 lg:px-16 font-sans">

      {/* 6 Image Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <GalleryItem src={img1.src} alt="Sauna Interior" />
        <GalleryItem src={img2.src} alt="Bar Lounge Area" />
        <GalleryItem src={img3.src} alt="Cryotherapy Treatment" />

        <GalleryItem src={img4.src} alt="Yoga Pose" />
        <GalleryItem src={img5.src} alt="Modern Faucets" />
        <GalleryItem src={img6.src} alt="Shoulder Close-up" />
      </div>

      {/* Partnerships Section */}
      <div className="max-w-7xl mx-auto mt-16 text-center pt-8">
        <h2
          className="text-3xl sm:text-4xl font-serif font-light tracking-[0.15em] uppercase mb-3"
        >
          Partnerships
        </h2>
        <p className="text-sm sm:text-base text-gray-400 font-light">
          For curated partnerships, connect with us via email or socials.
        </p>
      </div>
    </div>
  );
};

export default WellnessGallery;
