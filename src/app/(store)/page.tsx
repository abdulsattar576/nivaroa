import { Leaf, ShieldCheck, Truck } from "lucide-react";
import HeroCarousel from "@/components/store/home/hero-carousel";
import FeaturedCarousel from "@/components/store/home/featured-carousel";
import CategoryProductsSection from "@/components/store/home/category-products-section";
import {
  getCachedFeaturedProducts,
  getCachedCategoriesWithProducts,
} from "@/features/products/data/products";

export default async function HomePage() {
  const [featuredProducts, categoriesWithProducts] = await Promise.all([
    getCachedFeaturedProducts(12),
    getCachedCategoriesWithProducts(5),
  ]);

  return (
    <div className="flex flex-col gap-10 sm:gap-16 pb-16">
      {/* 1. Daraz-Style Hero Autoplay Banner Carousel */}
      <HeroCarousel featuredProducts={featuredProducts} />

      {/* 2. Featured Products Multi-Card Carousel */}
      <div id="featured" className="scroll-mt-24">
        <FeaturedCarousel products={featuredProducts} />
      </div>

      {/* 3. Category-Wise Product Listings (5 Products per Category) */}
      <div id="categories" className="scroll-mt-24">
        <CategoryProductsSection
          categoriesWithProducts={categoriesWithProducts}
        />
      </div>

      {/* 4. Brand Values & Customer Trust Pillars */}
      <section className="border-t border-[#e8ece5] bg-[#fafbf8] py-12 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-4 rounded-2xl border border-[#e8ede6] bg-white p-6 shadow-2xs">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef4ec] text-[#22503a]">
                <Truck className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#1c3325]">Complimentary Shipping</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#6d7e72]">
                  On all orders over $75 with carbon-neutral transit and recycled packaging.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-[#e8ede6] bg-white p-6 shadow-2xs">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef4ec] text-[#22503a]">
                <Leaf className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#1c3325]">Mindfully Sourced</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#6d7e72]">
                  Each piece is responsibly sourced with non-toxic, long-lasting natural fibers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-[#e8ede6] bg-white p-6 shadow-2xs sm:col-span-2 lg:col-span-1">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef4ec] text-[#22503a]">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#1c3325]">30-Day Effortless Returns</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#6d7e72]">
                  Try your selections in the comfort of your home with risk-free exchanges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}