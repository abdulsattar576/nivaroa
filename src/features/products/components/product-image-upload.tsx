"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, ImagePlus, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProductImageUploadProps = {
  onImageSelected: (file: File | null) => void;
  onClearExistingImage?: () => void;
  defaultImageUrl?: string | null;
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function ProductImageUpload({
  onImageSelected,
  onClearExistingImage,
  defaultImageUrl,
}: ProductImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(defaultImageUrl ?? null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onImageSelected(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      onImageSelected(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveExisting = () => {
    setExistingImageUrl(null);
    onClearExistingImage?.();
  };

  return (
    <div className="space-y-3 rounded-2xl border border-[#dce5de] bg-[#fbfcfb] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#26372f]">Product Image</label>
        {selectedFile && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 gap-1 rounded-lg text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <X className="size-3.5" /> Remove Image
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* When no file is selected */}
      {!selectedFile && (
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#ccd9cc] bg-white px-6 py-8 text-center transition hover:border-[#174c3a] hover:bg-[#f6f9f5]"
          >
            <div className="grid size-12 place-items-center rounded-2xl bg-[#eff5ee] text-[#174c3a] transition group-hover:scale-105">
              <Upload className="size-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-[#22362b]">
              Drag & drop product image or{" "}
              <span className="text-[#174c3a] underline underline-offset-2">browse</span>
            </p>
            <p className="mt-1 text-xs text-[#7b8a80]">
              Direct upload — PNG, JPG, WEBP, AVIF, GIF (up to 10MB)
            </p>
          </div>

          {existingImageUrl && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#e2eae1] bg-white p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image src={existingImageUrl} alt="Current" fill className="object-cover" sizes="48px" />
                </div>
                <div className="min-w-0 text-xs">
                  <p className="font-medium text-[#2d4034]">Current Image</p>
                  <p className="truncate text-slate-400">{existingImageUrl}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveExisting}
                className="h-8 shrink-0 gap-1 rounded-lg text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <X className="size-3.5" /> Remove
              </Button>
            </div>
          )}
        </div>
      )}

      {/* When file is selected: instant preview */}
      {selectedFile && previewUrl && (
        <div className="flex items-center gap-4 rounded-xl border border-[#dbe6db] bg-white p-3.5">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-[#e2ece0] bg-slate-50">
            <Image
              src={previewUrl}
              alt="Selected product preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#25392d]">
              {selectedFile.name}
            </p>
            <p className="mt-0.5 text-xs text-[#718276]">
              Size: {formatFileSize(selectedFile.size)} • Type: {selectedFile.type || "image"}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-[#174c3a] underline underline-offset-2 hover:text-[#103d31]"
              >
                Change photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

