/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getCurrentUser } from "@/services/auth";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface FavouriteButtonProps {
  partnerId: string;
  className?: string;
}

export default function FavouriteButton({
  partnerId,
  className = "",
}: FavouriteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const [user, setUser] = useState<any>(null);
  console.log("user", user);
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const token = user?.accessToken; 
  console.log('token',token);
  const handleClick = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("https://api.solenneuae.com/api/favourite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          program: partnerId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to add favourite");
      }

      setFavourited(true);
      console.log("Favourite added:", partnerId);
    } catch (error) {
      console.error("Failed to add favourite", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        // e.stopPropagation();
        handleClick();
      }}
      disabled={loading}
      className={`absolute z-10 cursor-pointer p-1 rounded-full
        bg-black/30
        ${favourited ? "text-red-500" : "text-white hover:text-red-400"}
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
    >
      <Heart className={`w-5 h-5 ${favourited ? "fill-current" : ""}`} />
    </button>
  );
}
