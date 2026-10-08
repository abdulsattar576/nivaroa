import Link from "next/link";
import { ArrowLeft, FolderPen } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import CategoryForm from "@/features/categories/components/category-form";
import { collectDescendantIds, flattenCategoryOptions, getCategories, getCategoryById } from "@/features/categories/data/categories";

export default async function EditCategoryPage({ params }: PageProps<"/admin/categories/[id]/edit">) {
  const { id } = await params;
  const [category, result] = await Promise.all([getCategoryById(id), getCategories()]);

  if (!category || result.error) notFound();

  const excludedIds = collectDescendantIds(result.categories, id);
  excludedIds.add(id);
  const parentOptions = flattenCategoryOptions(result.categories, excludedIds);

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 pb-12 pt-4 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" render={<Link href="/admin/categories" />} className="mb-5 -ml-2 h-9 rounded-lg px-3 text-sm text-[#607365] hover:bg-[#eaf0e8]">
          <ArrowLeft aria-hidden="true" /> Categories
        </Button>
        <section className="overflow-hidden rounded-3xl border border-[#e8ebe5] bg-white shadow-[0_16px_50px_-35px_rgba(27,48,34,0.3)]">
          <div className="border-b border-[#edf0eb] bg-[#fbfcfa] px-5 py-6 sm:px-8">
            <span className="mb-4 grid size-11 place-items-center rounded-2xl bg-[#eaf2e8] text-[#4f7654]"><FolderPen className="size-5" aria-hidden="true" /></span>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#748779]">Edit category</p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#203329]">{category.name}</h1>
            <p className="mt-1.5 text-sm leading-6 text-[#7d8980]">Update its details or move it to another parent in the category tree.</p>
          </div>
          <div className="p-5 sm:p-8">
            <CategoryForm category={category} parentOptions={parentOptions} />
          </div>
        </section>
      </div>
    </main>
  );
}
