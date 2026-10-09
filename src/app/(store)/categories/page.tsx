import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Home, Layers, Package, Sparkles } from "lucide-react";
import { getCachedCategories } from "@/features/categories/data/categories";
import { getCachedCategoriesWithProducts } from "@/features/products/data/products";

export const metadata: Metadata = {
  title: "All Categories | Nivaroa",
  description: "Browse all curated collections and categories at Nivaroa.",
};

export default async function CategoriesDirectoryPage() {
  const [categories, categoriesWithProducts] = await Promise.all([
    getCachedCategories(),
    getCachedCategoriesWithProducts(5),
  ]);

  // Map category ID to product count or preview products
  const productCountMap = new Map<string, number>();
  for (const item of categoriesWithProducts) {
    productCountMap.set(item.id, item.products.length);
  }

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-20">
      {/* Header Banner */}
      <section className="border-b border-[#e6ebe4] bg-gradient-to-b from-[#f2f7f1] via-[#edf3ec] to-[#fafbfa] py-12 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="mb-4 flex items-center gap-1.5 text-xs text-[#6e8275]">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-[#174c3a]">
              <Home className="size-3.5" /> Home
            </Link>
            <ChevronRight className="size-3 text-[#94a59a]" />
            <span className="font-semibold text-[#1f3729]" aria-current="page">
              Categories
            </span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1b4d38] shadow-xs">
            <Layers className="size-3 text-[#1b4d38]" /> Department Directory
          </span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#163324] sm:text-4xl lg:text-5xl">
            Explore All Categories
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5e7366] sm:text-base">
            Discover all departments and curated wardrobes tailored for timeless everyday comfort.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <main className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-8 lg:px-12">
        {categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#ccd8cb] bg-white px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eff4ee] text-[#194c3a]">
              <Package className="size-7" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-[#1e3527]">No categories created yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#748779]">
              Categories will appear here once added in the management dashboard.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#174c3a] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#103d31]"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {categories.map((cat, idx) => {
              const productCount = productCountMap.get(cat.id) || 0;
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e2eae0] bg-white p-6 shadow-2xs transition-all duration-300 hover:border-[#174c3a] hover:shadow-md hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-xl bg-[#edf4ec] text-[#1c4d37] transition group-hover:bg-[#174c3a] group-hover:text-white">
                        <Layers className="size-5" />
                      </span>
                      <span className="rounded-full bg-[#f2f6f1] px-2.5 py-1 text-[11px] font-semibold text-[#486350]">
                        {productCount > 0 ? `${productCount}+ items` : "Catalog"}
                      </span>
                    </div>

                    <h2 className="mt-5 text-lg font-bold text-[#1b3425] transition-colors group-hover:text-[#174c3a]">
                      {cat.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#728578]">
                      Browse top essentials and featured releases in our {cat.name.toLowerCase()} collection.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 border-t border-[#edf2ea] pt-4 text-xs font-semibold text-[#174c3a]">
                    Explore collection
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

