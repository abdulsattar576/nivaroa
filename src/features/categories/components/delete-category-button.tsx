"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import { deleteCategory } from "../actions/categories";

type DeleteCategoryButtonProps = { id: string; name: string };

const DeleteCategoryButton = ({ id, name }: DeleteCategoryButtonProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const onDelete = async () => {
    if (!window.confirm(`Delete “${name}”? Categories with subcategories or assigned products cannot be deleted.`)) return;

    setError("");
    setIsDeleting(true);
    try {
      const result = await deleteCategory(id);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.refresh();
    } catch {
      setError("The category could not be deleted. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={onDelete} disabled={isDeleting} aria-label={`Delete ${name}`} className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-[#9b5550] transition hover:bg-rose-50 disabled:opacity-50">
        {isDeleting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}
        <span className="hidden sm:inline">Delete</span>
      </button>
      {error && <p role="alert" className="max-w-56 text-right text-[11px] text-rose-600">{error}</p>}
    </div>
  );
};

export default DeleteCategoryButton;
