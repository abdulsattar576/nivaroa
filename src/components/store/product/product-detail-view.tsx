import Link from "next/link";
import { ChevronRight, Home, Star, Tag, Zap } from "lucide-react";
import ProductGallery from "./product-gallery";
import ProductActions from "./product-actions";
import ProductSpecsTabs from "./product-specs-tabs";
import ProductCardImage from "./product-card-image";
import type { ProductRecord } from "@/features/products/schemas/product.schema";

type ProductDetailViewProps = {
  product: ProductRecord;
  relatedProducts: ProductRecord[];
};

export default function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  // Gallery images array
  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image_path
      ? [product.image_path]
      : [];

  // Discount calculation
  const hasDiscount =
    product.compare_at_price != null &&
    product.compare_at_price > product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : null;

  const savingsAmount = hasDiscount
    ? (product.compare_at_price! - product.price).toFixed(2)
    : null;

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          className="mb-8 flex items-center gap-2 text-xs font-medium text-[#65786c] overflow-x-auto whitespace-nowrap"
        >
          <Link
            href="/"
            className="flex items-center gap-1.5 transition hover:text-[#184633]"
          >
            <Home className="size-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="size-3 text-slate-300 shrink-0" />

          <Link
            href="/categories"
            className="transition hover:text-[#184633]"
          >
            Categories
          </Link>

          {product.category && (
            <>
              <ChevronRight className="size-3 text-slate-300 shrink-0" />
              <Link
                href={`/categories/${product.category.slug}`}
                className="transition hover:text-[#184633]"
              >
                {product.category.name}
              </Link>
            </>
          )}

          <ChevronRight className="size-3 text-slate-300 shrink-0" />
          <span className="font-semibold text-[#183526] truncate max-w-[260px] sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Multi-Image Gallery */}
          <div className="lg:col-span-6 xl:col-span-6">
            <ProductGallery
              title={product.name}
              images={allImages}
              badge={product.badge}
              discountPercent={discountPercent}
              isOutOfStock={isOutOfStock}
            />
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col justify-between lg:col-span-6 xl:col-span-6">
            <div className="space-y-6">
              {/* Category & SKU row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {product.category && (
                  <Link
                    href={`/categories/${product.category.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e4d7] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#184935] shadow-2xs hover:bg-[#eff4ee] transition"
                  >
                    <Tag className="size-3" />
                    {product.category.name}
                  </Link>
                )}

                {product.sku && (
                  <span className="text-xs font-mono text-[#76877b]">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl font-extrabold tracking-tight text-[#142e20] sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              {/* Social Proof (Stars & Rating) */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="size-4 fill-current text-amber-500"
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#1f3729]">
                  {(product.rating || 5.0).toFixed(1)}
                </span>
                <span className="text-xs text-[#738578]">
                  • {product.reviews_count || 1} Customer Reviews
                </span>
              </div>

              {/* Price Block */}
              <div className="rounded-2xl border border-[#e4ebe4] bg-white p-5 shadow-xs">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-black text-[#133c29] sm:text-4xl">
                    ${product.price.toFixed(2)}
                  </span>

                  {hasDiscount && (
                    <>
                      <span className="text-lg font-medium text-slate-400 line-through">
                        ${product.compare_at_price!.toFixed(2)}
                      </span>
                      <span className="rounded-lg bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>

                {hasDiscount && savingsAmount && (
                  <p className="mt-2 text-xs font-medium text-emerald-800">
                    You save ${savingsAmount} on this exclusive order!
                  </p>
                )}
              </div>

              {/* Quick Feature Bullets */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="space-y-2 border-t border-[#ebf1ea] pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#405648]">
                    Key Highlights
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#2b4134]">
                    {product.highlights.slice(0, 3).map((hl, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#174c3a]" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Purchase Actions */}
              <div className="border-t border-[#ebf1ea] pt-6">
                <ProductActions product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Detailed Info Tabs */}
        <div className="mt-16 sm:mt-20">
          <ProductSpecsTabs product={product} />
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 sm:mt-24">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1b4d38] shadow-xs">
                  Recommendations
                </span>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#163324] sm:text-3xl">
                  You May Also Like
                </h2>
              </div>

              {product.category && (
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="text-xs font-semibold text-[#184935] hover:underline"
                >
                  View all in {product.category.name} →
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {relatedProducts.map((rel) => {
                const relDiscount =
                  rel.compare_at_price != null &&
                  rel.compare_at_price > rel.price
                    ? Math.round(
                        ((rel.compare_at_price - rel.price) /
                          rel.compare_at_price) *
                          100
                      )
                    : null;

                return (
                  <Link
                    key={rel.id}
                    href={`/product/${rel.slug || rel.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#e1eae1] bg-white transition hover:-translate-y-1 hover:border-[#b8cdbd] hover:shadow-lg"
                  >
                    <div className="relative aspect-4/5 w-full overflow-hidden bg-[#f7f9f6]">
                      {rel.badge && (
                        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#174c3a] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          {rel.badge}
                        </span>
                      )}
                      {relDiscount && (
                        <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          {relDiscount}% OFF
                        </span>
                      )}
                      <ProductCardImage
                        src={
                          rel.image_path ||
                          (rel.images && rel.images[0]) ||
                          null
                        }
                        alt={rel.name}
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        {rel.category?.name && (
                          <span className="text-[11px] font-medium text-[#6c8072]">
                            {rel.category.name}
                          </span>
                        )}
                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#1a3325] group-hover:text-[#174c3a] transition-colors">
                          {rel.name}
                        </h3>
                      </div>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#143e2b]">
                          ${rel.price.toFixed(2)}
                        </span>
                        {rel.compare_at_price &&
                          rel.compare_at_price > rel.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ${rel.compare_at_price.toFixed(2)}
                            </span>
                          )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

