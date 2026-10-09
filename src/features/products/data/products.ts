import "server-only";

import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import type { ProductRecord } from "../schemas/product.schema";

function getPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, key);
}

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
      is_featured,
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
    is_featured: Boolean(item.is_featured),
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
      is_featured,
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
    is_featured: Boolean(data.is_featured),
    category: Array.isArray(data.category) ? data.category[0] ?? null : data.category ?? null,
  } as ProductRecord;
}

/**
 * Fetches featured products for homepage carousel and highlights
 */
export async function getFeaturedProducts(limit = 8): Promise<ProductRecord[]> {
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
      is_featured,
      created_at,
      updated_at,
      category:categories(id, name, slug)
    `)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((item: any) => ({
    ...item,
    price: Number(item.price),
    is_featured: Boolean(item.is_featured),
    category: Array.isArray(item.category) ? item.category[0] ?? null : item.category ?? null,
  })) as ProductRecord[];
}

/**
 * Returns cached featured products for public homepage and storefront highlights.
 * Uses Next.js unstable_cache with tag 'featured-products' to prevent unnecessary API calls.
 */
export const getCachedFeaturedProducts = unstable_cache(
  async (limit = 10): Promise<ProductRecord[]> => {
    try {
      const supabase = getPublicSupabaseClient();
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
          is_featured,
          created_at,
          updated_at,
          category:categories(id, name, slug)
        `)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error || !data) return [];

      return data.map((item: any) => ({
        ...item,
        price: Number(item.price),
        is_featured: Boolean(item.is_featured),
        category: Array.isArray(item.category) ? item.category[0] ?? null : item.category ?? null,
      })) as ProductRecord[];
    } catch {
      return [];
    }
  },
  ["featured-products"],
  {
    tags: ["products", "featured-products"],
    revalidate: 3600,
  }
);

export type CategoryWithProducts = {
  id: string;
  name: string;
  slug: string;
  products: ProductRecord[];
};

/**
 * Returns categories that have products, with up to `limitPerCategory` products each.
 * Cached via unstable_cache with 'categories' and 'products' tags to prevent redundant database queries.
 */
export const getCachedCategoriesWithProducts = unstable_cache(
  async (limitPerCategory = 5): Promise<CategoryWithProducts[]> => {
    try {
      const supabase = getPublicSupabaseClient();

      // Query categories with their nested products
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select(`
          id,
          name,
          slug,
          products (
            id,
            name,
            price,
            quantity,
            image_path,
            product_description,
            is_featured,
            created_at,
            updated_at
          )
        `)
        .order("name", { ascending: true });

      if (catError || !categories) {
        // Fallback: fetch products directly and group by category
        const { data: products } = await supabase
          .from("products")
          .select(`
            id,
            name,
            price,
            quantity,
            image_path,
            product_description,
            is_featured,
            created_at,
            updated_at,
            category_id,
            category:categories(id, name, slug)
          `)
          .order("created_at", { ascending: false });

        if (!products || products.length === 0) return [];

        const groupMap = new Map<string, CategoryWithProducts>();
        for (const p of products) {
          const cat = Array.isArray(p.category) ? p.category[0] : p.category;
          if (!cat) continue;
          if (!groupMap.has(cat.id)) {
            groupMap.set(cat.id, {
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              products: [],
            });
          }
          const group = groupMap.get(cat.id)!;
          if (group.products.length < limitPerCategory) {
            group.products.push({
              ...p,
              price: Number(p.price),
              is_featured: Boolean(p.is_featured),
              category: cat,
            } as ProductRecord);
          }
        }
        return Array.from(groupMap.values());
      }

      const result: CategoryWithProducts[] = [];
      for (const cat of categories) {
        const rawProducts = (cat.products as any[]) || [];
        if (rawProducts.length === 0) continue;

        // Sort latest first and slice limitPerCategory (5)
        const sorted = rawProducts
          .sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
          )
          .slice(0, limitPerCategory)
          .map((p) => ({
            ...p,
            price: Number(p.price),
            is_featured: Boolean(p.is_featured),
            category_id: cat.id,
            category: { id: cat.id, name: cat.name, slug: cat.slug },
          })) as ProductRecord[];

        result.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          products: sorted,
        });
      }

      return result;
    } catch {
      return [];
    }
  },
  ["categories-with-products"],
  {
    tags: ["categories", "products"],
    revalidate: 3600,
  }
);

export async function getProductsByCategory(
  categoryId: string
): Promise<ProductRecord[]> {
  try {
    const supabase = getPublicSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        quantity,
        image_path,
        product_description,
        is_featured,
        created_at,
        updated_at,
        category_id,
        category:categories(id, name, slug)
      `)
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((item: any) => ({
      ...item,
      price: Number(item.price),
      is_featured: Boolean(item.is_featured),
      category: Array.isArray(item.category)
        ? item.category[0] ?? null
        : item.category ?? null,
    })) as ProductRecord[];
  } catch {
    return [];
  }
}

export const getCachedProductsByCategory = (categoryId: string) =>
  unstable_cache(
    async (): Promise<ProductRecord[]> => {
      return getProductsByCategory(categoryId);
    },
    [`category-products-${categoryId}`],
    {
      tags: ["products", `category-${categoryId}`],
      revalidate: 3600,
    }
  )();


