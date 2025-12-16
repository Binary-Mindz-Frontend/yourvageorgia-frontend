import img1 from "@/public/assets/network/1.svg";
import img2 from "@/public/assets/network/2.svg";

import { ArrowRight, ChevronDown, Heart } from "lucide-react";

const MyEdit = () => {
  const data = [
    {
      img: img1,
      title: "The Hundred Wellness Centre",
      location: "Jumeirah",
      category: "Movement",
    },
    {
      img: img2,
      title: "Reform Studio",
      location: "Al Quoz",
      category: "Recovery",
    },
    
  ];
  return (
    <div className="max-w-[872px] mx-auto p-4 lg:px-0 mt-10 md:mt-25">
      <header>
        <h2 className="font-serif text-3xl lg:text-5xl font-bold lg:font-semibold text-center mb-10 lg:mb-20 ">
          My Edit
        </h2>
      </header>
      <div className="space-y-5 lg:space-y-10">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative w-full h-61 md:h-auto aspect-video rounded-xl overflow-hidden shadow-2xl cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${item.img.src})`,
                filter: "brightness(0.9) saturate(1.1)",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/10 via-black/10 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-1">
                      <h2 className="text-lg lg:text-3xl font-semibold mb-1 font-serif">
                        {item.title}
                      </h2>
                      <button className="text-white p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="white"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-heart-icon lucide-heart w-5 h-5 lg:w-6 lg:h-6"
                        >
                          <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center text-sm lg:text-lg gap-2 italic opacity-80">
                      {item.location}
                      <ArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show All Arrow */}

      <div className="mt-10 flex justify-center">
        <button className="p-3 rounded-full hover:bg-black/50 transition">
          <ChevronDown className="lg:w-10 lg:h-10" />
        </button>
      </div>
    </div>
  );
};

export default MyEdit;
