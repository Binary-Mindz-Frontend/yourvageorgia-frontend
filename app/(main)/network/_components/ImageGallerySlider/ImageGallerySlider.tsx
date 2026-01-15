import clsx from "clsx";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { memo, useCallback, useEffect, useState, useRef } from "react";

interface ImageGallerySliderProps {
  images: (string | StaticImageData)[];
}

const ImageGallerySlider = memo(({ images }: ImageGallerySliderProps) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);
  
  // Separate loading state for each image
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({ 0: true });
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  
  const preloadRefs = useRef<{ [key: number]: HTMLImageElement }>({});

  // Touch swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  // Preload adjacent images
  const preloadAdjacentImages = useCallback((currentIndex: number) => {
    const imagesToPreload = [
      currentIndex - 1 >= 0 ? currentIndex - 1 : images.length - 1,
      currentIndex + 1 < images.length ? currentIndex + 1 : 0,
    ];

    imagesToPreload.forEach((imgIndex) => {
      if (!preloadRefs.current[imgIndex] && !loadedImages.has(imgIndex)) {
        const img = new window.Image();
        img.src = typeof images[imgIndex] === 'string' 
          ? images[imgIndex] as string 
          : (images[imgIndex] as any).src;
        
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(imgIndex));
        };
        
        preloadRefs.current[imgIndex] = img;
      }
    });
  }, [images, loadedImages]);

  useEffect(() => {
    preloadAdjacentImages(index);
  }, [index, preloadAdjacentImages]);

  const changeSlide = useCallback((newIndex: number) => {
    setFade(true);
    
    // Set loading state for new image if not already loaded
    if (!loadedImages.has(newIndex)) {
      setLoadingStates(prev => ({ ...prev, [newIndex]: true }));
    }
    
    setTimeout(() => {
      setIndex(newIndex);
      setFade(false);
    }, 150);
  }, [loadedImages]);

  const prevSlide = useCallback(() => {
    const newIndex = index === 0 ? images.length - 1 : index - 1;
    changeSlide(newIndex);
  }, [index, images.length, changeSlide]);

  const nextSlide = useCallback(() => {
    const newIndex = index === images.length - 1 ? 0 : index + 1;
    changeSlide(newIndex);
  }, [index, images.length, changeSlide]);

  const openZoom = useCallback((idx: number) => {
    setZoomIndex(idx);
    setIsZoomed(true);
    setTimeout(() => setZoomVisible(true), 10);
  }, []);

  const closeZoom = useCallback(() => {
    setZoomVisible(false);
    setTimeout(() => setIsZoomed(false), 300);
  }, []);

  const prevZoomImage = useCallback(() => {
    const newIndex = zoomIndex === 0 ? images.length - 1 : zoomIndex - 1;
    setZoomIndex(newIndex);
  }, [zoomIndex, images.length]);

  const nextZoomImage = useCallback(() => {
    const newIndex = zoomIndex === images.length - 1 ? 0 : zoomIndex + 1;
    setZoomIndex(newIndex);
  }, [zoomIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) return;

      if (e.key === 'Escape') {
        closeZoom();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevZoomImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextZoomImage();
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
  }, [isZoomed, closeZoom, prevZoomImage, nextZoomImage]);

  // Reset on images change
  useEffect(() => {
    setIndex(0);
    setLoadingStates({ 0: true });
    setLoadedImages(new Set());
    preloadRefs.current = {};
  }, [images]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, nextSlide, prevSlide]);

  const handleZoomTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleZoomTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleZoomTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextZoomImage();
    } else if (isRightSwipe) {
      prevZoomImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, nextZoomImage, prevZoomImage]);

  const handleImageLoad = useCallback(() => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
    setLoadedImages(prev => new Set(prev).add(index));
  }, [index]);

  const isCurrentImageLoading = loadingStates[index] === true && !loadedImages.has(index);

  return (
    <div>
      {/* Main Image */}
      <div
        className="relative w-full h-60.5 lg:h-108.75 overflow-hidden rounded-xl bg-gray-900/10 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading Spinner - Always visible when loading */}
        {isCurrentImageLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/20">
            <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        <div
          className={clsx(
            "relative w-full h-full transition-opacity duration-150 ease-in-out",
            fade ? "opacity-0" : "opacity-100"
          )}
        >
          <Image
            src={images[index]}
            alt={`Gallery image ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={() => openZoom(index)}
            onLoad={handleImageLoad}
            priority={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            quality={85}
          />
        </div>

        {/* Mobile Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="rounded-full cursor-pointer hover:bg-white/20 transition-all duration-200 ease-in-out absolute left-3 top-1/2 -translate-y-1/2 lg:hidden z-20 bg-black/30 p-1"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={nextSlide}
              className="rounded-full cursor-pointer hover:bg-white/20 transition-all duration-200 ease-in-out absolute right-3 top-1/2 -translate-y-1/2 lg:hidden z-20 bg-black/30 p-1"
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
            {index + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Desktop Controls */}
      {images.length > 1 && (
        <div className="hidden lg:flex justify-between items-center mt-3 px-1">
          <button
            onClick={prevSlide}
            className="pt-2 rounded-full cursor-pointer hover:bg-white/10 transition-all duration-200 ease-in-out p-1"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="pt-2 rounded-full cursor-pointer hover:bg-white/10 transition-all duration-200 ease-in-out p-1"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Thumbnails - Fixed sizes prop */}
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
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
                quality={50}
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal - Fixed aspect ratio warning */}
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
              "relative transition-all duration-300 ease-in-out transform touch-pan-y",
              zoomVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            )}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleZoomTouchStart}
            onTouchMove={handleZoomTouchMove}
            onTouchEnd={handleZoomTouchEnd}
          >
            <button
              onClick={closeZoom}
              className="absolute -top-12 right-0 text-white text-3xl cursor-pointer hover:bg-white/20 rounded-full p-2 transition-all duration-200 ease-in-out z-30"
              aria-label="Close zoom"
            >
              <X className="w-8 h-8" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevZoomImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white cursor-pointer hover:bg-white/20 rounded-full p-3 transition-all duration-200 ease-in-out z-30"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextZoomImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer hover:bg-white/20 rounded-full p-3 transition-all duration-200 ease-in-out z-30"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full z-30">
                  {zoomIndex + 1} / {images.length}
                </div>
              </>
            )}

            <div className="relative w-full max-w-[90vw] max-h-[80vh]">
              <Image
                src={images[zoomIndex]}
                alt={`Zoomed gallery image ${zoomIndex + 1}`}
                width={1200}
                height={800}
                sizes="90vw"
                className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg"
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ImageGallerySlider.displayName = 'ImageGallerySlider';

export default ImageGallerySlider;