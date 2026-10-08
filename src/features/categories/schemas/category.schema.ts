import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().trim().min(2, "Use at least 2 characters.").max(100, "Keep the name under 100 characters."),
  slug: z
    .string()
    .trim()
    .max(120, "Keep the slug under 120 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.")
    .optional()
    .or(z.literal("")),
  parent_id: z.string().uuid("Choose a valid parent category.").optional().or(z.literal("")),
});

export type CategoryFormData = z.infer<typeof CategorySchema>;

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
