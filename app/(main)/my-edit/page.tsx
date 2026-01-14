"use client";

import PartnerDetailsModal from "@/app/(main)/network/_components/NetworkCardModal/PartnerDetailsModal";
import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import { getCurrentUser } from "@/services/auth";
import { Partner } from "@/types/partner.types";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link"; // Added for navigation to login
import { useEffect, useState } from "react";
import FavouriteButton from "../network/_components/NetworkFilter/FavouriteButton";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

interface FavouriteItem {
  _id: string;
  partner: Partner;
}

const MyEdit = () => {
  const [data, setData] = useState<FavouriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [selectedPartner, setSelectedPartner] = useState<FavouriteItem["partner"] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFavourites = async () => {
      const user = await getCurrentUser();

      if (!user?.accessToken) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const res = await fetch(`${BASE_API}/favourite`, {
          headers: {
            Authorization: `${user.accessToken}`,
          },
        });

        const json = await res.json();

        if (res.ok) {
          setData(json.data || []);
        }
      } catch (error) {
        console.error("Failed to load favourites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const handleCardClick = (partner: FavouriteItem["partner"]) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 1. LOADING STATE
  if (loading) {
    return (
      <BeautifulLoader className="h-[60vh]" text="Loading My Edit" />
    );
  }

  // 2. NOT LOGGED IN STATE
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-xl lg:text-2xl font-medium pb-2">Members access</h2>
        <p className="text-sm lg:text-base text-[#FFFFFFB3] leading-relaxed px-4 pt-2">
          <Link href="/login" className="underline hover:text-white transition-colors duration-200">
            Log in
          </Link>
          {" "}to view your saved destinations.
        </p>
        {/* <Link
          href="/login"
          className="mt-12 px-6 py-2 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 lg:text-2xl focus:outline-none focus:ring-1 focus:ring-gray-600 rounded-full p-2"
        >
          Sign in
        </Link> */}
      </div>
    );
  }

  return (
    <div className="max-w-218 mx-auto p-4 lg:px-0 mt-10 md:mt-25">
      <header>
        <h2 className="font-serif text-3xl lg:text-5xl font-bold text-center mb-10 lg:mb-20">
          My Edit
        </h2>
      </header>

      {/* 3. LOGGED IN BUT NO DATA (EMPTY STATE) */}
      {data.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl font-serif font-bold mb-4">
            Please add favorite items to save here.
          </p>
          {/* <Link href="/network" className="text-white mt-4 inline-block">
            Browse partners
          </Link> */}

          <Link href="/network" passHref className="inline-flex mt-6">
            <button
              className="group cursor-pointer flex w-50 items-center justify-between rounded-md px-4 py-3 font-medium tracking-wide text-md text-foreground transition-colors bg-accent/20 border border-accent/30 hover:bg-accent/30"
            >
              <span>Back to Network</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>

        </div>
      ) : (
        <div className="space-y-5 lg:space-y-10">
          {data.map((item) => (
            <div
              key={item._id}
              className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl cursor-pointer"
              onClick={() => handleCardClick(item.partner)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${item.partner.thumbnail})`,
                }}
              >
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg lg:text-3xl font-semibold font-serif">
                        {item.partner.name}
                      </h2>
                      <div className="flex items-center text-sm lg:text-lg gap-2 italic opacity-80">
                        <span className="truncate">
                          {item.partner.contacts && item.partner.contacts.length > 0
                            ? (item.partner.contacts[0].area || item.partner.contacts[0].address || "Location not specified")
                            : "Location not specified"}
                        </span>
                        <ArrowRight />
                      </div>
                    </div>

                    <FavouriteButton
                      partnerId={item?.partner._id ?? ""}
                      className="p-2"
                      initialFavourited={true}
                      onToggle={(isFav) => {
                        if (!isFav) {
                          setData((prev) =>
                            prev.filter((p) => p.partner._id !== item.partner._id)
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button className="p-3 rounded-full hover:bg-black/50 transition" aria-label="Scroll down">
            <ChevronDown className="lg:w-10 lg:h-10" aria-hidden="true" />
          </button>
        </div>
      )}

      {isModalOpen && selectedPartner && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-transparent backdrop-blur-2xl bg-opacity-50 flex items-center justify-center">
          <div className="w-full overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide">
            <PartnerDetailsModal
              onClose={handleCloseModal}
              partner={selectedPartner}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEdit;