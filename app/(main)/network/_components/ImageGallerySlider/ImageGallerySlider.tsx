import clsx from "clsx";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ZoomModal from "./ZoomModal";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // NEW: Smart loading states
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [imageLoadStates, setImageLoadStates] = useState<Map<number, boolean>>(new Map());
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // NEW: Real-time speed detection
  const [actualSpeed, setActualSpeed] = useState<'fast' | 'medium' | 'slow'>('fast');
  const loadTimeRef = useRef<number[]>([]);

  // Touch tracking refs (for performance)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentTranslateRef = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Element Refs for direct manipulation
  const trackRef = useRef<HTMLDivElement>(null);

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

  // Check for slow connection (2g/3g) + real-time speed tracking
  const connectionType = useMemo(() => {
    if (typeof navigator === 'undefined') return 'fast';
    const conn = (navigator as any).connection;
    if (!conn) return 'fast';
    if (conn.saveData || ['slow-2g', '2g'].includes(conn.effectiveType)) return 'slow';
    if (conn.effectiveType === '3g') return '3g';
    return 'fast';
  }, []);

  // Real-time speed detection based on actual image load times
  useEffect(() => {
    if (loadTimeRef.current.length < 2) return;
    
    // Calculate average load time from last 3 images
    const recentTimes = loadTimeRef.current.slice(-3);
    const avgTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;
    
    // Classify speed based on actual performance
    if (avgTime > 3000) {
      setActualSpeed('slow');
    } else if (avgTime > 1500) {
      setActualSpeed('medium');
    } else {
      setActualSpeed('fast');
    }
  }, [loadTimeRef.current.length]);

  // Combined slow check: either API says slow OR actual speed is slow
  const isSlowConnection = connectionType === 'slow' || actualSpeed === 'slow';
  const shouldWaitForLoad = actualSpeed === 'slow' || actualSpeed === 'medium' || connectionType === 'slow' || connectionType === '3g';

  // Simulated progress bar for all networks (consistent UX)
  useEffect(() => {
    if (isLoading || pendingIndex !== null) {
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
  }, [isLoading, pendingIndex]);

  // NEW: Preload with callback for smart navigation
  const preloadImageWithCallback = useCallback((src: string | StaticImageData, targetIndex: number, onComplete: () => void) => {
    const url = typeof src === "string" ? src : (src as StaticImageData).src;
    if (!url) {
      onComplete();
      return;
    }

    // Check if already loaded
    if (imageLoadStates.get(targetIndex)) {
      onComplete();
      return;
    }

    const img = new window.Image();
    img.fetchPriority = 'high';
    
    img.onload = () => {
      setImageLoadStates(prev => new Map(prev).set(targetIndex, true));
      onComplete();
    };
    
    img.onerror = () => {
      onComplete();
    };
    
    img.src = url;
  }, [imageLoadStates]);

  // Preload logic (background preloading)
  const preloadImage = useCallback((src: string | StaticImageData) => {
    if (isSlowConnection) return;
    const url = typeof src === "string" ? src : (src as StaticImageData).src;
    if (!url || preloadedRef.current.has(url)) return;
    preloadedRef.current.add(url);

    const doPreload = () => {
      const img = new window.Image();
      img.fetchPriority = 'low';
      img.src = url;
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(doPreload, { timeout: 500 });
    } else {
      setTimeout(doPreload, 200);
    }
  }, [isSlowConnection]);

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

  // Haptic feedback helper
  const triggerHaptic = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  // Helper to trigger slide animation - Clean slide with subtle fade
  const animateToSlide = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || !trackRef.current) return;
    const width = trackRef.current.clientWidth;
    const targetOffset = direction === 'next' ? -width : width;

    setIsAnimating(true);
    triggerHaptic();

    // Apply Main Track Animation with fade
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 300ms ease-out, opacity 150ms ease-out';
      trackRef.current.style.transform = `translateX(${targetOffset}px)`;
      trackRef.current.style.opacity = '0.7';
    }

    setTimeout(() => {
      setIndex((prev) => {
        if (direction === 'next') return prev === images.length - 1 ? 0 : prev + 1;
        return prev === 0 ? images.length - 1 : prev - 1;
      });

      // Reset instantly then fade in
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform = 'translateX(0px)';
        trackRef.current.style.opacity = '1';
      }

      setIsAnimating(false);
      currentTranslateRef.current = 0;
    }, 300);
  }, [isAnimating, images.length, triggerHaptic]);

  // NEW: Smart navigation with loading awareness
  const navigateToSlide = useCallback((targetIndex: number, direction: 'next' | 'prev') => {
    // Clear any pending timeout
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }

    const isLoaded = imageLoadStates.get(targetIndex);
    
    // Fast connection/already loaded OR user preference to not wait - instant navigate
    if (isLoaded || (!shouldWaitForLoad && connectionType === 'fast')) {
      animateToSlide(direction);
      return;
    }

    // Slow connection/medium speed and not loaded - show pending state
    setPendingIndex(targetIndex);
    setIsLoading(true);
    
    const startTime = performance.now();
    
    // Preload with callback
    preloadImageWithCallback(images[targetIndex], targetIndex, () => {
      const loadTime = performance.now() - startTime;
      
      // Track load time for speed detection
      loadTimeRef.current.push(loadTime);
      if (loadTimeRef.current.length > 5) {
        loadTimeRef.current.shift(); // Keep only last 5
      }
      
      setPendingIndex(null);
      setIsLoading(false);
      animateToSlide(direction);
    });
    
    // Adaptive fallback timeout based on detected speed
    const timeoutDuration = actualSpeed === 'slow' ? 5000 : actualSpeed === 'medium' ? 3000 : 2000;
    
    pendingTimeoutRef.current = setTimeout(() => {
      if (pendingIndex === targetIndex) {
        setPendingIndex(null);
        setIsLoading(false);
        animateToSlide(direction);
      }
    }, timeoutDuration);
  }, [connectionType, shouldWaitForLoad, imageLoadStates, images, animateToSlide, preloadImageWithCallback, pendingIndex, actualSpeed]);

  const changeSlide = useCallback((newIndex: number) => {
    if (isAnimating || pendingIndex !== null) return;
    
    const direction = newIndex > index ? 'next' : 'prev';
    
    // For direct thumbnail clicks, calculate steps and navigate
    const steps = Math.abs(newIndex - index);
    
    if (steps === 1) {
      navigateToSlide(newIndex, direction);
    } else {
      // For multi-step jumps, just check if loaded
      const isLoaded = imageLoadStates.get(newIndex);
      
      if (isLoaded || (!shouldWaitForLoad && connectionType === 'fast')) {
        setIsLoading(true);
        setIndex(newIndex);
      } else {
        setPendingIndex(newIndex);
        setIsLoading(true);
        
        const startTime = performance.now();
        
        preloadImageWithCallback(images[newIndex], newIndex, () => {
          const loadTime = performance.now() - startTime;
          loadTimeRef.current.push(loadTime);
          if (loadTimeRef.current.length > 5) {
            loadTimeRef.current.shift();
          }
          
          setPendingIndex(null);
          setIndex(newIndex);
        });
        
        const timeoutDuration = actualSpeed === 'slow' ? 5000 : actualSpeed === 'medium' ? 3000 : 2000;
        
        pendingTimeoutRef.current = setTimeout(() => {
          setPendingIndex(null);
          setIndex(newIndex);
        }, timeoutDuration);
      }
    }
  }, [index, isAnimating, pendingIndex, navigateToSlide, connectionType, shouldWaitForLoad, imageLoadStates, images, preloadImageWithCallback, actualSpeed]);

  const prevSlide = useCallback(() => {
    if (isAnimating || pendingIndex !== null) return;
    const targetIndex = index === 0 ? images.length - 1 : index - 1;
    navigateToSlide(targetIndex, 'prev');
  }, [index, images.length, isAnimating, pendingIndex, navigateToSlide]);

  const nextSlide = useCallback(() => {
    if (isAnimating || pendingIndex !== null) return;
    const targetIndex = index === images.length - 1 ? 0 : index + 1;
    navigateToSlide(targetIndex, 'next');
  }, [index, images.length, isAnimating, pendingIndex, navigateToSlide]);

  // Zoom methods
  const openZoom = useCallback((idx: number) => {
    setZoomIndex(idx);
    setIsZoomed(true);
  }, []);

  const closeZoom = useCallback(() => {
    setIsZoomed(false);
  }, []);

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
  }, [isZoomed, isFullscreen, closeZoom, exitFullscreen, prevSlide, nextSlide]);

  // Reset
  useEffect(() => {
    setIndex(0);
    setIsLoading(true);
    setPendingIndex(null);
    setImageLoadStates(new Map());
    preloadedRef.current.clear();
    
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
  }, [images]);

  // Cleanup pending timeout
  useEffect(() => {
    return () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
    };
  }, []);

  // Unified Pointer (Touch + Mouse) Tracking Logic using Refs for 60fps performance
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isAnimating || pendingIndex !== null) return;
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

    (e.target as Element).setPointerCapture(e.pointerId);
  }, [isAnimating, pendingIndex]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current || startXRef.current === null) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    currentTranslateRef.current = diff;

    // Direct DOM update - Bypass React Render Cycle
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${diff}px)`;
    }
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

    if (dragDist > threshold) {
      // Swiped right - go to previous
      prevSlide();
    } else if (dragDist < -threshold) {
      // Swiped left - go to next
      nextSlide();
    } else {
      // Not enough swipe - snap back
      trackRef.current.style.transition = 'transform 200ms ease-out';
      trackRef.current.style.transform = 'translateX(0px)';
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = 'none';
        }
      }, 200);
    }

    currentTranslateRef.current = 0;
  }, [prevSlide, nextSlide]);

  // NEW: Enhanced Loading Overlay with context
  const LoadingOverlay = useMemo(() => {
    if (!isLoading && pendingIndex === null) return null;
    
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
        <div className="z-20 flex flex-col items-center gap-3">
          <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/50 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${loadingProgress}%` }} 
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/90 text-sm font-medium">
              {pendingIndex !== null ? 'Loading next image...' : 'Loading...'}
            </span>
            {actualSpeed === 'slow' && (
              <span className="text-white/60 text-xs">Slow connection - please wait</span>
            )}
            {actualSpeed === 'medium' && (
              <span className="text-white/60 text-xs">Loading optimized image</span>
            )}
            {connectionType === 'slow' && actualSpeed === 'fast' && (
              <span className="text-white/60 text-xs">Detected slow network</span>
            )}
          </div>
        </div>
      </div>
    );
  }, [isLoading, pendingIndex, loadingProgress, actualSpeed, connectionType]);

  // Carousel Indices
  const prevIndex = (index - 1 + images.length) % images.length;
  const nextIndex = (index + 1) % images.length;

  // Check if navigation is disabled
  const isNavigationDisabled = isAnimating || pendingIndex !== null;

  return (
    <div ref={fullscreenRef} className={clsx(isFullscreen && "bg-black")}>
      {/* Slow Connection Indicator */}
      {(isSlowConnection || actualSpeed === 'medium') && !isFullscreen && !isZoomed && (
        <div className="mb-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {actualSpeed === 'slow' 
              ? 'Slow connection detected - images may take longer to load'
              : actualSpeed === 'medium'
              ? 'Medium speed connection - optimizing image loading'
              : 'Slow network detected'}
          </p>
        </div>
      )}

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
            aria-label="Exit fullscreen"
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
              preload
              decoding="async"
              loading="lazy"
            />
          </div>

          <button 
            onClick={prevSlide} 
            disabled={isNavigationDisabled}
            className={clsx(
              "absolute left-3 top-1/2 -translate-y-1/2 z-[110] bg-black/40 rounded-full p-2 transition-all",
              isNavigationDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-black/60"
            )}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>
          <button 
            onClick={nextSlide} 
            disabled={isNavigationDisabled}
            className={clsx(
              "absolute right-3 top-1/2 -translate-y-1/2 z-[110] bg-black/40 rounded-full p-2 transition-all",
              isNavigationDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-black/60"
            )}
            aria-label="Next image"
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>
        </div>
      )}

      {/* Main Image Container */}
      <div
        className={clsx(
          "relative w-full h-60.5 lg:h-108.75 overflow-hidden rounded-xl bg-gray-900/10 touch-none select-none",
          !isNavigationDisabled && "cursor-grab"
        )}
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
                sizes="100vw"
                className="object-cover pointer-events-none"
                preload
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                onLoad={() => {
                  setIsLoading(false);
                  setImageLoadStates(prev => new Map(prev).set(0, true));
                }}
              />
            </div>
          ) : (
            <>
              {/* Prev Slide (-100%) */}
              <div
                className="absolute top-0 left-0 w-full h-full -translate-x-full"
                aria-hidden="true"
              >
                <Image
                  src={images[prevIndex]}
                  alt="Previous"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
    
                  className="object-cover pointer-events-none"
                  loading="eager"
                  decoding="async"
                  onLoad={() => {
                    setImageLoadStates(prev => new Map(prev).set(prevIndex, true));
                  }}
                />
              </div>

              {/* Current Slide (0%) */}
              <div className="absolute top-0 left-0 w-full h-full">
                <Image
                  src={images[index]}
                  alt="Gallery"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
                  className="object-cover"
                  draggable={false}
                  onClick={() => !isDraggingRef.current && !isNavigationDisabled && (isMobile ? enterFullscreen() : openZoom(index))}
                  onLoad={() => {
                    setIsLoading(false);
                    setImageLoadStates(prev => new Map(prev).set(index, true));
                  }}
                  preload
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  decoding="async"
                />
              </div>

              {/* Next Slide (100%) */}
              <div
                className="absolute top-0 left-0 w-full h-full translate-x-full"
                aria-hidden="true"
              >
                <Image
                  src={images[nextIndex]}
                  alt="Next"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
    
                  className="object-cover pointer-events-none"
                  loading="eager"
                  decoding="async"
                  onLoad={() => {
                    setImageLoadStates(prev => new Map(prev).set(nextIndex, true));
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Fullscreen button */}
        <button
          onClick={enterFullscreen}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 z-30 lg:hidden bg-black/40 rounded-full p-2 active:scale-95 pointer-events-auto"
          aria-label="Enter fullscreen"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              disabled={isNavigationDisabled}
              onPointerDown={(e) => e.stopPropagation()}
              className={clsx(
                "absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 rounded-full p-1 lg:hidden pointer-events-auto transition-all",
                isNavigationDisabled && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isNavigationDisabled}
              onPointerDown={(e) => e.stopPropagation()}
              className={clsx(
                "absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 rounded-full p-1 lg:hidden pointer-events-auto transition-all",
                isNavigationDisabled && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7 text-white" />
            </button>
          </>
        )}

        {/* Pagination dots & counter */}
        {images.length > 1 && (
          <>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm hidden lg:block pointer-events-none">
              {index + 1} / {images.length}
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden z-20 pointer-events-auto">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    changeSlide(i); 
                  }}
                  disabled={isNavigationDisabled}
                  className={clsx(
                    "rounded-full transition-all",
                    i === index ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40",
                    isNavigationDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label={`Go to image ${i + 1}`}
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
            <button 
              onClick={prevSlide}
              disabled={isNavigationDisabled}
              className={clsx(
                "pt-2 rounded-full cursor-pointer p-1 transition-all",
                isNavigationDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              disabled={isNavigationDisabled}
              className={clsx(
                "pt-2 rounded-full cursor-pointer p-1 transition-all",
                isNavigationDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"
              )}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          {/* Scrollable Thumbnails */}
          {/* <div className="hidden lg:flex gap-2 mt-4 overflow-x-auto snap-x scrollbar-hide py-1"> */}
          <div className="hidden lg:flex gap-2 mt-4 justify-center">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => changeSlide(i)}
                disabled={isNavigationDisabled}
                className={clsx(
                  "relative w-16 h-16 shrink-0 rounded-md overflow-hidden transition-all duration-200 snap-start",
                  i === index ? "ring-2 ring-white opacity-100 scale-105" : "opacity-60 hover:opacity-100 hover:scale-105",
                  isNavigationDisabled && i !== index && "cursor-not-allowed opacity-40"
                )}
                aria-label={`Go to image ${i + 1}`}
              >
                <Image 
                  src={img} 
                  alt={`Thumbnail ${i + 1}`} 
                  fill 
    
                  className="object-cover" 
                  sizes="64px" 
                  draggable={false}
                  onLoad={() => {
                    setImageLoadStates(prev => new Map(prev).set(i, true));
                  }}
                />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Zoom Modal */}
      <ZoomModal
        images={images}
        initialIndex={zoomIndex}
        isOpen={isZoomed}
        onClose={closeZoom}
      />
    </div>
  );
});
ImageGallerySlider.displayName = 'ImageGallerySlider';

export default ImageGallerySlider;