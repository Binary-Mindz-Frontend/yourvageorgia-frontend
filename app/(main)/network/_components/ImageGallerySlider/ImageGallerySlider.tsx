import clsx from "clsx";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ImageGallerySliderProps {
  images: (string | StaticImageData)[];
}

// Tiny dark SVG placeholder for blur effect
const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+";

const ImageGallerySlider = memo(({ images }: ImageGallerySliderProps) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Refs
  const preloadedRef = useRef<Set<string>>(new Set());
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check for slow connection (2g/3g)
  const connectionType = useMemo(() => {
    if (typeof navigator === 'undefined') return 'fast';
    const conn = (navigator as any).connection;
    if (!conn) return 'fast';
    if (conn.saveData || ['slow-2g', '2g'].includes(conn.effectiveType)) return 'slow';
    if (conn.effectiveType === '3g') return '3g';
    return 'fast';
  }, []);

  const isSlowConnection = connectionType === 'slow';

  // Get adaptive quality based on connection
  const getQuality = useCallback((base: number) => {
    if (connectionType === 'slow') return Math.max(base - 30, 30);
    if (connectionType === '3g') return Math.max(base - 15, 40);
    return base;
  }, [connectionType]);

  // Simulated progress bar for slow networks
  useEffect(() => {
    if (isLoading && (connectionType === '3g' || connectionType === 'slow')) {
      setLoadingProgress(0);
      loadingTimerRef.current = setInterval(() => {
        setLoadingProgress(prev => {
          // Asymptotically approach 90% — never hits 100% until actually loaded
          if (prev >= 90) return prev;
          return prev + (90 - prev) * 0.08;
        });
      }, 100);
    } else {
      setLoadingProgress(100);
      if (loadingTimerRef.current) {
        clearInterval(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    }
    return () => {
      if (loadingTimerRef.current) {
        clearInterval(loadingTimerRef.current);
      }
    };
  }, [isLoading, connectionType]);

  // Touch swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Preload via Next.js optimizer
  const preloadImage = useCallback((src: string | StaticImageData) => {
    if (isSlowConnection) return;
    const url = typeof src === "string" ? src : (src as StaticImageData).src;
    if (!url || preloadedRef.current.has(url)) return;
    preloadedRef.current.add(url);

    const doPreload = () => {
      const width = isMobile ? 640 : 828;
      const quality = getQuality(isMobile ? 60 : 75);
      const optimizedUrl = `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
      const img = new window.Image();
      img.fetchPriority = 'low';
      img.src = optimizedUrl;
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(doPreload, { timeout: 500 });
    } else {
      setTimeout(doPreload, 200);
    }
  }, [isSlowConnection, isMobile, getQuality]);

  // Preload adjacent
  useEffect(() => {
    if (images.length <= 1) return;
    const nextIdx = (index + 1) % images.length;
    preloadImage(images[nextIdx]);
    if (!isMobile) {
      const prevIdx = (index - 1 + images.length) % images.length;
      preloadImage(images[prevIdx]);
    }
  }, [index, images, preloadImage, isMobile]);

  // Initial preload
  useEffect(() => {
    const count = Math.min(images.length, isMobile ? 1 : 3);
    for (let i = 0; i < count; i++) {
      preloadImage(images[i]);
    }
  }, [images, preloadImage, isMobile]);

  const changeSlide = useCallback((newIndex: number, direction?: 'left' | 'right') => {
    setSlideDirection(direction || (newIndex > index ? 'left' : 'right'));
    setFade(true);
    setIsLoading(true);
    setTimeout(() => {
      setIndex(newIndex);
      setFade(false);
      setSlideDirection(null);
    }, 120);
  }, [index]);

  const prevSlide = useCallback(() => {
    const newIndex = index === 0 ? images.length - 1 : index - 1;
    changeSlide(newIndex, 'right');
  }, [index, images.length, changeSlide]);

  const nextSlide = useCallback(() => {
    const newIndex = index === images.length - 1 ? 0 : index + 1;
    changeSlide(newIndex, 'left');
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
    setZoomIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  }, [images.length]);

  const nextZoomImage = useCallback(() => {
    setZoomIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  }, [images.length]);

  // Fullscreen landscape viewer
  const enterFullscreen = useCallback(async () => {
    const el = fullscreenRef.current;
    if (!el) return;

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        await (el as any).webkitRequestFullscreen();
      }

      // Try to lock to landscape on mobile
      try {
        const orientation = (screen as any).orientation;
        if (orientation?.lock) {
          await orientation.lock('landscape');
        }
      } catch {
        // Orientation lock may not be supported — that's fine
      }

      setIsFullscreen(true);
    } catch {
      // Fullscreen may be blocked — fall back to zoom
      openZoom(index);
    }
  }, [index, openZoom]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if ((document as any).webkitFullscreenElement) {
        await (document as any).webkitExitFullscreen();
      }
    } catch {
      // ignore
    }

    // Unlock orientation
    try {
      const orientation = (screen as any).orientation;
      if (orientation?.unlock) {
        orientation.unlock();
      }
    } catch {
      // ignore
    }

    setIsFullscreen(false);
  }, []);

  // Listen for fullscreen exit (e.g., swipe down, back button)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        setIsFullscreen(false);
        try {
          const orientation = (screen as any).orientation;
          if (orientation?.unlock) orientation.unlock();
        } catch { /* ignore */ }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') {
          exitFullscreen();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
        }
        return;
      }

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

    if (isZoomed || isFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomed, isFullscreen, closeZoom, exitFullscreen, prevZoomImage, nextZoomImage, prevSlide, nextSlide]);

  // Reset on images change
  useEffect(() => {
    setIndex(0);
    setIsLoading(true);
    preloadedRef.current.clear();
  }, [images]);

  // Touch handlers for main slider
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
    if (distance > minSwipeDistance) nextSlide();
    else if (distance < -minSwipeDistance) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, minSwipeDistance, nextSlide, prevSlide]);

  // Touch handlers for zoom modal
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
    if (distance > minSwipeDistance) nextZoomImage();
    else if (distance < -minSwipeDistance) prevZoomImage();
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, minSwipeDistance, nextZoomImage, prevZoomImage]);

  // Loading indicator component — adapts to connection speed
  const LoadingOverlay = useMemo(() => {
    if (!isLoading) return null;

    const showProgress = connectionType === '3g' || connectionType === 'slow';

    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        {/* Gradient shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />

        {showProgress && (
          <div className="z-20 flex flex-col items-center gap-2">
            {/* Progress bar */}
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/40 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-white/40 text-xs">Loading image...</span>
          </div>
        )}
      </div>
    );
  }, [isLoading, connectionType, loadingProgress]);

  return (
    <div ref={fullscreenRef} className={clsx(isFullscreen && "bg-black")}>
      {/* Fullscreen Landscape Viewer */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Exit fullscreen button */}
          <button
            onClick={exitFullscreen}
            className="absolute top-4 right-4 z-[110] text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-all"
            aria-label="Exit fullscreen"
          >
            <Minimize2 className="w-6 h-6" />
          </button>

          {/* Fullscreen image */}
          <div className="relative w-full h-full">
            <Image
              src={images[index]}
              alt="Gallery fullscreen"
              fill
              sizes="100vw"
              className="object-contain"
              priority
              quality={getQuality(80)}
              decoding="async"
            />
          </div>

          {/* Fullscreen navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-[110] bg-black/40 rounded-full p-2 hover:bg-white/20 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-7 h-7 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-[110] bg-black/40 rounded-full p-2 hover:bg-white/20 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-7 h-7 text-white" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[110] flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => changeSlide(i)}
                    className={clsx(
                      "rounded-full transition-all duration-200",
                      i === index
                        ? "w-6 h-2 bg-white"
                        : "w-2 h-2 bg-white/40 hover:bg-white/60"
                    )}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Image */}
      <div
        className="relative w-full h-60.5 lg:h-108.75 overflow-hidden rounded-xl bg-gray-900/10 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {LoadingOverlay}
        <div
          className={clsx(
            "relative w-full h-full ease-in-out",
            isMobile
              ? "transition-transform duration-200"
              : "transition-opacity duration-200",
            fade && isMobile && slideDirection === 'left' && "-translate-x-full",
            fade && isMobile && slideDirection === 'right' && "translate-x-full",
            !fade && isMobile && "translate-x-0",
            fade && !isMobile && "opacity-0",
            !fade && !isMobile && "opacity-100"
          )}
          style={{ willChange: 'transform, opacity' }}
        >
          <Image
            src={images[index]}
            alt="Gallery"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={() => isMobile ? enterFullscreen() : openZoom(index)}
            onLoad={() => setIsLoading(false)}
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            quality={getQuality(isMobile ? 60 : 75)}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            decoding="async"
          />
        </div>

        {/* Hidden preload — desktop only */}
        {images.length > 1 && !isMobile && !isSlowConnection && (
          <div className="hidden" aria-hidden="true">
            <Image
              src={images[(index + 1) % images.length]}
              alt=""
              width={1}
              height={1}
              quality={getQuality(75)}
              loading="eager"
            />
          </div>
        )}

        {/* Fullscreen button — mobile */}
        <button
          onClick={enterFullscreen}
          className="absolute top-3 right-3 z-20 lg:hidden bg-black/40 rounded-full p-2 hover:bg-white/20 transition-all active:scale-95"
          aria-label="View fullscreen"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </button>

        {/* Navigation arrows — mobile */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="rounded-full cursor-pointer hover:bg-white/20 transition-all duration-200 ease-in-out absolute left-3 top-1/2 -translate-y-1/2 lg:hidden z-20 bg-black/30 p-1 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={nextSlide}
              className="rounded-full cursor-pointer hover:bg-white/20 transition-all duration-200 ease-in-out absolute right-3 top-1/2 -translate-y-1/2 lg:hidden z-20 bg-black/30 p-1 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </>
        )}

        {/* Image counter + dot indicators on mobile */}
        {images.length > 1 && (
          <>
            {/* Desktop: text counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm hidden lg:block">
              {index + 1} / {images.length}
            </div>

            {/* Mobile: dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => changeSlide(i)}
                  className={clsx(
                    "rounded-full transition-all duration-200",
                    i === index
                      ? "w-5 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/40"
                  )}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
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

      {/* Thumbnails — desktop only */}
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
                className="object-cover"
                loading="lazy"
                quality={40}
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal — desktop */}
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
              className="absolute -top-12 right-0 text-white text-3xl cursor-pointer hover:bg-white/20 rounded-full p-2 transition-all duration-200 ease-in-out"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white cursor-pointer hover:bg-white/20 rounded-full p-3 transition-all duration-200 ease-in-out"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextZoomImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer hover:bg-white/20 rounded-full p-3 transition-all duration-200 ease-in-out"
                  aria-label="Next image"
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
              width={isMobile ? 600 : 1200}
              height={isMobile ? 400 : 800}
              sizes={isMobile ? "95vw" : "90vw"}
              className="object-contain max-w-[90vw] max-h-[80vh] rounded-lg"
              priority
              quality={getQuality(isMobile ? 70 : 85)}
            />
          </div>
        </div>
      )}
    </div>
  );
});

ImageGallerySlider.displayName = 'ImageGallerySlider';

export default ImageGallerySlider;