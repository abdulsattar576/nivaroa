import { z } from "zod";

export const ProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters.")
    .max(200, "Product name cannot exceed 200 characters."),

  slug: z
    .string()
    .trim()
    .max(200, "Slug cannot exceed 200 characters.")
    .optional()
    .or(z.literal("")),

  price: z
    .number({ message: "Enter a valid product price." })
    .min(0, "Price must be greater than or equal to 0.")
    .max(999999.99, "Price is too large."),

  compare_at_price: z
    .number({ message: "Enter a valid original price." })
    .min(0, "Compare price must be greater than or equal to 0.")
    .max(999999.99, "Price is too large.")
    .optional()
    .nullable(),

  category_id: z
    .string()
    .uuid("Choose a valid category.")
    .optional()
    .or(z.literal("")),

  quantity: z
    .number({ message: "Enter a valid quantity." })
    .int("Quantity must be a whole number.")
    .min(0, "Quantity cannot be negative."),

  sku: z
    .string()
    .trim()
    .max(100, "SKU cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  badge: z
    .string()
    .trim()
    .max(50, "Badge cannot exceed 50 characters.")
    .optional()
    .or(z.literal("")),

  product_description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters.")
    .optional()
    .or(z.literal("")),

  image_path: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  images: z.array(z.string()).optional(),

  highlights: z.array(z.string()).optional(),

  specifications: z.record(z.string(), z.string()).optional(),

  is_featured: z.boolean().optional(),

  rating: z.number().min(0).max(5).optional(),

  reviews_count: z.number().int().min(0).optional(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;

export type ProductRecord = {
  id: string;
  name: string;
  slug?: string | null;
  price: number;
  compare_at_price?: number | null;
  category_id: string | null;
  image_path: string | null;
  images?: string[];
  product_description: string | null;
  quantity: number;
  is_featured: boolean;
  sku?: string | null;
  highlights?: string[];
  specifications?: Record<string, string>;
  badge?: string | null;
  rating?: number;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

