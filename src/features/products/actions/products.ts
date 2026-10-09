"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { ProductSchema, type ProductFormData } from "../schemas/product.schema";

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
    return { supabase: null, message: "You do not have permission to manage products." };
  }

  return { supabase, message: null };
}

/**
 * Uploads an image file to the Supabase Storage 'products' bucket
 */
async function uploadProductImage(
  supabase: NonNullable<Awaited<ReturnType<typeof getAdminClient>>["supabase"]>,
  file: File,
  productName: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize file name
    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    const cleanName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "product";

    const fileName = `${Date.now()}-${cleanName}.${ext}`;
    const filePath = `catalog/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type || "image/webp",
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: `Image upload failed: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err) {
    return {
      url: null,
      error: err instanceof Error ? err.message : "Error processing image upload",
    };
  }
}

/**
 * Creates a new product. Accepts FormData to seamlessly support
 * text fields alongside converted binary image files.
 */
export async function createProduct(formData: FormData) {
  const { supabase, message } = await getAdminClient();
  if (!supabase) return { success: false as const, message: message! };

  const rawData: Record<string, unknown> = {
    name: (formData.get("name") as string) || "",
    price: Number(formData.get("price")),
    category_id: (formData.get("category_id") as string) || "",
    quantity: Number(formData.get("quantity") || 0),
    product_description: (formData.get("product_description") as string) || "",
    image_path: (formData.get("image_path") as string) || "",
    is_featured: formData.get("is_featured") === "true",
  };

  const validation = ProductSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false as const,
      message: validation.error.issues[0]?.message ?? "Please check product details.",
    };
  }

  let finalImagePath: string | null = (validation.data.image_path as string) || null;

  // Handle uploaded image file if present in FormData
  const imageFile = formData.get("image_file");
  if (imageFile instanceof File && imageFile.size > 0) {
    const uploadResult = await uploadProductImage(
      supabase,
      imageFile,
      validation.data.name
    );

    if (uploadResult.error) {
      return { success: false as const, message: uploadResult.error };
    }
    finalImagePath = uploadResult.url;
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: validation.data.name,
      price: validation.data.price,
      category_id: validation.data.category_id || null,
      quantity: validation.data.quantity,
      product_description: validation.data.product_description || null,
      image_path: finalImagePath,
      is_featured: validation.data.is_featured,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "42501") {
      return {
        success: false as const,
        message: "Permission denied by database security policy. Administrator rights required.",
      };
    }
    return { success: false as const, message: error.message || "Failed to create product." };
  }

  revalidatePath("/");
  revalidatePath("/admin/product");
  revalidatePath("/admin/add-product");
  revalidatePath("/shop");

  return {
    success: true as const,
    message: "Product created successfully.",
    id: data.id,
  };
}

/**
 * Updates an existing product by ID
 */
export async function updateProduct(id: string, formData: FormData) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { success: false as const, message: "Invalid product identifier." };
  }

  const { supabase, message } = await getAdminClient();
  if (!supabase) return { success: false as const, message: message! };

  const rawData: Record<string, unknown> = {
    name: (formData.get("name") as string) || "",
    price: Number(formData.get("price")),
    category_id: (formData.get("category_id") as string) || "",
    quantity: Number(formData.get("quantity") || 0),
    product_description: (formData.get("product_description") as string) || "",
    image_path: (formData.get("image_path") as string) || "",
    is_featured: formData.get("is_featured") === "true",
  };

  const validation = ProductSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false as const,
      message: validation.error.issues[0]?.message ?? "Please check product details.",
    };
  }

  let finalImagePath: string | null = (validation.data.image_path as string) || null;

  // Handle uploaded new image file if present in FormData
  const imageFile = formData.get("image_file");
  if (imageFile instanceof File && imageFile.size > 0) {
    const uploadResult = await uploadProductImage(
      supabase,
      imageFile,
      validation.data.name
    );

    if (uploadResult.error) {
      return { success: false as const, message: uploadResult.error };
    }
    finalImagePath = uploadResult.url;
  }

  const { error } = await supabase
    .from("products")
    .update({
      name: validation.data.name,
      price: validation.data.price,
      category_id: validation.data.category_id || null,
      quantity: validation.data.quantity,
      product_description: validation.data.product_description || null,
      image_path: finalImagePath,
      is_featured: validation.data.is_featured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "42501") {
      return {
        success: false as const,
        message: "Permission denied by database security policy. Administrator rights required.",
      };
    }
    return { success: false as const, message: error.message || "Failed to update product." };
  }

  revalidatePath("/");
  revalidatePath("/admin/product");
  revalidatePath("/admin/add-product");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/admin/product/${id}/edit`);
  revalidatePath("/shop");

  return {
    success: true as const,
    message: "Product updated successfully.",
  };
}

/**
 * Deletes a product by ID
 */
export async function deleteProduct(id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { success: false as const, message: "The product could not be found." };
  }

  const { supabase, message } = await getAdminClient();
  if (!supabase) return { success: false as const, message: message! };

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    if (error.code === "42501") {
      return {
        success: false as const,
        message: "Permission denied by database security policy. Administrator rights required.",
      };
    }
    return { success: false as const, message: "Could not delete product." };
  }

  revalidatePath("/admin/product");
  revalidatePath("/shop");
  return { success: true as const, message: "Product deleted." };
}
