import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, Layers, Sparkles } from "lucide-react";
import {
  getCachedCategories,
  getCachedCategoryBySlug,
} from "@/features/categories/data/categories";
import { getCachedProductsByCategory } from "@/features/products/data/products";
import CategoryProductView from "@/components/store/category/category-product-view";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCachedCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | Nivaroa",
      description: "The requested category could not be located in our catalog.",
    };
  }

  return {
    title: `${category.name} Collection | Nivaroa`,
    description: `Explore our collection of ${category.name} at Nivaroa. Handpicked, premium essentials made for lasting style and utility.`,
  };
}

export async function generateStaticParams() {
  const categories = await getCachedCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [category, allCategories] = await Promise.all([
    getCachedCategoryBySlug(slug),
    getCachedCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const products = await getCachedProductsByCategory(category.id);

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-20">
      {/* Category Header Hero Banner */}
      <section className="border-b border-[#e7ece5] bg-gradient-to-b from-[#f3f7f2] via-[#eef4ed] to-[#fafbfa] py-10 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumbs"
            className="mb-4 flex items-center gap-1.5 text-xs text-[#6e8275]"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-[#174c3a]"
            >
              <Home className="size-3.5" /> Home
            </Link>
            <ChevronRight className="size-3 text-[#94a59a]" />
            <Link href="/categories" className="hover:text-[#174c3a]">
              Categories
            </Link>
            <ChevronRight className="size-3 text-[#94a59a]" />
            <span className="font-semibold text-[#1f3729]" aria-current="page">
              {category.name}
            </span>
          </nav>

          {/* Heading block */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1b4d38] shadow-xs">
                <Layers className="size-3 text-[#1b4d38]" /> Collection
              </span>
              <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#163324] sm:text-4xl lg:text-5xl">
                {category.name}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5e7366] sm:text-base">
                Explore thoughtfully designed {category.name.toLowerCase()} pieces crafted with responsible materials and timeless comfort.
              </p>
            </div>

            <div className="rounded-2xl border border-[#dbe6db] bg-white/80 px-4 py-2 text-xs font-medium text-[#2d4637] shadow-2xs backdrop-blur-sm">
              <span className="font-bold text-[#174c3a]">{products.length}</span>{" "}
              {products.length === 1 ? "Item" : "Items"} in Catalog
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Products View */}
      <main className="mx-auto max-w-[1440px] px-4 pt-8 sm:px-8 sm:pt-10 lg:px-12">
        <CategoryProductView
          category={category}
          products={products}
          allCategories={allCategories}
        />
      </main>
    </div>
  );
}

