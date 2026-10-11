import { z } from "zod";

export const CheckoutSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),

  customer_email: z
    .string()
    .trim()
    .email("Enter a valid email address."),

  customer_phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number (at least 7 digits).")
    .max(20, "Phone number is too long.")
    .regex(/^[0-9+() -]+$/, "Enter a valid phone number."),

  shipping_address: z
    .string()
    .trim()
    .min(5, "Complete street and house address is required.")
    .max(300, "Address is too long."),

  city: z
    .string()
    .trim()
    .min(2, "City is required.")
    .max(100, "City name is too long."),

  postal_code: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("")),

  notes: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("")),

  payment_method: z.enum(["cod", "easypaisa"]),
});

export type CheckoutFormData = z.infer<typeof CheckoutSchema>;

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "easypaisa" | "card";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type OrderItemRecord = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  total: number;
  created_at: string;
};

export type OrderRecord = {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code?: string | null;
  notes?: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  created_at: string;
  updated_at: string;
  items?: OrderItemRecord[];
};

