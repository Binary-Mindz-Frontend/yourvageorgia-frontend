"use client";

import { useEffect } from "react";
import useUser from "@/hooks/useUser";

const STORAGE_KEY = "favourites";

interface FavouriteItem {
    _id: string;
    partner: {
        _id: string;
    };
}

export default function FavouriteSync() {
    const { user } = useUser();

    useEffect(() => {
        if (!user?.accessToken) return;

        const syncFavourites = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/favourite`, {
                    headers: {
                        Authorization: `${user.accessToken}`,
                    },
                });

                if (res.ok) {
                    const json = await res.json();
                    const serverFavorites = json.data.map((item: FavouriteItem) => item.partner._id);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(serverFavorites));
                }
            } catch (error) {
                console.error("Failed to sync favourites", error);
            }
        };

        syncFavourites();
    }, [user?.accessToken]);

    return null;
}
