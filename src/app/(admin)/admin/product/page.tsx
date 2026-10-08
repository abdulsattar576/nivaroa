import Link from "next/link";
import Image from "next/image";
import { Package, PackagePlus, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteProductButton from "@/features/products/components/delete-product-button";
import { getProducts } from "@/features/products/data/products";

export default async function AdminProductsPage() {
  const { products, error } = await getProducts();

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 pb-12 pt-4 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#64806d]">
              Catalog Management
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#192b21]">Products</h1>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#748078]">
              Manage inventory, pricing, images, and category assignments.
            </p>
          </div>
          <Button
            render={<Link href="/admin/add-product" />}
            className="h-10 w-fit rounded-xl bg-[#174c3a] px-4 text-sm text-white hover:bg-[#103d31]"
          >
            <PackagePlus aria-hidden="true" /> Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e8ebe5] bg-white p-4">
            <p className="text-xs font-medium text-[#879289]">Total Products</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#203329]">
              {products.length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#e8ebe5] bg-white p-4">
            <p className="text-xs font-medium text-[#879289]">In Stock Units</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#203329]">
              {products.reduce((acc, p) => acc + (p.quantity || 0), 0)}
            </p>
          </div>
          <div className="rounded-2xl border border-[#e8ebe5] bg-white p-4">
            <p className="text-xs font-medium text-[#879289]">Low Stock Alert (&lt; 5)</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight text-amber-700">
              {products.filter((p) => (p.quantity || 0) < 5).length}
            </p>
          </div>
        </div>

        {error ? (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#ccd8cb] bg-white px-6 py-16 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#edf3e9] text-[#527751]">
              <Package className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-[#2c4032]">No products in your catalog</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7e8b80]">
              Add your first product with converted images and start selling online.
            </p>
            <Button
              render={<Link href="/admin/add-product" />}
              className="mt-5 h-10 rounded-xl bg-[#174c3a] px-4 text-white hover:bg-[#103d31]"
            >
              <PackagePlus aria-hidden="true" /> Add Product
            </Button>
          </div>
        ) : (
          <section className="overflow-hidden rounded-3xl border border-[#e8ebe5] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#edf0eb] bg-[#fbfcfa] text-xs font-medium text-[#738276]">
                  <tr>
                    <th className="px-5 py-3.5">Product</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Price</th>
                    <th className="px-5 py-3.5">Inventory</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0eb]">
                  {products.map((p) => (
                    <tr key={p.id} className="transition hover:bg-[#f8faf7]">
                      {/* Product details & thumbnail */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-[#e1eae0] bg-slate-100">
                            {p.image_path ? (
                              <Image
                                src={p.image_path}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="grid size-full place-items-center text-slate-400">
                                <Package className="size-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#22352a]">{p.name}</p>
                            {p.product_description && (
                              <p className="mt-0.5 line-clamp-1 text-xs text-[#828f85]">
                                {p.product_description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        {p.category ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f4ef] px-2.5 py-0.5 text-xs font-medium text-[#56685a]">
                            <Tag className="size-3" /> {p.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Uncategorized</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-semibold text-[#1e3427]">
                        ${Number(p.price).toFixed(2)}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.quantity > 5
                              ? "bg-emerald-50 text-emerald-700"
                              : p.quantity > 0
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {p.quantity > 0 ? `${p.quantity} in stock` : "Out of stock"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <DeleteProductButton id={p.id} name={p.name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

