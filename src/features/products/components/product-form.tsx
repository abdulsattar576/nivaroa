"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, PackagePlus, DollarSign, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageConverterUpload from "./image-converter-upload";
import { createProduct } from "../actions/products";
import { ProductSchema, type ProductFormData, type ProductRecord } from "../schemas/product.schema";
import type { CategoryRecord } from "@/features/categories/schemas/category.schema";

type ProductFormProps = {
  categories: CategoryRecord[];
  product?: ProductRecord;
};

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [convertedImageFile, setConvertedImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ?? 0,
      category_id: product?.category_id ?? "",
      quantity: product?.quantity ?? 0,
      product_description: product?.product_description ?? "",
      image_path: product?.image_path ?? "",
    },
  });

  const onSubmit = async (values: ProductFormData) => {
    setServerError("");
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", String(values.price));
      formData.append("category_id", values.category_id || "");
      formData.append("quantity", String(values.quantity));
      formData.append("product_description", values.product_description || "");
      formData.append("image_path", values.image_path || "");

      if (convertedImageFile) {
        formData.append("image_file", convertedImageFile);
      }

      const result = await createProduct(formData);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      router.push("/admin/product");
      router.refresh();
    } catch {
      setServerError("Something went wrong while saving the product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Product Basic Details */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="product-name" className="text-sm font-medium text-[#26372f]">
            Product title <span className="text-rose-500">*</span>
          </label>
          <Input
            id="product-name"
            placeholder="e.g. Minimalist Cotton Overshirt"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "product-name-error" : undefined}
            {...register("name")}
            className="h-11 rounded-xl border-[#dce5de] bg-white px-3.5 text-sm focus-visible:border-[#438060] focus-visible:ring-[#438060]/15"
          />
          {errors.name && (
            <p id="product-name-error" className="text-xs text-rose-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Price ($) */}
        <div className="space-y-2">
          <label htmlFor="product-price" className="text-sm font-medium text-[#26372f]">
            Price (USD) <span className="text-rose-500">*</span>
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
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? "product-price-error" : undefined}
              {...register("price", { valueAsNumber: true })}
              className="h-11 rounded-xl border-[#dce5de] bg-white pl-8 pr-3.5 text-sm focus-visible:border-[#438060] focus-visible:ring-[#438060]/15"
            />
          </div>
          {errors.price && (
            <p id="product-price-error" className="text-xs text-rose-600" role="alert">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Stock Quantity */}
        <div className="space-y-2">
          <label htmlFor="product-quantity" className="text-sm font-medium text-[#26372f]">
            Inventory Stock (units)
          </label>
          <Input
            id="product-quantity"
            type="number"
            min="0"
            step="1"
            placeholder="100"
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={errors.quantity ? "product-quantity-error" : undefined}
            {...register("quantity", { valueAsNumber: true })}
            className="h-11 rounded-xl border-[#dce5de] bg-white px-3.5 text-sm focus-visible:border-[#438060] focus-visible:ring-[#438060]/15"
          />
          {errors.quantity && (
            <p id="product-quantity-error" className="text-xs text-rose-600" role="alert">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Category Selector */}
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="product-category" className="text-sm font-medium text-[#26372f]">
            Category
          </label>
          <select
            id="product-category"
            {...register("category_id")}
            aria-invalid={Boolean(errors.category_id)}
            className="h-11 w-full rounded-xl border border-[#dce5de] bg-white px-3.5 text-sm text-[#334238] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
          >
            <option value="">Select a category (optional)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-xs text-rose-600" role="alert">
              {errors.category_id.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="product-description" className="text-sm font-medium text-[#26372f]">
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            placeholder="Describe the product materials, fit, care instructions, and features…"
            {...register("product_description")}
            className="w-full rounded-xl border border-[#dce5de] bg-white p-3.5 text-sm text-[#334238] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
          />
          {errors.product_description && (
            <p className="text-xs text-rose-600" role="alert">
              {errors.product_description.message}
            </p>
          )}
        </div>
      </div>

      {/* Image Uploader & Built-In Format Converter */}
      <ImageConverterUpload
        onFileReady={(file) => setConvertedImageFile(file)}
        defaultImageUrl={product?.image_path}
      />

      {serverError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {serverError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-[#edf0eb] pt-5 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          render={<Link href="/admin/product" />}
          className="h-10 rounded-xl px-4 text-sm"
        >
          <ArrowLeft aria-hidden="true" /> Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="h-10 rounded-xl bg-[#174c3a] px-6 text-sm text-white hover:bg-[#103d31]"
        >
          {isSaving ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <PackagePlus aria-hidden="true" />
          )}
          {isSaving ? "Saving product & uploading…" : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
