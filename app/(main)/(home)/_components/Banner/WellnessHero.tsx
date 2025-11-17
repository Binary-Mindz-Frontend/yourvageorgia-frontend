import bannerImg from "@/assets/home/banner.svg";
import Image from "next/image";
export default function WellnessHero() {
  return (
    <section className="pt-10 md:pt-14 lg:pt-16 px-4 md:px-0">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
        {/* Left Content */}
        <div className="space-y-6 lg:space-y-8 lg:pr-8 text-center">
          <h1 className="text-white text-2xl md:text-3xl lg:text-5xl font-semibold font-serif leading-tight">
            A lifestyle membership redefining how women experience wellness in
            Dubai.
          </h1>

          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-4 sm:gap-6">
            <button className="px-8 py-3 w-full sm:w-auto bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 text-base font-light tracking-wide">
              Become a member
            </button>

            <button className="px-8 py-3 w-full sm:w-auto bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 text-base font-light tracking-wide">
              Partner with us
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-80 sm:h-96 md:h-112 lg:h-125 overflow-hidden">
          <Image
            src={bannerImg}
            alt="Infrared sauna wellness therapy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
