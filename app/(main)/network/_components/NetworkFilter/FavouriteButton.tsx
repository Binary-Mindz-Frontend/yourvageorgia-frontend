/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getCurrentUser } from "@/services/auth";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface FavouriteButtonProps {
  partnerId: string;
  className?: string;
}

const STORAGE_KEY = "favourites";

export default function FavouriteButton({
  partnerId,
  className = "",
}: FavouriteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 🔹 Load user + localStorage favourite
  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // localStorage check
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const favourites: string[] = JSON.parse(stored);
        setFavourited(favourites.includes(partnerId));
      }
    };

    init();
  }, [partnerId]);

  const token = user?.accessToken;

  const updateLocalStorage = (add: boolean) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const favourites: string[] = stored ? JSON.parse(stored) : [];

    let updated: string[];

    if (add) {
      updated = [...new Set([...favourites, partnerId])];
    } else {
      updated = favourites.filter((id) => id !== partnerId);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClick = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch(
        favourited
          ? `${process.env.NEXT_PUBLIC_BASE_API}/favourite/${partnerId}`
          : `${process.env.NEXT_PUBLIC_BASE_API}/favourite`,
        {
          method: favourited ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: favourited
            ? undefined
            : JSON.stringify({ program: partnerId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      //  update UI + localStorage
      updateLocalStorage(!favourited);
      setFavourited(!favourited);

      toast.success(
        favourited ? "Removed from favourites" : "Added to favourites"
      );
    } catch (error: any) {
      toast.error(error.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      disabled={loading}
      className={`absolute z-10 cursor-pointer p-1 rounded-full
        
        ${favourited ? "text-white" : "text-white "}
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
    >
      <Heart className={`w-6 h-6 ${favourited ? "fill-current" : ""}`} />
    </button>
  );
}
