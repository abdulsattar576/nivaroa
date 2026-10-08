"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import { deleteProduct } from "../actions/products";

type DeleteProductButtonProps = { id: string; name: string };

export default function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const onDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;

    setError("");
    setIsDeleting(true);
    try {
      const result = await deleteProduct(id);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.refresh();
    } catch {
      setError("The product could not be deleted.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        aria-label={`Delete ${name}`}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
      >
        {isDeleting ? (
          <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="size-3.5" aria-hidden="true" />
        )}
        <span>Delete</span>
      </button>
      {error && <span role="alert" className="text-[11px] text-rose-600">{error}</span>}
    </div>
  );
}

