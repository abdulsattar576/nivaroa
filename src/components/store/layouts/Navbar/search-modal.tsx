"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Package, ArrowRight, Tag } from "lucide-react";
import type { ProductRecord } from "@/features/products/schemas/product.schema";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Live search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch {
        // Fallback or ignore
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 backdrop-blur-sm sm:pt-24 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#dce6dc] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-[#e9efe8] px-5 py-4 sm:px-6">
          <Search className="size-5 shrink-0 text-[#174c3a]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name, category, or keyword..."
            className="w-full bg-transparent text-sm font-medium text-[#193225] outline-none placeholder:text-[#88998d] sm:text-base"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="grid size-7 place-items-center rounded-lg text-[#7c8f82] hover:bg-[#edf3ec] hover:text-[#183626]"
            >
              <X className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#dbe4da] px-2 py-0.5 text-[11px] font-semibold text-[#667a6d] hover:bg-[#f6f9f5]"
            >
              ESC
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#708476]">
              Searching catalog...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-[#798e80]">
                Matching Products ({results.length})
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug || product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3.5 rounded-2xl border border-[#edf3ec] p-2.5 transition hover:border-[#b4cdb8] hover:bg-[#f8faf7]"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#f0f4ee]">
                    {product.image_path ? (
                      <Image
                        src={product.image_path}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="grid size-full place-items-center text-[#8da092]">
                        <Package className="size-6 stroke-[1.5]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-xs font-semibold text-[#183224] sm:text-sm">
                      {product.name}
                    </h4>
                    <p className="mt-0.5 text-xs font-bold text-[#173e2e]">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-[#7b9082] shrink-0" />
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="py-12 text-center">
              <Package className="mx-auto size-10 text-[#8da092] stroke-[1.5]" />
              <p className="mt-2 text-sm font-semibold text-[#1f3729]">
                No items match &quot;{query}&quot;
              </p>
              <p className="mt-1 text-xs text-[#738779]">
                Try checking for typos or searching a broader term.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-4 px-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#798e80]">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Shirt", "Jacket", "Cotton", "Premium", "Summer", "Casual"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#d6e2d4] bg-[#f8faf7] px-3 py-1.5 text-xs font-medium text-[#204030] hover:border-[#174c3a] hover:bg-white"
                  >
                    <Tag className="size-3 text-[#174c3a]" /> {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#edf3ec] bg-[#fafbfa] px-5 py-3 text-right">
          <Link
            href="/shop"
            onClick={onClose}
            className="text-xs font-semibold text-[#174c3a] hover:underline"
          >
            Explore Full Catalog &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

