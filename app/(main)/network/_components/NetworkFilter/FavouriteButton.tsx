/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getCurrentUser } from "@/services/auth";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface FavouriteButtonProps {
  partnerId: string;
  className?: string;
  initialFavourited?: boolean;
  onToggle?: (isFavourited: boolean) => void;
}

const STORAGE_KEY = "favourites";

export default function FavouriteButton({
  partnerId,
  className = "",
  initialFavourited = false,
  onToggle,
}: FavouriteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [favourited, setFavourited] = useState(initialFavourited);
  const [user, setUser] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 🔹 Load user + localStorage favourite
  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // localStorage check
      const stored = localStorage.getItem(STORAGE_KEY);

      // If initialFavourited is true, ensure it's in localStorage
      if (initialFavourited) {
        setFavourited(true);
        if (stored) {
          const favourites: string[] = JSON.parse(stored);
          if (!favourites.includes(partnerId)) {
            updateLocalStorage(true);
          }
        } else {
          updateLocalStorage(true);
        }
      } else if (stored) {
        const favourites: string[] = JSON.parse(stored);
        setFavourited(favourites.includes(partnerId));
      }
    };

    init();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [partnerId, initialFavourited]);

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

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Optimistic Update
    const previousState = favourited;
    const newState = !previousState;

    setFavourited(newState);
    updateLocalStorage(newState);
    if (onToggle) onToggle(newState);

    try {
      setLoading(true);

      const res = await fetch(
        previousState
          ? `${process.env.NEXT_PUBLIC_BASE_API}/favourite/${partnerId}`
          : `${process.env.NEXT_PUBLIC_BASE_API}/favourite`,
        {
          method: previousState ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: previousState
            ? undefined
            : JSON.stringify({ program: partnerId }),
          signal: abortControllerRef.current.signal
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      toast.success(
        newState ? "Added to favourites" : "Removed from favourites"
      );
    } catch (error: any) {
      if (error.name === 'AbortError') return;

      // Revert optimization
      console.error(error);
      setFavourited(previousState);
      updateLocalStorage(previousState);
      if (onToggle) onToggle(previousState);
      toast.error(error.message || "Failed to update favourite");
    } finally {
      if (abortControllerRef.current?.signal.aborted) {
        // If aborted, don't reset loading state if we want to keep it disabled, 
        // or logic might be complicated. 
        // But usually finally runs. 
        // If we start a NEW request, loading will be set to true again.
      }
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
      className={`cursor-pointer p-1 rounded-full transition-all active:scale-95
        ${favourited ? "text-white" : "text-white"}
        ${loading ? "opacity-70" : ""}
        ${className}`}
    >
      <Heart className={`w-6 h-6 ${favourited ? "fill-current" : ""}`} />
    </button>
  );
}
