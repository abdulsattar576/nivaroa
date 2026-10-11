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

export const PRODUCT_SELECT_FIELDS = `
  id,
  name,
  slug,
  price,
  compare_at_price,
  category_id,
  image_path,
  images,
  product_description,
  quantity,
  sku,
  badge,
  highlights,
  specifications,
  rating,
  reviews_count,
  is_featured,
  created_at,
  updated_at,
  category:categories(id, name, slug)
`;

export function mapProductRecord(item: any): ProductRecord {
  const images =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.image_path
      ? [item.image_path]
      : [];

  return {
    ...item,
    slug: item.slug || item.id,
    price: Number(item.price),
    compare_at_price:
      item.compare_at_price != null ? Number(item.compare_at_price) : null,
    images,
    highlights: Array.isArray(item.highlights) ? item.highlights : [],
    specifications:
      typeof item.specifications === "object" && item.specifications !== null
        ? item.specifications
        : {},
    rating: item.rating != null ? Number(item.rating) : 5.0,
    reviews_count: item.reviews_count != null ? Number(item.reviews_count) : 0,
    is_featured: Boolean(item.is_featured),
    category: Array.isArray(item.category)
      ? item.category[0] ?? null
      : item.category ?? null,
  };
}

export async function getProducts(): Promise<{
  products: ProductRecord[];
  error: string | null;
}> {
  const supabase = createClient(await cookies());

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_FIELDS)
    .order("created_at", { ascending: false });

  if (error) {
    return { products: [], error: "Products could not be loaded." };
  }

  const products = (data ?? []).map(mapProductRecord);
  return { products, error: null };
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const supabase = createClient(await cookies());

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return mapProductRecord(data);
}

/**
 * Retrieves a product by slug or UUID id fallback
 */
export async function getProductBySlug(slugOrId: string): Promise<ProductRecord | null> {
  const supabase = getPublicSupabaseClient();

  // Try by slug first
  let { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_FIELDS)
    .eq("slug", slugOrId)
    .maybeSingle();

  // If not found and looks like UUID, fallback to id
  if (
    !data &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      slugOrId
    )
  ) {
    const res = await supabase
      .from("products")
      .select(PRODUCT_SELECT_FIELDS)
      .eq("id", slugOrId)
      .maybeSingle();
    data = res.data;
  }

  if (!data) return null;
  return mapProductRecord(data);
}

/**
 * Cached product retrieval by slug for high-speed page loads
 */
export const getCachedProductBySlug = (slugOrId: string) =>
  unstable_cache(
    async (): Promise<ProductRecord | null> => {
      return getProductBySlug(slugOrId);
    },
    [`product-slug-${slugOrId}`],
    {
      tags: ["products", `product-${slugOrId}`],
      revalidate: 3600,
    }
  )();

/**
 * Returns all product slugs for static path pre-rendering
 */
export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const supabase = getPublicSupabaseClient();
    const { data } = await supabase.from("products").select("slug");
    return (data || []).map((p: any) => p.slug).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Fetches related products from the same category or featured products
 */
export async function getRelatedProducts(
  categoryId: string | null,
  currentProductId: string,
  limit = 4
): Promise<ProductRecord[]> {
  try {
    const supabase = getPublicSupabaseClient();
    let query = supabase
      .from("products")
      .select(PRODUCT_SELECT_FIELDS)
      .neq("id", currentProductId)
      .limit(limit);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    } else {
      query = query.eq("is_featured", true);
    }

    const { data } = await query;
    if (!data || data.length === 0) {
      // Fallback: any other active products
      const fallback = await supabase
        .from("products")
        .select(PRODUCT_SELECT_FIELDS)
        .neq("id", currentProductId)
        .limit(limit);
      return (fallback.data || []).map(mapProductRecord);
    }

    return data.map(mapProductRecord);
  } catch {
    return [];
  }
}

export const getCachedRelatedProducts = (
  categoryId: string | null,
  currentProductId: string,
  limit = 4
) =>
  unstable_cache(
    async (): Promise<ProductRecord[]> => {
      return getRelatedProducts(categoryId, currentProductId, limit);
    },
    [`related-${currentProductId}`],
    {
      tags: ["products", `related-${currentProductId}`],
      revalidate: 3600,
    }
  )();

/**
 * Fetches featured products for homepage carousel and highlights
 */
export async function getFeaturedProducts(limit = 8): Promise<ProductRecord[]> {
  const supabase = createClient(await cookies());

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_FIELDS)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map(mapProductRecord);
}

/**
 * Returns cached featured products for public homepage and storefront highlights.
 */
export const getCachedFeaturedProducts = unstable_cache(
  async (limit = 10): Promise<ProductRecord[]> => {
    try {
      const supabase = getPublicSupabaseClient();
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT_FIELDS)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error || !data) return [];

      return data.map(mapProductRecord);
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
 */
export const getCachedCategoriesWithProducts = unstable_cache(
  async (limitPerCategory = 5): Promise<CategoryWithProducts[]> => {
    try {
      const supabase = getPublicSupabaseClient();

      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select(`
          id,
          name,
          slug,
          products (
            ${PRODUCT_SELECT_FIELDS}
          )
        `)
        .order("name", { ascending: true });

      if (catError || !categories) {
        const { data: products } = await supabase
          .from("products")
          .select(PRODUCT_SELECT_FIELDS)
          .order("created_at", { ascending: false });

        if (!products || products.length === 0) return [];

        const groupMap = new Map<string, CategoryWithProducts>();
        for (const p of products) {
          const mapped = mapProductRecord(p);
          const cat = mapped.category;
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
            group.products.push(mapped);
          }
        }
        return Array.from(groupMap.values());
      }

      const result: CategoryWithProducts[] = [];
      for (const cat of categories) {
        const rawProducts = (cat.products as any[]) || [];
        if (rawProducts.length === 0) continue;

        const sorted = rawProducts
          .sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
          )
          .slice(0, limitPerCategory)
          .map((p) => ({
            ...mapProductRecord(p),
            category_id: cat.id,
            category: { id: cat.id, name: cat.name, slug: cat.slug },
          }));

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
      .select(PRODUCT_SELECT_FIELDS)
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map(mapProductRecord);
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
