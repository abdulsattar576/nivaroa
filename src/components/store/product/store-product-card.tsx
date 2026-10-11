"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Package, ShoppingBag, Sparkles, Star, Tag, Check } from "lucide-react";
import type { ProductRecord } from "@/features/products/schemas/product.schema";
import { useCart } from "@/features/cart/store/cart-store";

interface StoreProductCardProps {
  product: ProductRecord;
  showCategoryBadge?: boolean;
}

export function StoreProductCard({
  product,
  showCategoryBadge = true,
}: StoreProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.quantity <= 0 || isAdding) return;

    setIsAdding(true);
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(false);
    }, 1200);
  };

  const isLowStock = product.quantity > 0 && product.quantity < 5;
  const isOutOfStock = product.quantity <= 0;
  const rating = product.rating || 5.0;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e4ece2] bg-white transition-all duration-300 hover:border-[#b4cdb8] hover:shadow-[0_16px_40px_-14px_rgba(20,50,35,0.18)]">
      {/* Product Image Frame with Zoom */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f6f9f5]">
        <Link href={`/product/${product.slug || product.id}`} className="block size-full">
          {!product.image_path || imageError ? (
            <div className="grid size-full place-items-center bg-[#f0f4ee] p-4 text-[#86998b]">
              <div className="text-center">
                <Package className="mx-auto size-9 stroke-[1.5]" />
                <p className="mt-1.5 text-[11px] font-medium text-[#7d9183]">No image</p>
              </div>
            </div>
          ) : (
            <Image
              src={product.image_path}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 75vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain p-3 sm:p-4 drop-shadow-xs transition-transform duration-700 ease-out group-hover:scale-108 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
        </Link>

        {/* Top Badges (Left) */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {product.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1d4d38] shadow-xs backdrop-blur-sm sm:text-[10px]">
              <Sparkles className="size-2.5 text-amber-500 fill-amber-500" /> Featured
            </span>
          )}
          {showCategoryBadge && product.category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#174c3a]/90 px-2 py-0.5 text-[9px] font-medium text-white shadow-xs backdrop-blur-sm sm:text-[10px]">
              <Tag className="size-2.5" /> {product.category.name}
            </span>
          )}
        </div>

        {/* Top Badges (Right: Stock Notice) */}
        {isLowStock && (
          <span className="pointer-events-none absolute right-2.5 top-2.5 rounded-full bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-sm">
            Only {product.quantity} Left
          </span>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-[#14231b]/45 backdrop-blur-[2px]">
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8b2626] shadow-md">
              Out of stock
            </span>
          </div>
        )}

        {/* Quick Add To Bag Hover Action Button */}
        {!isOutOfStock && (
          <div className="absolute inset-x-2.5 bottom-2.5 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdding}
              className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all active:scale-95 ${
                justAdded
                  ? "bg-emerald-700"
                  : "bg-[#174c3a]/95 hover:bg-[#103d31]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="size-3.5" /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="size-3.5" /> Quick Add
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          {/* Star Rating & Reviews (Strictly Real Customer Feedback) */}
          {product.reviews_count && product.reviews_count > 0 && product.rating ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-3 ${
                      star <= Math.round(product.rating || 0)
                        ? "fill-current text-amber-500"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold text-[#1f3729]">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-[#788c7f]">
                ({product.reviews_count})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#7d9183]">
              <span className="inline-block size-1.5 rounded-full bg-[#3d7054]" />
              <span>Authentic Collection</span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="mt-1.5 line-clamp-1 text-sm font-semibold text-[#1c3325] transition-colors group-hover:text-[#174c3a] sm:text-base">
            <Link href={`/product/${product.slug || product.id}`}>
              {product.name}
            </Link>
          </h3>

          {/* Short Description */}
          {product.product_description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#738779]">
              {product.product_description}
            </p>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-3.5 flex items-center justify-between border-t border-[#edf2ea] pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#8c9c8f]">
              Price
            </p>
            <p className="text-base font-extrabold text-[#173e2e] sm:text-lg">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          <Link
            href={`/product/${product.slug || product.id}`}
            className="inline-flex items-center gap-1 rounded-xl border border-[#d6e3d4] bg-[#f8faf7] px-3 py-1.5 text-xs font-semibold text-[#1c4d37] transition-all hover:border-[#174c3a] hover:bg-[#174c3a] hover:text-white"
          >
            <Eye className="size-3.5" /> Details
          </Link>
        </div>
      </div>
    </div>
  );
}

