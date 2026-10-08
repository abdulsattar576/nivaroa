"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory, updateCategory } from "../actions/categories";
import { CategorySchema, slugify, type CategoryFormData, type CategoryRecord } from "../schemas/category.schema";

type ParentOption = { id: string; name: string; path: string };

type CategoryFormProps = {
  category?: CategoryRecord;
  parentOptions: ParentOption[];
};

const CategoryForm = ({ category, parentOptions }: CategoryFormProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isManuallyEditedSlug, setIsManuallyEditedSlug] = useState(Boolean(category?.slug));
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      parent_id: category?.parent_id ?? "",
    },
  });

  const watchedName = watch("name") ?? "";
  const watchedSlug = watch("slug") ?? "";
  const effectiveSlug = watchedSlug ? slugify(watchedSlug) : slugify(watchedName);

  const onSubmit = async (values: CategoryFormData) => {
    setServerError("");
    setIsSaving(true);

    try {
      const result = category
        ? await updateCategory(category.id, values)
        : await createCategory(values);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      router.push("/admin/categories");
      router.refresh();
    } catch {
      setServerError("Something went wrong while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="category-name" className="text-sm font-medium text-[#26372f]">Category name</label>
        <Input
          id="category-name"
          placeholder="e.g. Home & living"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "category-name-error" : undefined}
          {...register("name", {
            onChange: (e) => {
              if (!isManuallyEditedSlug) {
                setValue("slug", slugify(e.target.value), { shouldValidate: false });
              }
            },
          })}
          className="h-11 rounded-xl border-[#dce5de] bg-white px-3.5 text-sm focus-visible:border-[#438060] focus-visible:ring-[#438060]/15"
        />
        {errors.name && <p id="category-name-error" className="text-xs text-rose-600" role="alert">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="category-slug" className="text-sm font-medium text-[#26372f]">URL slug</label>
          {isManuallyEditedSlug && watchedName && (
            <button
              type="button"
              onClick={() => {
                setValue("slug", slugify(watchedName), { shouldValidate: true });
                setIsManuallyEditedSlug(false);
              }}
              className="text-xs text-[#285d38] underline hover:text-[#184526]"
            >
              Reset to name
            </button>
          )}
        </div>
        <Input
          id="category-slug"
          placeholder="e.g. home-living"
          aria-invalid={Boolean(errors.slug)}
          aria-describedby={errors.slug ? "category-slug-error" : "category-slug-hint"}
          {...register("slug", {
            onChange: (e) => {
              setIsManuallyEditedSlug(Boolean(e.target.value.trim()));
            },
            onBlur: (e) => {
              if (e.target.value) {
                setValue("slug", slugify(e.target.value), { shouldValidate: true });
              }
            },
          })}
          className="h-11 rounded-xl border-[#dce5de] bg-white px-3.5 text-sm focus-visible:border-[#438060] focus-visible:ring-[#438060]/15"
        />
        {errors.slug ? (
          <p id="category-slug-error" className="text-xs text-rose-600" role="alert">{errors.slug.message}</p>
        ) : (
          <p id="category-slug-hint" className="text-xs text-slate-500">Auto-generated or custom. Must be lowercase letters, numbers, and hyphens.</p>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-[#e1eae0] bg-[#f7f9f6] px-3.5 py-2 text-xs text-[#486350]">
          <span className="font-medium text-[#2d4234]">Storefront URL preview:</span>
          <span className="font-mono text-[#285d38]">
            /shop/{effectiveSlug || "category-slug"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="category-parent" className="text-sm font-medium text-[#26372f]">Parent category <span className="font-normal text-slate-400">(optional)</span></label>
        <select
          id="category-parent"
          {...register("parent_id")}
          aria-invalid={Boolean(errors.parent_id)}
          aria-describedby={errors.parent_id ? "category-parent-error" : undefined}
          className="h-11 w-full rounded-xl border border-[#dce5de] bg-white px-3.5 text-sm text-[#334238] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10 aria-invalid:border-rose-400"
        >
          <option value="">No parent — top-level category</option>
          {parentOptions.map((option) => (
            <option key={option.id} value={option.id}>{option.path}</option>
          ))}
        </select>
        {errors.parent_id && <p id="category-parent-error" className="text-xs text-rose-600" role="alert">{errors.parent_id.message}</p>}
        <p className="text-xs text-slate-500">Select a parent to make this a subcategory. Nested levels are supported.</p>
      </div>

      {category && parentOptions.length === 0 && <p className="text-xs text-slate-500">No other categories are available as parents.</p>}
      {serverError && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{serverError}</p>}

      <div className="flex flex-col-reverse gap-3 border-t border-[#edf0eb] pt-5 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" render={<Link href="/admin/categories" />} className="h-10 rounded-xl px-4 text-sm">
          <ArrowLeft aria-hidden="true" /> Cancel
        </Button>
        <Button type="submit" disabled={isSaving} className="h-10 rounded-xl bg-[#174c3a] px-5 text-sm text-white hover:bg-[#103d31]">
          {isSaving ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
          {isSaving ? "Saving…" : category ? "Save changes" : "Create category"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
