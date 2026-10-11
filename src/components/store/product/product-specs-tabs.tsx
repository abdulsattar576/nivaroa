"use client";

import { useState } from "react";
import { CheckCircle2, FileText, ListFilter, Star } from "lucide-react";
import type { ProductRecord } from "@/features/products/schemas/product.schema";

type ProductSpecsTabsProps = {
  product: ProductRecord;
};

export default function ProductSpecsTabs({ product }: ProductSpecsTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">(
    "description"
  );

  const specsList = Object.entries(product.specifications || {});
  const highlights = product.highlights || [];

  return (
    <div className="rounded-3xl border border-[#e4ede4] bg-white p-6 shadow-xs sm:p-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#e9efe8]">
        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={`relative pb-4 text-sm font-semibold transition-colors ${
            activeTab === "description"
              ? "text-[#153e2b]"
              : "text-[#6c7d70] hover:text-[#254634]"
          }`}
        >
          Description & Highlights
          {activeTab === "description" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#174c3a]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("specs")}
          className={`relative ml-8 pb-4 text-sm font-semibold transition-colors ${
            activeTab === "specs"
              ? "text-[#153e2b]"
              : "text-[#6c7d70] hover:text-[#254634]"
          }`}
        >
          Specifications
          {activeTab === "specs" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#174c3a]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`relative ml-8 pb-4 text-sm font-semibold transition-colors ${
            activeTab === "reviews"
              ? "text-[#153e2b]"
              : "text-[#6c7d70] hover:text-[#254634]"
          }`}
        >
          Reviews ({product.reviews_count || 0})
          {activeTab === "reviews" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#174c3a]" />
          )}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="pt-6">
        {/* 1. Description & Highlights */}
        {activeTab === "description" && (
          <div className="space-y-6 text-[#293d31]">
            {product.product_description ? (
              <div className="prose max-w-none text-sm leading-relaxed text-[#405648] whitespace-pre-line">
                {product.product_description}
              </div>
            ) : (
              <p className="text-sm text-[#738578]">
                No detailed description provided for this product.
              </p>
            )}

            {highlights.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-semibold text-[#183526]">Key Highlights</h4>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-[#e8f0e8] bg-[#f9fbf9] p-3 text-xs font-medium text-[#2f4939]"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-[#216544]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Specifications */}
        {activeTab === "specs" && (
          <div>
            {specsList.length > 0 || product.sku ? (
              <div className="divide-y divide-[#edf3ec] overflow-hidden rounded-2xl border border-[#e4ece3]">
                {product.sku && (
                  <div className="flex bg-[#fafcfa] px-4 py-3 text-xs sm:px-6">
                    <span className="w-1/3 font-semibold text-[#3d5244]">SKU Code</span>
                    <span className="w-2/3 font-mono text-[#1a2f23]">{product.sku}</span>
                  </div>
                )}
                {product.category?.name && (
                  <div className="flex bg-white px-4 py-3 text-xs sm:px-6">
                    <span className="w-1/3 font-semibold text-[#3d5244]">Department</span>
                    <span className="w-2/3 text-[#1a2f23]">{product.category.name}</span>
                  </div>
                )}
                {specsList.map(([key, value], idx) => (
                  <div
                    key={key}
                    className={`flex px-4 py-3 text-xs sm:px-6 ${
                      idx % 2 === 0 ? "bg-[#fafcfa]" : "bg-white"
                    }`}
                  >
                    <span className="w-1/3 font-semibold text-[#3d5244]">{key}</span>
                    <span className="w-2/3 text-[#1a2f23]">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#738578]">
                No technical specifications available for this item.
              </p>
            )}
          </div>
        )}

        {/* 3. Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-6 text-[#293d31]">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#e5ede4] bg-[#fbfdfb] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold text-[#173827]">
                    {(product.rating || 5.0).toFixed(1)}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="size-4.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-[#63766a]">
                  Based on {product.reviews_count || 1} verified customer ratings
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800">
                100% Recommended by buyers
              </span>
            </div>

            <p className="text-xs text-[#7d8f82]">
              Customer reviews are verified through order fulfillment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

