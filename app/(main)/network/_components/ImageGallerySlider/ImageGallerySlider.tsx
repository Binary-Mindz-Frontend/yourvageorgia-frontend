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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Touch tracking refs (for performance)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentTranslateRef = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Element Refs for direct manipulation
  const trackRef = useRef<HTMLDivElement>(null);
  const prevSlideRef = useRef<HTMLDivElement>(null);
  const currSlideRef = useRef<HTMLDivElement>(null);
  const nextSlideRef = useRef<HTMLDivElement>(null);

  // Refs
  const preloadedRef = useRef<Set<string>>(new Set());
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Simulated progress bar for all networks (consistent UX)
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      loadingTimerRef.current = setInterval(() => {
        setLoadingProgress(prev => {
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
  }, [isLoading]);

  const minSwipeDistance = 50;

  // Preload logic (kept same as before)
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

  useEffect(() => {
    if (images.length <= 1) return;
    const nextIdx = (index + 1) % images.length;
    preloadImage(images[nextIdx]);
    if (!isMobile) {
      const prevIdx = (index - 1 + images.length) % images.length;
      preloadImage(images[prevIdx]);
    }
  }, [index, images, preloadImage, isMobile]);

  useEffect(() => {
    const count = Math.min(images.length, isMobile ? 1 : 3);
    for (let i = 0; i < count; i++) {
      preloadImage(images[i]);
    }
  }, [images, preloadImage, isMobile]);


  // Helper to trigger slide animation
  // Helper to trigger slide animation
  const animateToSlide = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || !trackRef.current) return;
    const width = trackRef.current.clientWidth;
    const targetOffset = direction === 'next' ? -width : width;

    setIsAnimating(true);

    // Apply Main Track Animation
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 300ms ease-out';
      trackRef.current.style.transform = `translateX(${targetOffset}px)`;
    }

    // Apply Parallax Animation
    const parallaxTarget = targetOffset * 0.3;
    [prevSlideRef.current, currSlideRef.current, nextSlideRef.current].forEach(el => {
      if (el) {
        el.style.transition = 'transform 300ms ease-out';
        el.style.transform = `translateX(${parallaxTarget}px)`;
      }
    });

    setTimeout(() => {
      setIndex((prev) => {
        if (direction === 'next') return prev === images.length - 1 ? 0 : prev + 1;
        return prev === 0 ? images.length - 1 : prev - 1;
      });
      setIsAnimating(false);

      // Reset styles
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform = 'translateX(0px)';
      }
      [prevSlideRef.current, currSlideRef.current, nextSlideRef.current].forEach(el => {
        if (el) {
          el.style.transition = 'none';
          el.style.transform = 'translateX(0px)';
        }
      });
      currentTranslateRef.current = 0;
    }, 300);
  }, [isAnimating, images.length]);

  const changeSlide = useCallback((newIndex: number) => {
    setIsLoading(true);
    setIndex(newIndex);
  }, []);

  const prevSlide = useCallback(() => {
    animateToSlide('prev');
  }, [animateToSlide]);

  const nextSlide = useCallback(() => {
    animateToSlide('next');
  }, [animateToSlide]);


  // Zoom methods
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

  // Fullscreen
  const enterFullscreen = useCallback(async () => {
    const el = fullscreenRef.current;
    if (!el) return;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) await (el as any).webkitRequestFullscreen();
      try {
        const orientation = (screen as any).orientation;
        if (orientation?.lock) await orientation.lock('landscape');
      } catch { }
      setIsFullscreen(true);
    } catch {
      openZoom(index);
    }
  }, [index, openZoom]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if ((document as any).webkitFullscreenElement) await (document as any).webkitExitFullscreen();
    } catch { }
    try {
      const orientation = (screen as any).orientation;
      if (orientation?.unlock) orientation.unlock();
    } catch { }
    setIsFullscreen(false);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        setIsFullscreen(false);
        try {
          const orientation = (screen as any).orientation;
          if (orientation?.unlock) orientation.unlock();
        } catch { }
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') exitFullscreen();
        else if (e.key === 'ArrowLeft') prevSlide();
        else if (e.key === 'ArrowRight') nextSlide();
        return;
      }
      if (!isZoomed) return;
      if (e.key === 'Escape') closeZoom();
      else if (e.key === 'ArrowLeft') prevZoomImage();
      else if (e.key === 'ArrowRight') nextZoomImage();
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

  // Reset
  useEffect(() => {
    setIndex(0);
    setIsLoading(true);
    preloadedRef.current.clear();
  }, [images]);


  // Unified Pointer (Touch + Mouse) Tracking Logic using Refs for 60fps performance
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isAnimating) return;
    if (e.button !== 0) return;

    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    currentTranslateRef.current = 0;

    // Use fast direct DOM manipulation
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.classList.add('cursor-grabbing');
      trackRef.current.classList.remove('cursor-grab');
    }

    // Reset parallax transitions
    [prevSlideRef.current, currSlideRef.current, nextSlideRef.current].forEach(el => {
      if (el) el.style.transition = 'none';
    });

    (e.target as Element).setPointerCapture(e.pointerId);
  }, [isAnimating]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current || startXRef.current === null) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    currentTranslateRef.current = diff;

    // Direct DOM update - Bypass React Render Cycle
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${diff}px)`;
    }

    // Parallax Direct Update
    const parallax = diff * 0.3;
    if (prevSlideRef.current) prevSlideRef.current.style.transform = `translateX(${parallax}px)`;
    if (currSlideRef.current) currSlideRef.current.style.transform = `translateX(${parallax}px)`;
    if (nextSlideRef.current) nextSlideRef.current.style.transform = `translateX(${parallax}px)`;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    isDraggingRef.current = false;
    startXRef.current = 0;

    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch { }

    if (trackRef.current) {
      trackRef.current.classList.remove('cursor-grabbing');
      trackRef.current.classList.add('cursor-grab');
    }

    const width = trackRef.current.clientWidth;
    const dragDist = currentTranslateRef.current;

    // Improved Threshold: 50px velocity-like feel or 25% width
    const threshold = Math.min(width * 0.25, 50);

    let targetOffset = 0;
    let newIndex = index;

    if (dragDist > threshold) {
      targetOffset = width;
      newIndex = index === 0 ? images.length - 1 : index - 1;
    } else if (dragDist < -threshold) {
      targetOffset = -width;
      newIndex = index === images.length - 1 ? 0 : index + 1;
    }

    // Animate to target
    setIsAnimating(true);

    // Apply transitions for smooth snap
    trackRef.current.style.transition = 'transform 300ms ease-out';
    trackRef.current.style.transform = `translateX(${targetOffset}px)`;

    // Apply parallax snap
    const parallaxTarget = targetOffset * 0.3;
    [prevSlideRef.current, currSlideRef.current, nextSlideRef.current].forEach(el => {
      if (el) {
        el.style.transition = 'transform 300ms ease-out';
        el.style.transform = `translateX(${parallaxTarget}px)`;
      }
    });

    // Wait for animation to finish, then silent swap
    setTimeout(() => {
      if (newIndex !== index) {
        setIndex(newIndex);
      }
      setIsAnimating(false);

      // Reset styles silently
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform = 'translateX(0px)';
      }
      [prevSlideRef.current, currSlideRef.current, nextSlideRef.current].forEach(el => {
        if (el) {
          el.style.transition = 'none';
          el.style.transform = 'translateX(0px)';
        }
      });
      currentTranslateRef.current = 0;
    }, 300);
  }, [index, images.length]);

  // Loading Overlay
  const LoadingOverlay = useMemo(() => {
    if (!isLoading) return null;
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
        <div className="z-20 flex flex-col items-center gap-2">
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/40 rounded-full transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }} />
          </div>
          <span className="text-white/40 text-xs">Loading image...</span>
        </div>
      </div>
    );
  }, [isLoading, loadingProgress]);

  // Carousel Indices
  const prevIndex = (index - 1 + images.length) % images.length;
  const nextIndex = (index + 1) % images.length;

  return (
    <div ref={fullscreenRef} className={clsx(isFullscreen && "bg-black")}>
      {/* Fullscreen Landscape Viewer */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <button
            onClick={exitFullscreen}
            className="absolute top-4 right-4 z-[110] text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-all"
          >
            <Minimize2 className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full">
            <Image
              src={images[index]}
              alt="Gallery fullscreen"
              fill
              sizes="100vw"
              className="object-contain pointer-events-none"
              priority
              quality={getQuality(80)}
              decoding="async"
            />
          </div>

          <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 z-[110] bg-black/40 rounded-full p-2">
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>
          <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 z-[110] bg-black/40 rounded-full p-2">
            <ChevronRight className="w-7 h-7 text-white" />
          </button>
        </div>
      )}

      {/* Main Image Container */}
      <div
        className="relative w-full h-60.5 lg:h-108.75 overflow-hidden rounded-xl bg-gray-900/10 touch-none select-none cursor-grab"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {LoadingOverlay}

        {/* 3-Panel Carousel Track */}
        <div
          ref={trackRef}
          className="container-track w-full h-full absolute inset-0 will-change-transform"
          style={{ transform: 'translateX(0px)' }}
        >
          {/* Prevent duplicating logic for simple 1-image case */}
          {images.length === 1 ? (
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={images[0]}
                alt="Gallery"
                fill
                className="object-cover pointer-events-none"
                priority
                quality={getQuality(isMobile ? 60 : 75)}
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
              />
            </div>
          ) : (
            <>
              {/* Prev Slide (-100%) */}
              <div
                ref={prevSlideRef}
                className="absolute top-0 left-0 w-full h-full -translate-x-full will-change-transform"
                aria-hidden="true"
              >
                <Image
                  src={images[prevIndex]}
                  alt="Previous"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
                  className="object-cover pointer-events-none"
                  quality={getQuality(isMobile ? 60 : 75)}
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Current Slide (0%) */}
              <div
                ref={currSlideRef}
                className="absolute top-0 left-0 w-full h-full will-change-transform"
              >
                <Image
                  src={images[index]}
                  alt="Gallery"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
                  className="object-cover"
                  draggable={false}
                  onClick={() => !isDraggingRef.current && (isMobile ? enterFullscreen() : openZoom(index))}
                  onLoad={() => setIsLoading(false)}
                  priority
                  quality={getQuality(isMobile ? 60 : 75)}
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  decoding="async"
                />
              </div>

              {/* Next Slide (100%) */}
              <div
                ref={nextSlideRef}
                className="absolute top-0 left-0 w-full h-full translate-x-full will-change-transform"
                aria-hidden="true"
              >
                <Image
                  src={images[nextIndex]}
                  alt="Next"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
                  className="object-cover pointer-events-none"
                  quality={getQuality(isMobile ? 60 : 75)}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </>
          )}
        </div>

        {/* ... controls ... */}
        <button
          onClick={enterFullscreen}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 z-30 lg:hidden bg-black/40 rounded-full p-2 active:scale-95 pointer-events-auto"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </button>

        {/* ... arrows ... */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 rounded-full p-1 lg:hidden pointer-events-auto"
            >
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <button
              onClick={nextSlide}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 rounded-full p-1 lg:hidden pointer-events-auto"
            >
              <ChevronRight className="w-7 h-7 text-white" />
            </button>
          </>
        )}

        {/* ... dots ... */}
        {images.length > 1 && (
          <>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm hidden lg:block pointer-events-none">
              {index + 1} / {images.length}
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden z-20 pointer-events-auto">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); changeSlide(i); }}
                  className={clsx("rounded-full transition-all", i === index ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40")}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop Controls (Arrows & Thumbnails) */}
      {images.length > 1 && (
        <>
          <div className="hidden lg:flex justify-between items-center mt-3 px-1">
            <button onClick={prevSlide} className="pt-2 rounded-full cursor-pointer hover:bg-white/10 p-1">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="pt-2 rounded-full cursor-pointer hover:bg-white/10 p-1">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          {/* Scrollable Thumbnails */}
          <div className="hidden lg:flex gap-2 mt-4 overflow-x-auto snap-x scrollbar-hide py-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => changeSlide(i)}
                className={clsx(
                  "relative w-16 h-16 shrink-0 rounded-md overflow-hidden transition-all duration-200 snap-start",
                  i === index ? "ring-2 ring-white opacity-100 scale-105" : "opacity-60 hover:opacity-100 hover:scale-105"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="64px" quality={40} draggable={false} />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Zoom Modal - Kept same */}
      {isZoomed && (
        <div
          className={clsx("fixed inset-0 flex justify-center items-center z-50 transition-all duration-300", zoomVisible ? "bg-black/95" : "bg-black/0")}
          onClick={closeZoom}
        >
          <div className={clsx("relative transition-all duration-300 transform", zoomVisible ? "scale-100 opacity-100" : "scale-95 opacity-0")} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeZoom} className="absolute -top-12 right-0 text-white text-3xl"><X className="w-8 h-8" /></button>
            <button onClick={prevZoomImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3"><ChevronLeft className="w-8 h-8" /></button>
            <button onClick={nextZoomImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3"><ChevronRight className="w-8 h-8" /></button>
            <Image src={images[zoomIndex]} alt="" width={1200} height={800} className="object-contain max-w-[90vw] max-h-[80vh] rounded-lg" priority />
          </div>
        </div>
      )}
    </div>
  );
});
ImageGallerySlider.displayName = 'ImageGallerySlider';

export default ImageGallerySlider;