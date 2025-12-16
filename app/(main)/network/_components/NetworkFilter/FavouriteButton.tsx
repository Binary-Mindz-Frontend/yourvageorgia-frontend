"use client";

import { Heart } from "lucide-react";
import { addFavourite } from "@/services/favourite";

interface FavouriteButtonProps {
  partnerId: string;
  className?: string;
}

export default function FavouriteButton({
  partnerId,
  className = "",
}: FavouriteButtonProps) {
  const handleClick = async () => {
    try {
      await addFavourite(partnerId);
      console.log("Favourite added:", partnerId);
    } catch (error) {
      console.error("Failed to add favourite", error);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); 
        handleClick();
      }}
      className={`absolute cursor-pointer z-10 text-white hover:text-red-400 p-1 bg-black/30 rounded-full ${className}`}
    >
      <Heart />
    </button>
  );
}
