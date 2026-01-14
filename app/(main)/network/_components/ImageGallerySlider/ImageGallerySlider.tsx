import clsx from "clsx";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

interface ImageGallerySliderProps {
  images: (string | StaticImageData)[];
}

export default function ImageGallerySlider({ images }: ImageGallerySliderProps) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const changeSlide = (newIndex: number) => {
    setFade(true);

    setTimeout(() => {
      setIndex(newIndex);
      setFade(false);
      setIsLoading(true); // Reset loading state for new image
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

  const openZoom = (index: number) => {
    setZoomIndex(index);
    setIsZoomed(true);
    // Use setTimeout to ensure DOM is updated before triggering animation
    setTimeout(() => {
      setZoomVisible(true);
    }, 10);
  };

  const closeZoom = () => {
    setZoomVisible(false);
    // Wait for fade-out animation to complete before removing from DOM
    setTimeout(() => {
      setIsZoomed(false);
    }, 300);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === 'Escape') {
          closeZoom();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const newIndex = zoomIndex === 0 ? images.length - 1 : zoomIndex - 1;
          setZoomIndex(newIndex);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const newIndex = zoomIndex === images.length - 1 ? 0 : zoomIndex + 1;
          setZoomIndex(newIndex);
        }
      }
    };

    if (isZoomed) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomed, zoomIndex, images.length]);

  // Reset when images change
  useEffect(() => {
    setIndex(0);
    setIsLoading(true);
  }, [images]);

  return (
    <div>
      {/* IMAGE VIEW */}
      <div className="relative w-full h-60.5 lg:h-108.75 overflow-hidden rounded-xl bg-gray-900/10">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <div
          className={clsx(
            "relative w-full h-full transition-opacity duration-300 ease-in-out",
            fade ? "opacity-0" : "opacity-100"
          )}
        >
          <Image
            src={images[index]}

            alt="Gallery"
            id="gallery-main-image"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={() => openZoom(index)}
            onLoad={() => setIsLoading(false)}
            preload={true}
            loading="eager"
          />
        </div>

        {/* Mobile Arrows */}
        <button
          onClick={prevSlide}
          className="rounded-full cursor-pointer hover:bg-white/20 transition-all duration-200 ease-in-out absolute left-3 top-1/2 -translate-y-1/2 lg:static lg:hidden z-20 bg-black/30 p-1"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button
          onClick={nextSlide}
          className="rounded-full cursor-pointer hover:bg-white/20 transition-all duration-200 ease-in-out absolute right-3 top-1/2 -translate-y-1/2 lg:static lg:hidden z-20 bg-black/30 p-1"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {index + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Desktop Arrows */}
      <div className="hidden lg:flex justify-between items-center mt-3 px-1">
        <button
          onClick={prevSlide}
          className="pt-2 rounded-full cursor-pointer hover:bg-white/10 transition-all duration-200 ease-in-out p-1"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="pt-2 rounded-full cursor-pointer hover:bg-white/10 transition-all duration-200 ease-in-out p-1"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails (optional) */}
      {images.length > 1 && (
        <div className="hidden lg:flex gap-2 mt-4 justify-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => changeSlide(i)}
              className={clsx(
                "relative w-16 h-16 rounded-md overflow-hidden transition-all duration-200 ease-in-out",
                i === index ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
              )}
            >
              <Image

                src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                preload={true}
                loading="eager"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className={clsx(
            "fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 ease-in-out",
            zoomVisible ? "bg-black bg-opacity-95" : "bg-black bg-opacity-0"
          )}
          onClick={closeZoom}
        >
          <div
            className={clsx(
              "relative transition-all duration-300 ease-in-out transform",
              zoomVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            )}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
          >
            <button
              onClick={closeZoom}
              className="absolute -top-12 right-0 text-white text-3xl cursor-pointer hover:bg-white/20 rounded-full p-2 transition-all duration-200 ease-in-out"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Zoomed image navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = zoomIndex === 0 ? images.length - 1 : zoomIndex - 1;
                    setZoomIndex(newIndex);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white cursor-pointer hover:bg-white/20 rounded-full p-3 transition-all duration-200 ease-in-out"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = zoomIndex === images.length - 1 ? 0 : zoomIndex + 1;
                    setZoomIndex(newIndex);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer hover:bg-white/20 rounded-full p-3 transition-all duration-200 ease-in-out"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                  {zoomIndex + 1} / {images.length}
                </div>
              </>
            )}

            <Image

              src={images[zoomIndex]}
              alt="Zoomed Gallery"
              width={1200}
              height={800}
              className="object-contain max-w-[90vw] max-h-[80vh] rounded-lg"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}