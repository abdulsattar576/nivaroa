"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  LoaderCircle,
  PackagePlus,
  Layers,
  Sparkles,
  Tag,
  ListCheck,
  Sliders,
  Images,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductImageUpload from "./product-image-upload";
import { createProduct, updateProduct } from "../actions/products";
import {
  ProductSchema,
  type ProductFormData,
  type ProductRecord,
} from "../schemas/product.schema";
import type { CategoryRecord } from "@/features/categories/schemas/category.schema";

type ProductFormProps = {
  categories: CategoryRecord[];
  product?: ProductRecord;
};

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Additional text-area fields
  const [highlightsText, setHighlightsText] = useState(
    (product?.highlights || []).join("\n")
  );
  const [specsText, setSpecsText] = useState(
    Object.entries(product?.specifications || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n")
  );
  const [additionalImagesText, setAdditionalImagesText] = useState(
    (product?.images || [])
      .filter((img) => img !== product?.image_path)
      .join("\n")
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      price: product?.price ?? 0,
      compare_at_price: product?.compare_at_price ?? undefined,
      category_id: product?.category_id ?? "",
      quantity: product?.quantity ?? 0,
      sku: product?.sku ?? "",
      badge: product?.badge ?? "",
      product_description: product?.product_description ?? "",
      image_path: product?.image_path ?? "",
      is_featured: product?.is_featured ?? false,
    },
  });

  const onSubmit = async (values: ProductFormData) => {
    setServerError("");
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("slug", values.slug || "");
      formData.append("price", String(values.price));
      if (values.compare_at_price != null && !isNaN(values.compare_at_price)) {
        formData.append("compare_at_price", String(values.compare_at_price));
      }
      formData.append("category_id", values.category_id || "");
      formData.append("quantity", String(values.quantity));
      formData.append("sku", values.sku || "");
      formData.append("badge", values.badge || "");
      formData.append("product_description", values.product_description || "");
      formData.append("image_path", values.image_path || "");
      formData.append("is_featured", String(Boolean(values.is_featured)));

      // Rich detail text areas
      formData.append("highlights", highlightsText);
      formData.append("specifications", specsText);
      formData.append("images", additionalImagesText);

      if (imageFile) {
        formData.append("image_file", imageFile);
      }

      const result = product?.id
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      router.push("/admin/product");
      router.refresh();
    } catch {
      setServerError(
        `Something went wrong while ${
          product ? "updating" : "saving"
        } the product. Please try again.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 1. Basic Information */}
      <div className="rounded-2xl border border-[#e4ebe4] bg-white p-6 shadow-xs">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#1a2f24]">
          <Layers className="size-4.5 text-[#174c3a]" />
          Basic Details
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Title */}
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="product-name" className="text-sm font-medium text-[#26372f]">
              Product title <span className="text-rose-500">*</span>
            </label>
            <Input
              id="product-name"
              placeholder="e.g. Minimalist Cotton Overshirt"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
              className="h-11 rounded-xl border-[#dce5de] bg-white px-3.5 text-sm focus-visible:border-[#438060] focus-visible:ring-[#438060]/15"
            />
            {errors.name && (
              <p className="text-xs text-rose-600" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Slug (URL key) */}
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center justify-between">
              <label htmlFor="product-slug" className="text-sm font-medium text-[#26372f]">
                URL Slug (Optional)
              </label>
              <span className="text-xs text-[#78887d]">
                Auto-generated from title if left blank
              </span>
            </div>
            <Input
              id="product-slug"
              placeholder="e.g. minimalist-cotton-overshirt"
              {...register("slug")}
              className="h-11 rounded-xl border-[#dce5de] bg-[#fafbfa] px-3.5 text-sm text-[#46574c] focus-visible:border-[#438060]"
            />
            {errors.slug && (
              <p className="text-xs text-rose-600" role="alert">
                {errors.slug.message}
              </p>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label htmlFor="product-category" className="text-sm font-medium text-[#26372f]">
              Department / Category
            </label>
            <select
              id="product-category"
              {...register("category_id")}
              className="h-11 w-full rounded-xl border border-[#dce5de] bg-white px-3.5 text-sm text-[#334238] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
            >
              <option value="">Select a category (optional)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Marketing Badge */}
          <div className="space-y-2">
            <label htmlFor="product-badge" className="text-sm font-medium text-[#26372f]">
              Promotional Badge (Optional)
            </label>
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="product-badge"
                placeholder="e.g. Bestseller, 20% OFF, New"
                {...register("badge")}
                className="h-11 rounded-xl border-[#dce5de] bg-white pl-9 pr-3.5 text-sm focus-visible:border-[#438060]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Pricing & Inventory */}
      <div className="rounded-2xl border border-[#e4ebe4] bg-white p-6 shadow-xs">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#1a2f24]">
          <Tag className="size-4.5 text-[#174c3a]" />
          Pricing & Inventory
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Current Selling Price */}
          <div className="space-y-2">
            <label htmlFor="product-price" className="text-sm font-medium text-[#26372f]">
              Selling Price (USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#728378]">
                $
              </span>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="49.99"
                {...register("price", { valueAsNumber: true })}
                className="h-11 rounded-xl border-[#dce5de] bg-white pl-8 pr-3.5 text-sm focus-visible:border-[#438060]"
              />
            </div>
            {errors.price && (
              <p className="text-xs text-rose-600" role="alert">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Original / Compare-at Price */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="product-compare-price" className="text-sm font-medium text-[#26372f]">
                Compare-at Price (USD)
              </label>
              <span className="text-xs text-[#78887d]">Original price (shows discount)</span>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#728378]">
                $
              </span>
              <Input
                id="product-compare-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="69.99"
                {...register("compare_at_price", { valueAsNumber: true })}
                className="h-11 rounded-xl border-[#dce5de] bg-white pl-8 pr-3.5 text-sm focus-visible:border-[#438060]"
              />
            </div>
          </div>

          {/* Inventory Stock */}
          <div className="space-y-2">
            <label htmlFor="product-quantity" className="text-sm font-medium text-[#26372f]">
              Inventory Stock (units) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="product-quantity"
              type="number"
              min="0"
              step="1"
              placeholder="100"
              {...register("quantity", { valueAsNumber: true })}
              className="h-11 rounded-xl border-[#dce5de] bg-white px-3.5 text-sm focus-visible:border-[#438060]"
            />
            {errors.quantity && (
              <p className="text-xs text-rose-600" role="alert">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <label htmlFor="product-sku" className="text-sm font-medium text-[#26372f]">
              SKU (Stock Keeping Unit)
            </label>
            <Input
              id="product-sku"
              placeholder="e.g. NVR-CTN-01"
              {...register("sku")}
              className="h-11 rounded-xl border-[#dce5de] bg-white px-3.5 text-sm focus-visible:border-[#438060]"
            />
          </div>
        </div>
      </div>

      {/* 3. Description, Highlights & Specifications */}
      <div className="rounded-2xl border border-[#e4ebe4] bg-white p-6 shadow-xs">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#1a2f24]">
          <ListCheck className="size-4.5 text-[#174c3a]" />
          Product Highlights & Specifications
        </h3>
        <div className="space-y-5">
          {/* Main Description */}
          <div className="space-y-2">
            <label htmlFor="product-description" className="text-sm font-medium text-[#26372f]">
              Full Description
            </label>
            <textarea
              id="product-description"
              rows={4}
              placeholder="Describe product craftsmanship, comfort, styling suggestions, and story…"
              {...register("product_description")}
              className="w-full rounded-xl border border-[#dce5de] bg-white p-3.5 text-sm text-[#334238] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
            />
          </div>

          {/* Key Bullet Highlights */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="product-highlights" className="text-sm font-medium text-[#26372f]">
                Key Highlights (1 bullet per line)
              </label>
              <span className="text-xs text-[#78887d]">Shows bullet points on product page</span>
            </div>
            <textarea
              id="product-highlights"
              rows={3}
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              placeholder="100% Organic Breathable Cotton&#10;Tailored relaxed unisex silhouette&#10;Pre-shrunk for enduring wear&#10;Machine washable at 30°C"
              className="w-full rounded-xl border border-[#dce5de] bg-[#fbfdfb] p-3.5 font-mono text-xs text-[#2b3c31] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
            />
          </div>

          {/* Technical Specifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="product-specs" className="text-sm font-medium text-[#26372f]">
                Specifications (<span className="font-mono">Key: Value</span> per line)
              </label>
              <span className="text-xs text-[#78887d]">Rendered in specifications table</span>
            </div>
            <textarea
              id="product-specs"
              rows={3}
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              placeholder="Material: 100% Organic Combed Cotton&#10;Fit: Relaxed Fit&#10;Origin: Ethically Made in Portugal&#10;Care: Cold Machine Wash"
              className="w-full rounded-xl border border-[#dce5de] bg-[#fbfdfb] p-3.5 font-mono text-xs text-[#2b3c31] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
            />
          </div>
        </div>
      </div>

      {/* 4. Media & Gallery */}
      <div className="rounded-2xl border border-[#e4ebe4] bg-white p-6 shadow-xs">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#1a2f24]">
          <Images className="size-4.5 text-[#174c3a]" />
          Product Imagery & Gallery
        </h3>
        <div className="space-y-5">
          {/* Primary image upload */}
          <div>
            <p className="mb-2 text-sm font-medium text-[#26372f]">Primary Featured Image</p>
            <ProductImageUpload
              onImageSelected={(file) => setImageFile(file)}
              onClearExistingImage={() => setValue("image_path", "")}
              defaultImageUrl={product?.image_path}
            />
          </div>

          {/* Additional image URLs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="product-images" className="text-sm font-medium text-[#26372f]">
                Additional Gallery Image URLs (1 URL per line)
              </label>
              <span className="text-xs text-[#78887d]">Thumbnail gallery items</span>
            </div>
            <textarea
              id="product-images"
              rows={3}
              value={additionalImagesText}
              onChange={(e) => setAdditionalImagesText(e.target.value)}
              placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
              className="w-full rounded-xl border border-[#dce5de] bg-[#fbfdfb] p-3.5 font-mono text-xs text-[#2b3c31] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
            />
          </div>
        </div>
      </div>

      {/* 5. Featured Highlight */}
      <div className="rounded-2xl border border-[#e4ebe4] bg-[#fbfcfb] p-5 shadow-xs">
        <label
          htmlFor="product-featured"
          className="flex cursor-pointer items-start gap-3"
        >
          <input
            id="product-featured"
            type="checkbox"
            {...register("is_featured")}
            className="mt-0.5 size-4.5 rounded border-gray-300 text-[#174c3a] accent-[#174c3a] focus:ring-[#174c3a]"
          />
          <div className="text-sm">
            <span className="font-semibold text-[#1a2e22]">Feature on Homepage & Carousels</span>
            <p className="mt-0.5 text-xs text-[#718276]">
              Promote this item directly into the hero slider and curated essentials showcase.
            </p>
          </div>
        </label>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          {serverError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-[#edf0eb] pt-5 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          render={<Link href="/admin/product" />}
          className="h-11 rounded-xl px-4 text-sm"
        >
          <ArrowLeft aria-hidden="true" /> Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="h-11 rounded-xl bg-[#174c3a] px-7 text-sm font-semibold text-white shadow-sm hover:bg-[#103d31]"
        >
          {isSaving ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <PackagePlus aria-hidden="true" />
          )}
          {isSaving
            ? product
              ? "Updating product…"
              : "Saving product…"
            : product
            ? "Update Product"
            : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
