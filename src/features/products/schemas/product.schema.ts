import { z } from "zod";

export const ProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters.")
    .max(200, "Product name cannot exceed 200 characters."),

  price: z
    .number({ message: "Enter a valid product price." })
    .min(0, "Price must be greater than or equal to 0.")
    .max(999999.99, "Price is too large."),

  category_id: z
    .string()
    .uuid("Choose a valid category.")
    .optional()
    .or(z.literal("")),

  quantity: z
    .number({ message: "Enter a valid quantity." })
    .int("Quantity must be a whole number.")
    .min(0, "Quantity cannot be negative."),

  product_description: z
    .string()
    .trim()
    .max(3000, "Description cannot exceed 3000 characters.")
    .optional()
    .or(z.literal("")),

  image_path: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type ProductFormData = z.infer<typeof ProductSchema>;

export type ProductRecord = {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  image_path: string | null;
  product_description: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

