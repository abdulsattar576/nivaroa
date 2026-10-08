import Link from "next/link";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import CategoryForm from "@/features/categories/components/category-form";
import { flattenCategoryOptions, getCategories } from "@/features/categories/data/categories";

export default async function NewCategoryPage() {
  const { categories, error } = await getCategories();

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 pb-12 pt-4 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" render={<Link href="/admin/categories" />} className="mb-5 -ml-2 h-9 rounded-lg px-3 text-sm text-[#607365] hover:bg-[#eaf0e8]">
          <ArrowLeft aria-hidden="true" /> Categories
        </Button>
        <section className="overflow-hidden rounded-3xl border border-[#e8ebe5] bg-white shadow-[0_16px_50px_-35px_rgba(27,48,34,0.3)]">
          <div className="border-b border-[#edf0eb] bg-[#fbfcfa] px-5 py-6 sm:px-8">
            <span className="mb-4 grid size-11 place-items-center rounded-2xl bg-[#eaf2e8] text-[#4f7654]"><FolderPlus className="size-5" aria-hidden="true" /></span>
            <h1 className="text-2xl font-semibold tracking-tight text-[#203329]">Create a category</h1>
            <p className="mt-1.5 text-sm leading-6 text-[#7d8980]">Add a catalog category or choose a parent to create a nested subcategory.</p>
          </div>
          <div className="p-5 sm:p-8">
            {error && (
              <div role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                Notice: Could not load existing parent categories ({error}). You can still create a top-level category.
              </div>
            )}
            <CategoryForm parentOptions={flattenCategoryOptions(categories)} />
          </div>
        </section>
      </div>
    </main>
  );
}
