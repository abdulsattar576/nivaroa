import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProducts } from "@/features/products/data/products";
import { getCachedCategories } from "@/features/categories/data/categories";
import CategoryProductView from "@/components/store/category/category-product-view";

export const metadata: Metadata = {
  title: "Shop All Products | Nivaroa",
  description: "Browse the complete collection of apparel, footwear, and essentials at Nivaroa.",
};

type ShopPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams?.category as string | undefined;

  // Seamlessly forward query param requests to the dedicated dynamic category route
  if (categorySlug) {
    redirect(`/categories/${encodeURIComponent(categorySlug)}`);
  }

  const [{ products }, allCategories] = await Promise.all([
    getProducts(),
    getCachedCategories(),
  ]);

  const virtualAllCategory = {
    id: "all",
    name: "All Collections",
    slug: "all",
    parent_id: null,
    created_at: "",
    updated_at: "",
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-20 pt-8 sm:pt-12">
      <main className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1b4d38] shadow-xs">
            Catalog Directory
          </span>
          <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#163324] sm:text-4xl">
            All Products
          </h1>
          <p className="mt-1 text-sm text-[#5f7466]">
            Browse our complete catalog across all departments.
          </p>
        </div>

        <CategoryProductView
          category={virtualAllCategory}
          products={products}
          allCategories={allCategories}
        />
      </main>
    </div>
  );
}