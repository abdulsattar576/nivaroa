"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface ProductReviewItem {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string | null;
  comment: string;
  isVerifiedBuyer: boolean;
  createdAt: string;
}

/**
 * Fetches real customer reviews for a given product
 */
export async function getProductReviews(productId: string): Promise<ProductReviewItem[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, product_id, customer_name, rating, title, comment, is_verified_buyer, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching product reviews:", error);
      return [];
    }

    return (data || []).map((r) => ({
      id: r.id,
      productId: r.product_id,
      customerName: r.customer_name,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      isVerifiedBuyer: r.is_verified_buyer,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches global verified customer reviews across the store for social proof
 */
export async function getStoreCustomerReviews(limit = 6): Promise<ProductReviewItem[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, product_id, customer_name, rating, title, comment, is_verified_buyer, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return (data || []).map((r) => ({
      id: r.id,
      productId: r.product_id,
      customerName: r.customer_name,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      isVerifiedBuyer: r.is_verified_buyer,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export type SubmitReviewInput = {
  productId: string;
  rating: number;
  customerName: string;
  customerEmail?: string;
  title?: string;
  comment: string;
};

/**
 * Submits a new real customer review for a product
 */
export async function submitProductReview(input: SubmitReviewInput) {
  if (!input.productId) {
    return { success: false, message: "Missing product reference." };
  }
  if (!input.customerName?.trim()) {
    return { success: false, message: "Please provide your name." };
  }
  if (!input.comment?.trim() || input.comment.trim().length < 5) {
    return { success: false, message: "Please provide a review of at least 5 characters." };
  }
  if (!input.rating || input.rating < 1 || input.rating > 5) {
    return { success: false, message: "Please select a star rating between 1 and 5." };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if this user or email has placed an order containing this product
  let isVerified = false;
  try {
    const { data: userOrderItems } = await supabase
      .from("order_items")
      .select("id, orders!inner(user_id, customer_email)")
      .eq("product_id", input.productId)
      .limit(1);

    if (userOrderItems && userOrderItems.length > 0) {
      isVerified = true;
    }
  } catch {
    // Ignore verification check error
  }

  const { error } = await supabase.from("product_reviews").insert({
    product_id: input.productId,
    user_id: user?.id || null,
    customer_name: input.customerName.trim(),
    customer_email: input.customerEmail?.trim() || null,
    rating: input.rating,
    title: input.title?.trim() || null,
    comment: input.comment.trim(),
    is_verified_buyer: isVerified,
  });

  if (error) {
    console.error("Submit review error:", error);
    return { success: false, message: error.message || "Failed to submit review." };
  }

  revalidatePath(`/product/${input.productId}`);
  revalidatePath("/");

  return { success: true, message: "Your review has been submitted successfully!" };
}

