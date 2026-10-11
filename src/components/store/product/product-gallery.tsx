"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Package, ZoomIn } from "lucide-react";

type ProductGalleryProps = {
  title: string;
  images: string[];
  badge?: string | null;
  discountPercent?: number | null;
  isOutOfStock?: boolean;
};

export default function ProductGallery({
  title,
  images,
  badge,
  discountPercent,
  isOutOfStock,
}: ProductGalleryProps) {
  // Ensure we have at least one image or placeholder
  const galleryImages = images.length > 0 ? images : [""];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [hasError, setHasError] = useState<Record<number, boolean>>({});

  const activeImage = galleryImages[activeIndex] || "";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Showcase Stage */}
      <div
        className="group relative aspect-4/5 w-full overflow-hidden rounded-3xl border border-[#e1eae1] bg-[#f7f9f6] shadow-sm select-none"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Badges Overlay */}
        <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
          {isOutOfStock ? (
            <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-md">
              Sold Out
            </span>
          ) : (
            <>
              {badge && (
                <span className="rounded-full bg-[#174c3a] px-3.5 py-1 text-xs font-semibold text-white shadow-xs">
                  {badge}
                </span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {/* Zoom Hint Icon */}
        <div className="pointer-events-none absolute right-4 top-4 z-20 hidden rounded-full bg-white/85 p-2 text-[#283f32] shadow-xs backdrop-blur-sm sm:flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 text-xs font-medium">
          <ZoomIn className="size-3.5" />
          <span>Hover to zoom</span>
        </div>

        {/* Main Image or Fallback */}
        {activeImage && !hasError[activeIndex] ? (
          <div className="relative size-full overflow-hidden">
            <Image
              src={activeImage}
              alt={`${title} - view ${activeIndex + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className={`object-contain p-4 transition-transform duration-200 ease-out ${
                isZoomed ? "scale-150 sm:scale-175" : "scale-100"
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
              onError={() =>
                setHasError((prev) => ({ ...prev, [activeIndex]: true }))
              }
            />
          </div>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 p-8 text-center text-[#7e8e82]">
            <div className="grid size-16 place-items-center rounded-2xl bg-[#edf3ed] text-[#345c47]">
              <Package className="size-8" />
            </div>
            <p className="text-sm font-medium">No preview image available</p>
          </div>
        )}

        {/* Desktop Prev / Next Overlapping Controls */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/90 text-[#173d2a] shadow-md transition hover:scale-105 hover:bg-white active:scale-95"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/90 text-[#173d2a] shadow-md transition hover:scale-105 hover:bg-white active:scale-95"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Strip */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {galleryImages.map((img, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={`${img}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1}`}
                className={`relative aspect-square size-18 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-150 ${
                  isSelected
                    ? "border-[#174c3a] bg-white ring-2 ring-[#174c3a]/20 scale-102"
                    : "border-[#e0e8e0] bg-[#f7f9f6] opacity-70 hover:opacity-100 hover:border-[#b8cdbd]"
                }`}
              >
                {img && !hasError[index] ? (
                  <Image
                    src={img}
                    alt={`${title} thumbnail ${index + 1}`}
                    fill
                    sizes="72px"
                    className="object-contain p-1.5"
                    onError={() =>
                      setHasError((prev) => ({ ...prev, [index]: true }))
                    }
                  />
                ) : (
                  <div className="grid size-full place-items-center text-slate-400">
                    <Package className="size-5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

