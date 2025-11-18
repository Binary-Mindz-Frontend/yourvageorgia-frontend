import img1 from "@/public/assets/network/1.svg";
import img2 from "@/public/assets/network/2.svg";
import img3 from "@/public/assets/network/3.svg";
import img4 from "@/public/assets/network/4.svg";
import { ArrowRight, Heart, ListFilter } from "lucide-react";

const NetworkFilter = () => {
  // Mock image URL to be used with the style attribute
  const imageUrl = img1;

  return (
    // Outer container for the whole screen/section
    <div className="  text-white p-4 max-w-4xl mx-auto">
      {/* Header/Navigation */}
      <header className="flex justify-end mb-8">
        {/* Hamburger Menu Icon (Simplified) */}
        <button className="text-white focus:outline-none" aria-label="Menu">
          <ListFilter />
        </button>
      </header>

      {/* Filter Buttons */}
      <div className="flex space-x-2 sm:space-x-3 mb-8 overflow-x-auto pb-2">
        {/* 'All' Button - Primary/Active Style */}
        <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg shadow-md whitespace-nowrap">
          All
        </button>

        {/* Other Buttons - Secondary Style */}
        {["Movement", "Recovery", "Radiance", "Taste"].map((filter) => (
          <button
            key={filter}
            className="px-4 py-3 border w-full border-gray-700 text-white  font-medium rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Wellness Centre Card */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
        {/* Image Placeholder - Uses a background image style to match the layout */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          // NOTE: In a real Next.js app, you should replace this inline style with the <Image> component for optimization.
          style={{
            backgroundImage: `url('assets/network/1.svg')`,
            // Styling to mimic the sun flare and warm lighting shown in the image
            filter: "brightness(0.9) saturate(1.1)",
          }}
        >
          {/* This overlay mimics the dark, warm glow and ensures text contrast */}
          <div className="absolute inset-0 bg-leniar-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Text Content */}
          <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <div className="flex items-center justify-between">
              <div>
                {/* Centre Name */}
                <div className="flex gap-1">
                  <h2 className="text-3xl font-light mb-1 font-serif">
                    The Hundred Wellness Centre
                  </h2>
                  <button
                    className="text-white hover:text-red-400 transition-colors p-2"
                    aria-label="Favorite"
                  >
                    <Heart/>
                  </button>
                </div>
                {/* Location with Arrow */}
                <div className="flex items-center text-lg font-light gap-2 italic opacity-80">
                  Jumeirah
                  <ArrowRight />
                </div>
              </div>

              {/* Heart Icon (Favorite) */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkFilter;
