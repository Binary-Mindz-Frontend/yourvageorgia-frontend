"use client";

import { ArrowRight, ChevronDown, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/auth";
import PartnerDetailsModal from "@/app/(main)/network/_components/NetworkCardModal/PartnerDetailsModal"; // Import the modal

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

interface FavouriteItem {
  _id: string;
  partner: {
    _id: string;
    name: string;
    thumbnail: string;
    address?: string;
  };
}

const MyEdit = () => {
  const [data, setData] = useState<FavouriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<
    FavouriteItem["partner"] | null
  >(null); // State for selected partner
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchFavourites = async () => {
      const user = await getCurrentUser();
      if (!user?.accessToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_API}/favourite`, {
          headers: {
            Authorization: `${user.accessToken}`,
          },
        });

        const json = await res.json();

        if (res.ok) {
          setData(json.data);
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
    setSelectedPartner(partner); // Set the selected partner
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading favourites...
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

      <div className="space-y-5 lg:space-y-10">
        {data.map((item) => (
          <div
            key={item._id}
            className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl cursor-pointer"
            onClick={() => handleCardClick(item.partner)} // Open modal on card click
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
                      {item.partner.address || "Location not specified"}
                      <ArrowRight />
                    </div>
                  </div>

                  <button className="p-2">
                    <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-red-500 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button className="p-3 rounded-full hover:bg-black/50 transition">
            <ChevronDown className="lg:w-10 lg:h-10" />
          </button>
        </div>
      )}

      {/* Display modal when isModalOpen is true */}
      {isModalOpen && selectedPartner && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-transparent backdrop-blur-2xl bg-opacity-50 flex items-center justify-center">
          {/* PartnerDetailsModal content */}
          <div className="w-full -lg overflow-hidden max-h-[90vh]  overflow-y-auto scrollbar-hide">
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
