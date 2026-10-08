import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { ProductRecord } from "../schemas/product.schema";

export async function getProducts(): Promise<{
  products: ProductRecord[];
  error: string | null;
}> {
  const supabase = createClient(await cookies());

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      category_id,
      image_path,
      product_description,
      quantity,
      created_at,
      updated_at,
      category:categories(id, name, slug)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return { products: [], error: "Products could not be loaded." };
  }

  // Safely map Supabase response
  const products = (data ?? []).map((item: any) => ({
    ...item,
    price: Number(item.price),
    category: Array.isArray(item.category) ? item.category[0] ?? null : item.category ?? null,
  })) as ProductRecord[];

  return { products, error: null };
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const supabase = createClient(await cookies());

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      category_id,
      image_path,
      product_description,
      quantity,
      created_at,
      updated_at,
      category:categories(id, name, slug)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    ...data,
    price: Number(data.price),
    category: Array.isArray(data.category) ? data.category[0] ?? null : data.category ?? null,
  } as ProductRecord;
}

