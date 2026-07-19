"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { memo, useCallback, useEffect, useRef, useState } from "react";

interface ZoomModalProps {
  images: (string | StaticImageData)[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+";

const ZoomModal = memo(({ images, initialIndex, isOpen, onClose }: ZoomModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Touch tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef(0);
  const pinchStartRef = useRef<{ dist: number; scale: number } | null>(null);
  const swipeTriggeredRef = useRef(false);

  const isZoomed = scale > 1;

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setIsReady(false);
      setIsLoaded(false);
      setHasError(false);
      // Small delay for entrance animation
      requestAnimationFrame(() => requestAnimationFrame(() => setIsReady(true)));
    }
  }, [isOpen, initialIndex]);

  // Reset loaded/error state when current image changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [currentIndex]);

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen || images.length <= 1) return;

    const prev = (currentIndex - 1 + images.length) % images.length;
    const next = (currentIndex + 1) % images.length;

    [prev, next].forEach(i => {
      if (i !== currentIndex) {
        const src = typeof images[i] === 'string' ? images[i] : images[i].src;
        if (src) {
          const img = new window.Image();
          img.src = src;
        }
      }
    });
  }, [isOpen, currentIndex, images]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navigate = useCallback((delta: number) => {
    if (isZoomed) return; // Don't navigate while zoomed in
    setCurrentIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
    setScale(1);
  }, [images.length, isZoomed]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, currentIndex, isZoomed, navigate]);

  const toggleZoom = useCallback(() => {
    setScale((prev) => (prev > 1 ? 1 : 2));
  }, []);

  // Pinch distance helper
  const getTouchDist = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    swipeTriggeredRef.current = false;

    // Pinch start (2 fingers)
    if (e.touches.length === 2) {
      pinchStartRef.current = { dist: getTouchDist(e.touches), scale };
      return;
    }

    // Single finger: track for swipe + double-tap
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300) {
      // Double-tap → toggle zoom
      e.preventDefault();
      setScale((prev) => (prev > 1 ? 1 : 2));
      lastTapRef.current = 0;
      return;
    }

    lastTapRef.current = now;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: now };
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Pinch zoom
    if (e.touches.length === 2 && pinchStartRef.current) {
      e.preventDefault();
      const dist = getTouchDist(e.touches);
      const newScale = Math.min(4, Math.max(0.5, pinchStartRef.current.scale * (dist / pinchStartRef.current.dist)));
      setScale(newScale);
      return;
    }

    // Swipe to navigate (only when not zoomed)
    if (!touchStartRef.current || isZoomed || e.touches.length !== 1) return;

    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;

    // If vertical scroll is dominant, let the browser handle it
    if (Math.abs(dy) > Math.abs(dx) * 1.5) return;

    // If horizontal swipe is dominant and exceeds threshold, trigger navigation
    if (Math.abs(dx) > 60 && !swipeTriggeredRef.current) {
      swipeTriggeredRef.current = true;
      navigate(dx > 0 ? -1 : 1);
    }
  }, [isZoomed, navigate]);

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
    pinchStartRef.current = null;
    // Reset swipe lock after a tick
    setTimeout(() => { swipeTriggeredRef.current = false; }, 100);
  }, []);

  // Mouse wheel zoom on desktop
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setScale((prev) => {
        const next = prev - e.deltaY * 0.01;
        return Math.min(4, Math.max(1, next));
      });
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300",
        isReady ? "bg-black/95 opacity-100" : "bg-black/0 opacity-0"
      )}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2.5 transition-all active:scale-95"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 z-[60] bg-black/50 backdrop-blur-sm text-white/90 text-sm font-medium px-3 py-1.5 rounded-full tabular-nums">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); setScale((p) => Math.min(4, p + 0.5)); }}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all active:scale-95"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setScale((p) => Math.max(1, p - 0.5)); }}
          className={clsx(
            "bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all active:scale-95",
            !isZoomed && "opacity-40 pointer-events-none"
          )}
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && !isZoomed && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-[60] bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-[60] bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Thumbnail strip (desktop only, when not zoomed) */}
      {images.length > 1 && !isZoomed && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[60] hidden md:flex gap-2 bg-black/40 backdrop-blur-sm rounded-xl p-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); setScale(1); }}
              className={clsx(
                "relative w-12 h-12 rounded-lg overflow-hidden shrink-0 transition-all",
                i === currentIndex
                  ? "ring-2 ring-white scale-110"
                  : "opacity-50 hover:opacity-80"
              )}
              aria-label={`Go to image ${i + 1}`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image container */}
      <div
        className={clsx(
          "relative w-[95vw] h-[85vh] transition-transform duration-200 ease-out",
          isReady ? "scale-100" : "scale-95"
        )}
        style={{ transform: `scale(${isReady ? 1 : 0.95})` }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {hasError ? (
          <div className="flex items-center justify-center h-full text-white/60">
            <p>Failed to load image</p>
          </div>
        ) : (
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1} of ${images.length}`}
            fill
            sizes="(max-width: 768px) 95vw, 85vh"
            loading="eager"
            fetchPriority="high"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            style={{ transform: `scale(${scale})` }}
            className={clsx(
              "object-contain transition-transform duration-200",
              isZoomed && "cursor-grab"
            )}
          />
        )}
      </div>
    </div>
  );
});

ZoomModal.displayName = "ZoomModal";

export default ZoomModal;
