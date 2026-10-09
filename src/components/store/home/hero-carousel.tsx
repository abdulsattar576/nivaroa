"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Package,
  ShoppingBag,
  Sparkles,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { ProductRecord } from "@/features/products/schemas/product.schema";

type HeroCarouselProps = {
  featuredProducts: ProductRecord[];
};

// Gradient color themes to rotate across slides for a vibrant, professional store look
const SLIDE_THEMES = [
  {
    bg: "from-[#f1f6ef] via-[#eaf2e8] to-[#dde8db]",
    badgeBg: "bg-[#174c3a] text-white",
    accent: "#174c3a",
    promoText: "Hot Deal of the Week",
  },
  {
    bg: "from-[#fbf7ee] via-[#f5ede0] to-[#eae0d0]",
    badgeBg: "bg-[#8c5e28] text-white",
    accent: "#8c5e28",
    promoText: "Trending Now",
  },
  {
    bg: "from-[#edf3f6] via-[#e3edf2] to-[#d4e4ec]",
    badgeBg: "bg-[#235368] text-white",
    accent: "#235368",
    promoText: "Exclusive Featured Pick",
  },
  {
    bg: "from-[#f6edf2] via-[#efe3eb] to-[#e4d3df]",
    badgeBg: "bg-[#6c3558] text-white",
    accent: "#6c3558",
    promoText: "Limited Stock Edition",
  },
];

function HeroSlideImage({
  src,
  alt,
  priority = false,
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div className="grid size-full place-items-center bg-[#f0f4ee] p-6 text-center text-[#718776]">
        <div>
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white shadow-xs">
            <Package className="size-7 stroke-[1.5] text-[#24523b]" />
          </div>
          <p className="mt-2.5 text-xs font-semibold uppercase tracking-wider text-[#486b55]">
            Featured Selection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative size-full">
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-neutral-100/80" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 240px, (max-width: 768px) 300px, (max-width: 1024px) 380px, 440px"
        className={`object-contain p-3 sm:p-5 lg:p-6 drop-shadow-sm transition-all duration-700 hover:scale-105 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function HeroCarousel({ featuredProducts }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fallback slides in case database has few or no featured products yet
  const slides =
    featuredProducts.length > 0
      ? featuredProducts.slice(0, 6)
      : [
          {
            id: "fallback-1",
            name: "Minimalist Overshirt in Heavy Cotton",
            price: 68.0,
            quantity: 24,
            category_id: null,
            image_path: null,
            product_description:
              "Expertly tailored from organic unbleached cotton with clean silhouette lines.",
            is_featured: true,
            created_at: "",
            updated_at: "",
            category: { id: "1", name: "Outerwear", slug: "outerwear" },
          },
          {
            id: "fallback-2",
            name: "Everyday Structured Leather Tote",
            price: 120.0,
            quantity: 15,
            category_id: null,
            image_path: null,
            product_description:
              "Handcrafted full-grain leather companion designed for timeless utility.",
            is_featured: true,
            created_at: "",
            updated_at: "",
            category: { id: "2", name: "Accessories", slug: "accessories" },
          },
        ];

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

  // Autoplay functionality like Daraz: scrolls every 4 seconds, pauses on mouse enter
  useEffect(() => {
    if (!api || isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api, isPaused, slides.length]);

  const handlePrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const handleNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  return (
    <section
      className="relative mx-auto w-full max-w-[1440px] px-3.5 pt-3 sm:px-8 sm:pt-6 lg:px-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Homepage Featured Hero Slider"
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_16px_50px_-25px_rgba(20,50,35,0.18)]">
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {slides.map((product, idx) => {
              const theme = SLIDE_THEMES[idx % SLIDE_THEMES.length];
              const categoryName = product.category?.name || "Featured";

              return (
                <CarouselItem key={product.id} className="basis-full pl-0">
                  <div
                    className={`relative flex min-h-[380px] flex-col justify-between overflow-hidden bg-gradient-to-br ${theme.bg} p-5 sm:min-h-[440px] sm:p-8 md:min-h-[460px] md:flex-row md:items-center md:p-10 lg:min-h-[500px] lg:p-14`}
                  >
                    {/* Decorative ambient background blur */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-white/40 blur-3xl"
                    />

                    {/* Left Column: Product Info & Call-To-Action */}
                    <div className="relative z-10 flex flex-1 flex-col justify-center max-w-xl md:max-w-md lg:max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-xs sm:px-3 sm:text-[11px] ${theme.badgeBg}`}
                        >
                          <Flame className="size-3 sm:size-3.5 fill-current" /> {theme.promoText}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-[10px] font-medium text-[#2d4334] backdrop-blur-sm sm:text-[11px]">
                          <Tag className="size-2.5 sm:size-3" /> {categoryName}
                        </span>
                      </div>

                      <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#163324] sm:mt-4 sm:text-3xl md:text-3xl lg:text-5xl lg:leading-[1.12]">
                        {product.name}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#53685a] sm:mt-3 sm:text-sm md:text-sm lg:text-base">
                        {product.product_description ||
                          "Exceptional materials, timeless silhouette, and lasting comfort made for modern everyday life."}
                      </p>

                      {/* Pricing block & CTA */}
                      <div className="mt-4 flex flex-wrap items-baseline gap-2.5 sm:mt-6 sm:gap-3">
                        <span className="text-2xl font-extrabold tracking-tight text-[#173e2e] sm:text-3xl lg:text-4xl">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="rounded-lg bg-emerald-100/90 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-800">
                          {product.quantity > 0 ? "In Stock" : "Limited Availability"}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3.5">
                        <Button
                          size="lg"
                          render={<Link href={`/shop?product=${product.id}`} />}
                          className="h-10 rounded-xl bg-[#174c3a] px-5 text-xs font-semibold text-white shadow-md transition hover:scale-[1.02] hover:bg-[#103d31] sm:h-12 sm:rounded-2xl sm:px-7 sm:text-sm"
                        >
                          <ShoppingBag className="size-3.5 sm:size-4" /> Shop Now
                        </Button>

                        <Button
                          size="lg"
                          variant="outline"
                          render={<Link href="/shop" />}
                          className="h-10 rounded-xl border-white/80 bg-white/70 px-4 text-xs font-semibold text-[#1c3929] backdrop-blur-sm hover:bg-white sm:h-12 sm:rounded-2xl sm:px-6 sm:text-sm"
                        >
                          View Collection <ArrowRight className="size-3.5 sm:size-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Right Column: Hero Product Image Presentation */}
                    <div className="relative z-10 mt-6 flex flex-1 items-center justify-center md:mt-0 md:justify-end">
                      <div className="relative aspect-square w-full max-w-[220px] xs:max-w-[260px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-[460px]">
                        {/* Glow halo */}
                        <div className="absolute inset-2 sm:inset-4 rounded-2xl sm:rounded-3xl bg-white/70 shadow-2xl backdrop-blur-sm" />

                        <div className="relative size-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/60 bg-white shadow-xl">
                          <HeroSlideImage
                            src={product.image_path}
                            alt={product.name}
                            priority={idx === 0}
                          />

                          {/* Floating feature badge */}
                          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 rounded-lg sm:rounded-xl bg-white/95 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-[#193d2e] shadow-md backdrop-blur-md">
                            <span className="flex items-center gap-1 sm:gap-1.5">
                              <Sparkles className="size-3 sm:size-3.5 text-amber-500" /> Premium Quality
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Floating Side Prev/Next Buttons (Daraz Style) */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 z-20 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/90 text-[#1a3828] shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-white active:scale-95 sm:left-4 sm:size-10 md:left-5 md:size-11"
            >
              <ChevronLeft className="size-4 sm:size-5 md:size-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 z-20 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/90 text-[#1a3828] shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-white active:scale-95 sm:right-4 sm:size-10 md:right-5 md:size-11"
            >
              <ChevronRight className="size-4 sm:size-5 md:size-6" />
            </button>
          </>
        )}

        {/* Bottom Pagination Dots / Pills (Daraz Style Indicator) */}
        {count > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:gap-2 rounded-full bg-black/20 px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  current === index
                    ? "w-5 sm:w-7 bg-white shadow-xs"
                    : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

