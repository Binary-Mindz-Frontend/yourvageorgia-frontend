"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/services/auth";

const STORAGE_KEY = "favourites";

interface FavouriteItem {
    _id: string;
    partner: {
        _id: string;
    };
}

export default function FavouriteSync() {
    useEffect(() => {
        const syncFavourites = async () => {
            try {
                const user = await getCurrentUser();
                if (!user?.accessToken) return;

                // Fetch favorites from server
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/favourite`, {
                    headers: {
                        Authorization: `${user.accessToken}`,
                    },
                });

                if (res.ok) {
                    const json = await res.json();
                    // Extract partner IDs
                    const serverFavorites = json.data.map((item: FavouriteItem) => item.partner._id);

                    // Overwrite local storage with server truth
                    // This ensures that if the user logs in on a new device, their favorites are pulled down.
                    // Note: This overrides local changes if they haven't synced yet, but since our app syncs immediately
                    // on interaction, this is safe for "on load" synchronization.
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(serverFavorites));
                }
            } catch (error) {
                console.error("Failed to sync favourites", error);
            }
        };

        syncFavourites();
    }, []);

    return null;
}
