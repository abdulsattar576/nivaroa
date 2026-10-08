import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { CategoryRecord } from "../schemas/category.schema";

export type CategoryTreeNode = CategoryRecord & {
  children: CategoryTreeNode[];
  depth: number;
};

export async function getCategories(): Promise<{
  categories: CategoryRecord[];
  error: string | null;
}> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, created_at, updated_at")
    .order("name", { ascending: true });

  if (error) {
    return { categories: [], error: "Categories could not be loaded. Please try again." };
  }

  return { categories: (data ?? []) as CategoryRecord[], error: null };
}

export async function getCategoryById(id: string): Promise<CategoryRecord | null> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as CategoryRecord;
}

export function buildCategoryTree(categories: CategoryRecord[]): CategoryTreeNode[] {
  const nodes = new Map<string, CategoryTreeNode>();

  for (const category of categories) {
    nodes.set(category.id, { ...category, children: [], depth: 0 });
  }

  const roots: CategoryTreeNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parent_id ? nodes.get(node.parent_id) : undefined;
    if (parent && parent.id !== node.id) parent.children.push(node);
    else roots.push(node);
  }

  const setDepth = (node: CategoryTreeNode, depth: number) => {
    node.depth = depth;
    node.children.sort((a, b) => a.name.localeCompare(b.name));
    node.children.forEach((child) => setDepth(child, depth + 1));
  };

  roots.sort((a, b) => a.name.localeCompare(b.name));
  roots.forEach((root) => setDepth(root, 0));
  return roots;
}

export function flattenCategoryOptions(
  categories: CategoryRecord[],
  excludedIds: Set<string> = new Set(),
): Array<{ id: string; name: string; path: string }> {
  const options: Array<{ id: string; name: string; path: string }> = [];

  const visit = (nodes: CategoryTreeNode[], ancestors: string[]) => {
    for (const node of nodes) {
      const path = [...ancestors, node.name];
      if (!excludedIds.has(node.id)) {
        options.push({ id: node.id, name: node.name, path: path.join(" / ") });
      }
      visit(node.children, path);
    }
  };

  visit(buildCategoryTree(categories), []);
  return options;
}

export function collectDescendantIds(categories: CategoryRecord[], id: string): Set<string> {
  const descendants = new Set<string>();
  const pending = [id];

  while (pending.length) {
    const parentId = pending.pop();
    if (!parentId) continue;

    for (const category of categories) {
      if (category.parent_id === parentId && !descendants.has(category.id)) {
        descendants.add(category.id);
        pending.push(category.id);
      }
    }
  }

  return descendants;
}
