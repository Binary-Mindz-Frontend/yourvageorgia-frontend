
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface ImageGallerySliderProps {
  images: (string | StaticImageData)[];
}

export default function ImageGallerySlider({ images }: ImageGallerySliderProps) {
  // console.log(images)
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const changeSlide = (newIndex: number) => {
    setFade(true);

    setTimeout(() => {
      setIndex(newIndex);
      setFade(false);
    }, 180);
  };

  const prevSlide = () => {
    const newIndex = index === 0 ? images.length - 1 : index - 1;
    changeSlide(newIndex);
  };

  const nextSlide = () => {
    const newIndex = index === images.length - 1 ? 0 : index + 1;
    changeSlide(newIndex);
  };

  return (
    <div>
      {/* IMAGE VIEW */}
      <div className="relative w-full h-[242px] lg:h-[435px] overflow-hidden rounded-xl">
        <div
          className={clsx(
            "relative w-full h-full transition-opacity duration-300",
            fade ? "opacity-0" : "opacity-100"
          )}
        >
          <Image
            src={images[index]}
            alt="Gallery"
            fill
            className="object-cover"
          />
        </div>

        {/* Mobile Arrows */}
        <button
          onClick={prevSlide}
          className="rounded-full cursor-pointer hover:bg-white/20 transition absolute left-3 top-1/2 -translate-y-1/2 lg:static lg:hidden z-20"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button
          onClick={nextSlide}
          className="rounded-full cursor-pointer hover:bg-white/20 transition absolute right-3 top-1/2 -translate-y-1/2 lg:static lg:hidden z-20"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Desktop Arrows */}
      <div className="hidden lg:flex justify-between items-center mt-3 px-1">
        <button onClick={prevSlide} className="pt-2 rounded-full cursor-pointer">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="pt-2 rounded-full cursor-pointer">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
