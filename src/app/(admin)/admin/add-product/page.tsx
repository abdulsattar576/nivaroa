import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductForm from "@/features/products/components/product-form";
import { getCategories } from "@/features/categories/data/categories";

export default async function AddProductPage() {
  const { categories } = await getCategories();

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 pb-12 pt-4 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <Button
          variant="ghost"
          render={<Link href="/admin/product" />}
          className="mb-5 -ml-2 h-9 rounded-lg px-3 text-sm text-[#607365] hover:bg-[#eaf0e8]"
        >
          <ArrowLeft aria-hidden="true" /> Back to Products
        </Button>

        <section className="overflow-hidden rounded-3xl border border-[#e8ebe5] bg-white shadow-[0_16px_50px_-35px_rgba(27,48,34,0.3)]">
          <div className="border-b border-[#edf0eb] bg-[#fbfcfa] px-5 py-6 sm:px-8">
            <span className="mb-4 grid size-11 place-items-center rounded-2xl bg-[#eaf2e8] text-[#4f7654]">
              <PackagePlus className="size-5" aria-hidden="true" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-[#203329]">
              Add New Product
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-[#7d8980]">
              Create a catalog product with image format conversion, pricing, and stock details.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <ProductForm categories={categories} />
          </div>
        </section>
      </div>
    </main>
  );
}

