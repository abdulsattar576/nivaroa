"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { CategorySchema, slugify, type CategoryFormData } from "../schemas/category.schema";

async function getAdminClient() {
  const supabase = createClient(await cookies());
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { supabase: null, message: "Please sign in with an administrator account." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    return { supabase: null, message: "You do not have permission to manage categories." };
  }

  return { supabase, message: null };
}

function getMutationMessage(code?: string, operation: "save" | "delete" = "save") {
  if (code === "23505") return "That slug is already in use. Choose a different one.";
  if (code === "23503" && operation === "delete") return "This category is still in use. Reassign its subcategories and products before deleting it.";
  if (code === "23503") return "The selected parent category no longer exists. Choose another parent.";
  if (code === "23514") return "That parent would create a category cycle. Choose a different parent.";
  if (code === "42501") return "Permission denied by database security policy. Administrator rights required.";
  return "The category could not be saved. Please try again.";
}

function validateCategory(input: CategoryFormData) {
  const result = CategorySchema.safeParse(input);
  if (!result.success) {
    return { success: false as const, message: result.error.issues[0]?.message ?? "Check the category details." };
  }

  const slug = slugify(result.data.slug || result.data.name);
  if (!slug) {
    return { success: false as const, message: "Enter a category name that can be used to create a URL slug." };
  }

  return {
    success: true as const,
    data: {
      name: result.data.name,
      slug,
      parent_id: result.data.parent_id || null,
    },
  };
}

export async function createCategory(input: CategoryFormData) {
  const validation = validateCategory(input);
  if (!validation.success) return validation;

  const { supabase, message } = await getAdminClient();
  if (!supabase) return { success: false as const, message: message! };

  const { data, error } = await supabase
    .from("categories")
    .insert(validation.data)
    .select("id")
    .single();

  if (error) return { success: false as const, message: getMutationMessage(error.code) };

  revalidatePath("/admin/categories");
  return { success: true as const, message: "Category created.", id: data.id };
}

export async function updateCategory(id: string, input: CategoryFormData) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { success: false as const, message: "The category could not be found." };
  }

  const validation = validateCategory(input);
  if (!validation.success) return validation;

  const { supabase, message } = await getAdminClient();
  if (!supabase) return { success: false as const, message: message! };

  const { data, error } = await supabase
    .from("categories")
    .update(validation.data)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return { success: false as const, message: getMutationMessage(error.code) };
  if (!data) return { success: false as const, message: "This category no longer exists." };

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${id}/edit`);
  return { success: true as const, message: "Category updated." };
}

export async function deleteCategory(id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { success: false as const, message: "The category could not be found." };
  }

  const { supabase, message } = await getAdminClient();
  if (!supabase) return { success: false as const, message: message! };

  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return { success: false as const, message: getMutationMessage(error.code, "delete") };
  if (!data) return { success: false as const, message: "This category no longer exists." };

  revalidatePath("/admin/categories");
  return { success: true as const, message: "Category deleted." };
}
