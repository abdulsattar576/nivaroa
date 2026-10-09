import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductForm from "@/features/products/components/product-form";
import { getProductById } from "@/features/products/data/products";
import { getCategories } from "@/features/categories/data/categories";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    notFound();
  }

  const [product, { categories }] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

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
              <PackageCheck className="size-5" aria-hidden="true" />
            </span>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#748779]">
              Edit Product
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#203329]">
              {product.name}
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-[#7d8980]">
              Update product details, pricing, inventory quantity, or product photo.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <ProductForm product={product} categories={categories} />
          </div>
        </section>
      </div>
    </main>
  );
}

