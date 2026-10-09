"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Layers, Package, Sparkles, Tag } from "lucide-react";
import type { CategoryWithProducts } from "@/features/products/data/products";
import type { ProductRecord } from "@/features/products/schemas/product.schema";

type CategoryProductsSectionProps = {
  categoriesWithProducts: CategoryWithProducts[];
};

// Error-resilient, responsive image loader for product cards
function CategoryCardImage({
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
        sizes="(max-width: 640px) 70vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 20vw"
        className={`object-contain p-3 sm:p-4 drop-shadow-xs transition-transform duration-500 group-hover:scale-105 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

// Fallback category data if catalog has no categories/products yet
const FALLBACK_CATEGORIES: CategoryWithProducts[] = [
  {
    id: "fallback-cat-1",
    name: "Wardrobe Essentials",
    slug: "wardrobe-essentials",
    products: [
      {
        id: "fb-1",
        name: "Classic Organic Crewneck Tee",
        price: 34.0,
        quantity: 50,
        category_id: "fallback-cat-1",
        image_path: null,
        product_description: "Pure combed organic cotton tailored for an everyday breathable fit.",
        is_featured: true,
        created_at: "",
        updated_at: "",
      },
      {
        id: "fb-2",
        name: "Relaxed Linen Blend Trousers",
        price: 78.0,
        quantity: 25,
        category_id: "fallback-cat-1",
        image_path: null,
        product_description: "Airy linen weave with a comfortable elasticated drawstring waist.",
        is_featured: false,
        created_at: "",
        updated_at: "",
      },
      {
        id: "fb-3",
        name: "Crisp Cotton Oxford Button-Down",
        price: 64.0,
        quantity: 18,
        category_id: "fallback-cat-1",
        image_path: null,
        product_description: "Structured collar with durable horn buttons and subtle chest pocket.",
        is_featured: true,
        created_at: "",
        updated_at: "",
      },
      {
        id: "fb-4",
        name: "Everyday Canvas Utility Tote",
        price: 45.0,
        quantity: 30,
        category_id: "fallback-cat-1",
        image_path: null,
        product_description: "Heavyweight 16oz cotton canvas with reinforced brass rivets.",
        is_featured: false,
        created_at: "",
        updated_at: "",
      },
      {
        id: "fb-5",
        name: "Fine Gauge Merino Knit Sweater",
        price: 95.0,
        quantity: 12,
        category_id: "fallback-cat-1",
        image_path: null,
        product_description: "Extra-fine merino wool offering lightweight thermoregulation.",
        is_featured: true,
        created_at: "",
        updated_at: "",
      },
    ],
  },
  {
    id: "fallback-cat-2",
    name: "Outerwear & Layers",
    slug: "outerwear-layers",
    products: [
      {
        id: "fb-6",
        name: "Insulated Oversized Wool Coat",
        price: 185.0,
        quantity: 14,
        category_id: "fallback-cat-2",
        image_path: null,
        product_description: "Double-faced wool blend tailored with wide lapels and deep pockets.",
        is_featured: true,
        created_at: "",
        updated_at: "",
      },
      {
        id: "fb-7",
        name: "Technical Water-Repellent Anorak",
        price: 110.0,
        quantity: 22,
        category_id: "fallback-cat-2",
        image_path: null,
        product_description: "Matte ripstop shell with concealed storm flaps and drawcord hood.",
        is_featured: false,
        created_at: "",
        updated_at: "",
      },
      {
        id: "fb-8",
        name: "Vintage Canvas Workwear Chore Jacket",
        price: 89.0,
        quantity: 28,
        category_id: "fallback-cat-2",
        image_path: null,
        product_description: "Durable duck canvas with corduroy collar and triple-needle stitching.",
        is_featured: true,
        created_at: "",
        updated_at: "",
      },
      {
        id: "fb-9",
        name: "Quilted Recycled Down Vest",
        price: 74.0,
        quantity: 19,
        category_id: "fallback-cat-2",
        image_path: null,
        product_description: "Packable core warmth with fleece-lined zippered hand warmer pockets.",
        is_featured: false,
        created_at: "",
        updated_at: "",
      },
      {
        id: "fb-10",
        name: "Fleece Zip Pullover in Sage",
        price: 58.0,
        quantity: 35,
        category_id: "fallback-cat-2",
        image_path: null,
        product_description: "Plush sherpa fleece engineered for morning walks and relaxed evenings.",
        is_featured: false,
        created_at: "",
        updated_at: "",
      },
    ],
  },
];

export default function CategoryProductsSection({
  categoriesWithProducts,
}: CategoryProductsSectionProps) {
  const displayCategories =
    categoriesWithProducts.length > 0
      ? categoriesWithProducts
      : FALLBACK_CATEGORIES;

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {displayCategories.map((categorySection, sectionIdx) => {
        const products = categorySection.products.slice(0, 5);
        if (products.length === 0) return null;

        // Alternate subtle background nuances between categories for visual rhythm
        const isAlternate = sectionIdx % 2 === 1;

        return (
          <section
            key={categorySection.id}
            className={`relative mx-auto w-full max-w-[1440px] px-3.5 sm:px-8 lg:px-12`}
            aria-label={`${categorySection.name} Product Listing`}
          >
            {/* Section Header */}
            <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d8e3d6] bg-[#edf4ec] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1b4c37] sm:text-[11px]">
                    <Layers className="size-3" aria-hidden="true" /> Category {sectionIdx + 1}
                  </span>
                  <span className="text-xs font-medium text-[#7d9083]">
                    5 curated picks
                  </span>
                </div>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#173223] sm:text-3xl">
                  {categorySection.name}
                </h2>
                <p className="mt-1 text-xs text-[#63776a] sm:text-sm">
                  Discover top-rated selections and everyday favorites from our {categorySection.name.toLowerCase()} line.
                </p>
              </div>

              {/* View All in Category Link */}
              <Link
                href={`/categories/${categorySection.slug}`}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#184c39] hover:underline sm:text-sm"
              >
                View all {categorySection.name}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 sm:size-4" />
              </Link>
            </div>

            {/* 5 Products: Mobile Horizontal Swipe + Desktop 5-Column Grid */}
            <div className="relative">
              <div className="flex gap-3.5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-4 lg:gap-5 sm:overflow-visible sm:pb-0">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group relative flex min-w-[210px] xs:min-w-[230px] max-w-[250px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#e2eae0] bg-white transition-all duration-300 hover:border-[#b4cbb7] hover:shadow-[0_12px_36px_-12px_rgba(20,60,40,0.18)] sm:min-w-0 sm:max-w-none sm:w-full"
                  >
                    {/* Product Image Frame */}
                    <div className="relative aspect-square sm:aspect-[4/5] w-full overflow-hidden bg-[#f6f9f5]">
                      <CategoryCardImage
                        src={product.image_path}
                        alt={product.name}
                      />

                      {/* Top Badges */}
                      <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
                        {product.is_featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#1d4d38] shadow-sm backdrop-blur-sm sm:text-[10px]">
                            <Sparkles className="size-2.5 text-amber-500" /> Featured
                          </span>
                        )}
                      </div>

                      {/* Out of stock overlay */}
                      {product.quantity <= 0 && (
                        <div className="absolute inset-0 grid place-items-center bg-[#14231b]/40 backdrop-blur-[2px]">
                          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#8b2626]">
                            Out of stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details Block */}
                    <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] text-[#788b7d]">
                          <Tag className="size-2.5" /> {categorySection.name}
                        </div>
                        <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-[#1c3325] transition-colors group-hover:text-[#174c3a]">
                          {product.name}
                        </h3>
                        {product.product_description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#738779]">
                            {product.product_description}
                          </p>
                        )}
                      </div>

                      <div className="mt-3.5 flex items-center justify-between border-t border-[#edf2ea] pt-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#8c9c8f]">
                            Price
                          </p>
                          <p className="text-sm font-bold text-[#173e2e] sm:text-base">
                            ${Number(product.price).toFixed(2)}
                          </p>
                        </div>

                        <Link
                          href={`/shop?product=${product.id}`}
                          className="inline-flex items-center gap-1 rounded-xl border border-[#d6e3d4] bg-[#f8faf7] px-3 py-1.5 text-xs font-semibold text-[#1c4d37] transition-all hover:border-[#174c3a] hover:bg-[#174c3a] hover:text-white"
                        >
                          <Eye className="size-3" /> View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

