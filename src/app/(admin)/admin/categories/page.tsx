import Link from "next/link";
import { FolderTree, FolderPlus, Pencil, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteCategoryButton from "@/features/categories/components/delete-category-button";
import { buildCategoryTree, getCategories, type CategoryTreeNode } from "@/features/categories/data/categories";

function CategoryBranch({ nodes }: { nodes: CategoryTreeNode[] }) {
  return (
    <ul className="space-y-2">
      {nodes.map((category) => (
        <li key={category.id}>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e8ece5] bg-white p-3.5 shadow-[0_5px_18px_-16px_rgba(27,48,34,0.35)] sm:p-4" style={{ marginLeft: `${Math.min(category.depth, 5) * 1.1}rem` }}>
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${category.depth ? "bg-[#f1f4ef] text-[#728374]" : "bg-[#eaf2e8] text-[#4f7654]"}`}>
              {category.depth ? <Tag className="size-4.25" aria-hidden="true" /> : <FolderTree className="size-4.5" aria-hidden="true" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-[#283b2e]">{category.name}</p>
                {category.depth > 0 && <span className="rounded-full bg-[#f3f5f1] px-2 py-0.5 text-[10px] font-medium text-[#778479]">Level {category.depth + 1}</span>}
              </div>
              <p className="mt-1 truncate text-xs text-[#929c94]">/{category.slug}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon-sm" render={<Link href={`/admin/categories/${category.id}/edit`} aria-label={`Edit ${category.name}`} />} className="size-9 rounded-lg text-[#607365] hover:bg-[#eff4ed] hover:text-[#315f40]">
                <Pencil aria-hidden="true" />
              </Button>
              <DeleteCategoryButton id={category.id} name={category.name} />
            </div>
          </div>
          {category.children.length > 0 && (
            <div className="mt-2 border-l border-[#dce6d9] pl-2 sm:pl-3">
              <CategoryBranch nodes={category.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function CategoriesPage() {
  const { categories, error } = await getCategories();
  const tree = buildCategoryTree(categories);

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 pb-12 pt-4 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#64806d]">Catalog management</p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#192b21]">Categories</h1>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#748078]">Organize your catalog into categories and nested subcategories.</p>
          </div>
          <Button render={<Link href="/admin/categories/new" />} className="h-10 w-fit rounded-xl bg-[#174c3a] px-4 text-sm text-white hover:bg-[#103d31]">
            <FolderPlus aria-hidden="true" /> New category
          </Button>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#e8ebe5] bg-white p-4">
            <p className="text-xs font-medium text-[#879289]">Total categories</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#203329]">{categories.length}</p>
          </div>
          <div className="rounded-2xl border border-[#e8ebe5] bg-white p-4">
            <p className="text-xs font-medium text-[#879289]">Subcategories</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#203329]">{categories.filter((category) => category.parent_id).length}</p>
          </div>
        </div>

        {error ? (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error}</div>
        ) : categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#ccd8cb] bg-white px-6 py-16 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#edf3e9] text-[#527751]"><FolderTree className="size-6" aria-hidden="true" /></span>
            <h2 className="mt-4 text-lg font-semibold text-[#2c4032]">Start with a category</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7e8b80]">Create your first category, then add subcategories to keep your catalog easy to browse.</p>
            <Button render={<Link href="/admin/categories/new" />} className="mt-5 h-10 rounded-xl bg-[#174c3a] px-4 text-white hover:bg-[#103d31]">Create a category</Button>
          </div>
        ) : (
          <section aria-label="Category hierarchy" className="rounded-3xl border border-[#e8ebe5] bg-[#fbfcfa] p-3 sm:p-5">
            <div className="mb-4 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-[#425347]">Category tree</h2>
              <p className="text-xs text-[#9aa39c]">{tree.length} top-level {tree.length === 1 ? "category" : "categories"}</p>
            </div>
            <CategoryBranch nodes={tree} />
          </section>
        )}

        <p className="mt-4 text-xs leading-5 text-[#929b93]">Categories with subcategories or assigned products must be reassigned before they can be deleted.</p>
      </div>
    </main>
  );
}
