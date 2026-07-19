// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { getCurrentUser } from "@/services/auth";
// import { Heart } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// interface FavouriteButtonProps {
//   partnerId: string;
//   className?: string;
//   initialFavourited?: boolean;
//   onToggle?: (isFavourited: boolean) => void;
// }

// const STORAGE_KEY = "favourites";

// export default function FavouriteButton({
//   partnerId,
//   className = "",
//   initialFavourited = false,
//   onToggle,
// }: FavouriteButtonProps) {
//   const [loading, setLoading] = useState(false);
//   const [favourited, setFavourited] = useState(initialFavourited);
//   const [user, setUser] = useState<any>(null);

//   // 🔹 Load user + localStorage favourite
//   useEffect(() => {
//     const init = async () => {
//       const currentUser = await getCurrentUser();
//       setUser(currentUser);

//       // localStorage check
//       const stored = localStorage.getItem(STORAGE_KEY);

//       // If initialFavourited is true, ensure it's in localStorage
//       if (initialFavourited) {
//         setFavourited(true);
//         if (stored) {
//           const favourites: string[] = JSON.parse(stored);
//           if (!favourites.includes(partnerId)) {
//             updateLocalStorage(true);
//           }
//         } else {
//           updateLocalStorage(true);
//         }
//       } else if (stored) {
//         const favourites: string[] = JSON.parse(stored);
//         setFavourited(favourites.includes(partnerId));
//       }
//     };

//     init();
//   }, [partnerId, initialFavourited]);

//   const token = user?.accessToken;

//   const updateLocalStorage = (add: boolean) => {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     const favourites: string[] = stored ? JSON.parse(stored) : [];

//     let updated: string[];

//     if (add) {
//       updated = [...new Set([...favourites, partnerId])];
//     } else {
//       updated = favourites.filter((id) => id !== partnerId);
//     }

//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//   };

//   const handleClick = async () => {
//     if (!token) {
//       toast.error("Please login first");
//       return;
//     }

//     if (loading) return;

//     // Optimistic Update
//     const previousState = favourited;
//     const newState = !previousState;

//     setFavourited(newState);
//     updateLocalStorage(newState);
//     if (onToggle) onToggle(newState);

//     // We don't show toast immediately to avoid spam, or we can show "Processing..." 
//     // But for better UX, let's just assume success and revert on failure.
//     // Or we can keep the toast but make it instant? 
//     // User requested "efficiency", usually implies speed. 
//     // Let's keep toast but maybe less intrusive or just rely on the icon state.
//     // I will keep the toast as it was but maybe debounced or just standard.
//     // Actually, let's keep it simple: Update UI -> API Call -> Revert if error.

//     try {
//       setLoading(true);

//       const res = await fetch(
//         previousState
//           ? `${process.env.NEXT_PUBLIC_BASE_API}/favourite/${partnerId}`
//           : `${process.env.NEXT_PUBLIC_BASE_API}/favourite`,
//         {
//           method: previousState ? "DELETE" : "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `${token}`,
//           },
//           body: previousState
//             ? undefined
//             : JSON.stringify({ program: partnerId }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.message || "Something went wrong");
//       }

//       toast.success(
//         newState ? "Added to favourites" : "Removed from favourites"
//       );
//     } catch (error: any) {
//       // Revert optimization
//       console.error(error);
//       setFavourited(previousState);
//       updateLocalStorage(previousState);
//       if (onToggle) onToggle(previousState);
//       toast.error(error.message || "Failed to update favourite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         handleClick();
//       }}
//       disabled={loading}
//       className={`cursor-pointer p-1 rounded-full transition-all active:scale-95
//         ${favourited ? "text-white" : "text-white"}
//         ${loading ? "opacity-70" : ""}
//         ${className}`}
//     >
//       <Heart className={`w-6 h-6 ${favourited ? "fill-current" : ""}`} />
//     </button>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useUser from "@/hooks/useUser";
import { Heart } from "lucide-react";
import { useEffect, useState, useCallback, memo, useRef } from "react";
import { toast } from "sonner";

interface FavouriteButtonProps {
  partnerId: string;
  className?: string;
  initialFavourited?: boolean;
  onToggle?: (isFavourited: boolean) => void;
}

const STORAGE_KEY = "favourites";

// Helper functions moved outside component
const getFavourites = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setFavourites = (favourites: string[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
};

const FavouriteButton = memo(({
  partnerId,
  className = "",
  initialFavourited = false,
  onToggle,
}: FavouriteButtonProps) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [favourited, setFavourited] = useState(initialFavourited);
  const mountedRef = useRef(true);

  // Initialize once
  useEffect(() => {
    mountedRef.current = true;

    // Check localStorage
    const favourites = getFavourites();
    const isFavourited = favourites.includes(partnerId);

    if (initialFavourited && !isFavourited) {
      setFavourites([...favourites, partnerId]);
      setFavourited(true);
    } else {
      setFavourited(isFavourited);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [partnerId, initialFavourited]);

  const handleClick = useCallback(async () => {
    if (!user?.accessToken) {
      toast.error("Please login first");
      return;
    }

    if (loading) return;

    // Optimistic update
    const previousState = favourited;
    const newState = !previousState;

    setFavourited(newState);
    
    // Update localStorage
    const favourites = getFavourites();
    const updated = newState
      ? [...new Set([...favourites, partnerId])]
      : favourites.filter((id) => id !== partnerId);
    setFavourites(updated);
    
    onToggle?.(newState);

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
            Authorization: `${user.accessToken}`,
          },
          body: previousState ? undefined : JSON.stringify({ program: partnerId }),
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
      // Revert on error
      console.error(error);
      if (!mountedRef.current) return;

      setFavourited(previousState);
      setFavourites(
        previousState
          ? [...getFavourites(), partnerId]
          : getFavourites().filter((id) => id !== partnerId)
      );
      onToggle?.(previousState);
      toast.error(error.message || "Failed to update favourite");
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, loading, favourited, partnerId, onToggle]);

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
      aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
    >
      <Heart className={`w-6 h-6 ${favourited ? "fill-current" : ""}`} />
    </button>
  );
});

FavouriteButton.displayName = 'FavouriteButton';

export default FavouriteButton;