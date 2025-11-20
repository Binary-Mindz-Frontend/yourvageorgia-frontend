import { Button } from "@/components/ui/button";
import bannerImg from "@/public/assets/home/banner.svg";
import Image from "next/image";
import Link from "next/link";
export default function WellnessHero() {
  return (
    <section className="pt-10 md:pt-14 lg:pt-16 px-4 md:px-0">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 items-center">
        {/* Image comes first on mobile */}
        <div className="relative w-full h-59 sm:h-96 md:h-112 lg:h-125 overflow-hidden order-1">
          <Image
            src={bannerImg}
            alt="Infrared sauna wellness therapy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text comes second on mobile */}
        <div className="space-y-6 lg:space-y-8 lg:pr-8 text-center order-2 lg:order-0">
          <h1 className="text-white text-2xl md:text-3xl lg:text-5xl font-semibold font-serif leading-tight">
            A lifestyle membership redefining how women experience wellness in
            Dubai.
          </h1>

          <div className="flex sm:flex-row justify-center gap-4 sm:gap-6">
            <Link href="/become-member">
              <Button
                variant={"outline"}
                className="cursor-pointer py-3 rounded-full  sm:w-auto text-sm lg:text-base tracking-wide px-6"
              >
                Become a member
              </Button>
            </Link>
            <Link href="/partnership">
              <Button
                variant={"outline"}
                className="cursor-pointer py-3 rounded-full sm:w-auto text-sm lg:text-base tracking-wide px-6"
              >
                Partner with us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
