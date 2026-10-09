"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Eye,
  Filter,
  Grid2X2,
  Package,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
} from "lucide-react";
import type { CategoryRecord } from "@/features/categories/schemas/category.schema";
import type { ProductRecord } from "@/features/products/schemas/product.schema";
import { Button } from "@/components/ui/button";

type CategoryProductViewProps = {
  category: CategoryRecord;
  products: ProductRecord[];
  allCategories: CategoryRecord[];
};

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

function ProductCardImage({
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
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={`object-contain p-3 sm:p-4 drop-shadow-xs transition-transform duration-500 group-hover:scale-105 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function CategoryProductView({
  category,
  products,
  allCategories,
}: CategoryProductViewProps) {
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.product_description?.toLowerCase().includes(q)
      );
    }

    // Filter by stock availability
    if (inStockOnly) {
      result = result.filter((p) => p.quantity > 0);
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        );
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchQuery, inStockOnly, sortBy]);

  return (
    <div className="space-y-8">
      {/* Category Pills Slider / Quick Navigation */}
      {allCategories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-[#75897c]">
            Categories:
          </span>
          {allCategories.map((cat) => {
            const isActive = cat.slug === category.slug;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#174c3a] text-white shadow-xs"
                    : "border border-[#dbe4da] bg-white text-[#2c4033] hover:border-[#174c3a] hover:bg-[#edf3ec]"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Filter & Sorting Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e4ebe1] bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Product count & In Stock toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-[#203428]">
            Showing{" "}
            <span className="font-semibold text-[#174c3a]">
              {filteredAndSortedProducts.length}
            </span>{" "}
            {filteredAndSortedProducts.length === 1 ? "product" : "products"}
          </span>

          <span className="h-4 w-px bg-neutral-200" aria-hidden="true" />

          {/* In Stock toggle chip */}
          <button
            type="button"
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              inStockOnly
                ? "bg-emerald-100/90 text-emerald-900 ring-1 ring-emerald-600/30"
                : "bg-[#f2f6f1] text-[#4d6354] hover:bg-[#e6efe4]"
            }`}
          >
            {inStockOnly && <Check className="size-3" />}
            In Stock Only
          </button>
        </div>

        {/* Right: Search in category & Sorting */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Quick search input */}
          <div className="relative flex-1 sm:w-52">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#8b9e91]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Filter in ${category.name}...`}
              className="h-9 w-full rounded-xl border border-[#d8e3d6] bg-[#fbfcfb] pl-8.5 pr-3 text-xs text-[#1e3427] placeholder:text-[#8b9e91] focus:border-[#174c3a] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 appearance-none rounded-xl border border-[#d8e3d6] bg-[#fbfcfb] pl-3 pr-8 text-xs font-medium text-[#1f3729] hover:bg-white focus:border-[#174c3a] focus:outline-none cursor-pointer"
              aria-label="Sort products by"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Additions</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#7d9183]" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ccd8cb] bg-white px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eff4ee] text-[#194c3a]">
            <Package className="size-7" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-[#1e3527]">
            No products found in {category.name}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#748779]">
            {searchQuery || inStockOnly
              ? "Try adjusting your filters or search query to discover other items."
              : "We are currently restocking this collection. Please check back shortly or explore other categories."}
          </p>
          {(searchQuery || inStockOnly) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setInStockOnly(false);
              }}
              className="mt-5 rounded-xl border-[#cfded0]"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSortedProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#e2eae0] bg-white transition-all duration-300 hover:border-[#b4cbb7] hover:shadow-[0_12px_36px_-12px_rgba(20,60,40,0.18)]"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-square sm:aspect-[4/5] w-full overflow-hidden bg-[#f6f9f5]">
                <ProductCardImage
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
                    <Tag className="size-2.5" /> {category.name}
                  </div>
                  <h4 className="mt-1 line-clamp-1 text-sm font-semibold text-[#1c3325] transition-colors group-hover:text-[#174c3a] sm:text-base">
                    {product.name}
                  </h4>
                  {product.product_description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#738779]">
                      {product.product_description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#edf2ea] pt-3">
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
      )}
    </div>
  );
}

