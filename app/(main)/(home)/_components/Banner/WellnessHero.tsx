import bannerImg from "@/assets/home/banner.svg"
import Image from "next/image";
export default function WellnessHero() {
  return (
    <section className="bg-black min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Content Area */}
        <div className="space-y-8 lg:pr-8">
          <h1 className="text-white lg:text-5xl  font-serif leading-tight">
            A lifestyle membership redefining how women experience wellness in Dubai.
          </h1>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3.5 bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 text-base font-light tracking-wide">
              Become a member
            </button>
            <button className="px-8 py-3.5 bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 text-base font-light tracking-wide">
              Partner with us
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
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