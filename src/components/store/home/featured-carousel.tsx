"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Package, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { ProductRecord } from "@/features/products/schemas/product.schema";
import { StoreProductCard } from "../product/store-product-card";

type FeaturedCarouselProps = {
  products: ProductRecord[];
};

function CardProductImage({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div className="grid size-full place-items-center bg-[#f0f4ee] p-4 text-[#86998b]">
        <div className="text-center">
          <Package className="mx-auto size-9 stroke-[1.5]" />
          <p className="mt-1.5 text-[11px] font-medium text-[#7d9183]">No image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative size-full">
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-neutral-100" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 76vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={`object-contain p-3 sm:p-4 drop-shadow-xs transition-transform duration-500 group-hover:scale-105 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Gentle autoplay that pauses on mouse hover
  useEffect(() => {
    if (!api || isPaused || products.length <= 1) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [api, isPaused, products.length]);

  const handlePrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const handleNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-[1440px] px-3.5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="rounded-3xl border border-[#e6ede5] bg-[#fbfcf9] p-8 text-center sm:p-12">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#ebf3ea] text-[#1c4d37]">
            <Sparkles className="size-6" />
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1c3627]">
            Featured Highlights Coming Soon
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#667a6d]">
            Curated everyday essentials will appear here once marked as featured in the catalog.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" render={<Link href="/shop" />} className="rounded-xl">
              Browse All Products
            </Button>
            <Button render={<Link href="/admin/product" />} className="rounded-xl bg-[#174c3a] text-white hover:bg-[#103d31]">
              Manage Catalog
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="mx-auto max-w-[1440px] px-3.5 py-10 sm:px-8 sm:py-16 lg:px-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Products Carousel"
    >
      {/* Section Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-[#edf4eb] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#22503a] sm:px-3 sm:text-[11px]">
            <Sparkles className="size-3" aria-hidden="true" /> Curated Essentials
          </span>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#193224] sm:mt-3 sm:text-3xl">
            Featured Products
          </h2>
          <p className="mt-1 text-xs text-[#667a6d] sm:text-sm">
            Thoughtfully selected pieces crafted for everyday comfort and lasting style.
          </p>
        </div>

        {/* Action Controls: View All */}
        <Link
          href="/shop"
          className="group inline-flex items-center gap-1 text-xs font-semibold text-[#1c4d37] hover:underline sm:text-sm"
        >
          Explore collection
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 sm:size-4" />
        </Link>
      </div>

      {/* Embla / Shadcn Carousel with Overlapping Floating Controls */}
      <div className="relative group/carousel">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
        <CarouselContent className="-ml-3 sm:-ml-5">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-3 basis-[75%] xs:basis-[68%] sm:basis-1/2 sm:pl-5 md:basis-1/3 lg:basis-1/4"
            >
              <div className="h-full">
                <StoreProductCard product={product} showCategoryBadge={true} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Floating Side Prev/Next Buttons Overlapping The Slides */}
      {products.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous product"
            className="absolute left-1.5 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white/95 text-[#1b3b2b] shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-white hover:shadow-xl active:scale-95 sm:left-3 sm:size-11"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next product"
            className="absolute right-1.5 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white/95 text-[#1b3b2b] shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-white hover:shadow-xl active:scale-95 sm:right-3 sm:size-11"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>
        </>
      )}
    </div>

      {/* Pagination Dots */}
      {count > 1 && (
        <div className="mt-6 flex justify-center gap-1.5 sm:mt-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-6 sm:w-8 bg-[#174c3a]"
                  : "w-1.5 sm:w-2 bg-[#d2ded1] hover:bg-[#a6baa5]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

