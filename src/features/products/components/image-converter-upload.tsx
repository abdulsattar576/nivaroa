"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  FileImage,
  ArrowRight,
  Sliders,
  X,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  convertImageInBrowser,
  downloadFile,
  formatBytes,
  type OutputFormat,
  type ImageConvertResult,
} from "../utils/image-converter";

type ImageConverterUploadProps = {
  onFileReady: (file: File | null) => void;
  defaultImageUrl?: string | null;
};

export default function ImageConverterUpload({
  onFileReady,
  defaultImageUrl,
}: ImageConverterUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rawFile, setRawFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState<number>(0.85);
  const [maxDimension, setMaxDimension] = useState<number>(1400);

  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<ImageConvertResult | null>(null);
  const [conversionError, setConversionError] = useState<string | null>(null);

  // Perform conversion whenever raw file or conversion parameters change
  useEffect(() => {
    if (!rawFile) {
      setConversionResult(null);
      onFileReady(null);
      return;
    }

    let isMounted = true;
    setIsConverting(true);
    setConversionError(null);

    convertImageInBrowser(rawFile, {
      format: selectedFormat,
      quality,
      maxWidth: maxDimension > 0 ? maxDimension : undefined,
      maxHeight: maxDimension > 0 ? maxDimension : undefined,
    })
      .then((res) => {
        if (!isMounted) return;
        setConversionResult(res);
        onFileReady(res.file);
      })
      .catch((err) => {
        if (!isMounted) return;
        setConversionError(err?.message || "Could not convert image");
      })
      .finally(() => {
        if (isMounted) setIsConverting(false);
      });

    return () => {
      isMounted = false;
    };
  }, [rawFile, selectedFormat, quality, maxDimension, onFileReady]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRawFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setRawFile(file);
    }
  };

  const handleReset = () => {
    setRawFile(null);
    setConversionResult(null);
    onFileReady(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (conversionResult) {
      downloadFile(conversionResult.file, conversionResult.file.name);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[#dce5de] bg-[#fbfcfb] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e9efe8] pb-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-[#eaf2e8] text-[#174c3a]">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-[#1f3127]">Product Image & Built-in Converter</h3>
            <p className="text-xs text-[#718276]">
              Upload any format and convert to WebP, JPEG, or PNG right in your browser
            </p>
          </div>
        </div>
        {rawFile && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 gap-1 rounded-lg text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <X className="size-3.5" /> Remove
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!rawFile ? (
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#ccd9cc] bg-white px-6 py-10 text-center transition hover:border-[#174c3a] hover:bg-[#f6f9f5]"
          >
            <div className="grid size-12 place-items-center rounded-2xl bg-[#eff5ee] text-[#174c3a] transition group-hover:scale-105">
              <Upload className="size-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-[#22362b]">
              Drag & drop product photo or <span className="text-[#174c3a] underline underline-offset-2">browse files</span>
            </p>
            <p className="mt-1 text-xs text-[#7b8a80]">
              Supports PNG, JPG, WEBP, AVIF, BMP, GIF (up to 10MB)
            </p>
          </div>

          {defaultImageUrl && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#e2eae1] bg-white p-3">
              <div className="relative size-12 overflow-hidden rounded-lg bg-slate-100">
                <Image src={defaultImageUrl} alt="Current" fill className="object-cover" sizes="48px" />
              </div>
              <div className="text-xs">
                <p className="font-medium text-[#2d4034]">Current Image</p>
                <p className="truncate text-slate-400">{defaultImageUrl}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Conversion Studio Controls */}
          <div className="rounded-xl border border-[#e3ebe2] bg-white p-3.5 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2b3e32]">
                <Sliders className="size-3.5 text-[#174c3a]" /> Converter Controls
              </span>
              <span className="text-[11px] text-[#718276]">
                Original: {rawFile.name} ({formatBytes(rawFile.size)})
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Format Selection */}
              <div>
                <label className="text-xs font-medium text-[#3b4e41]">Target Format</label>
                <div className="mt-1.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedFormat("image/webp")}
                    className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      selectedFormat === "image/webp"
                        ? "bg-[#174c3a] text-white shadow-sm"
                        : "border border-[#d7e2d6] bg-[#f8faf7] text-[#425547] hover:bg-[#edf3ec]"
                    }`}
                  >
                    WebP <span className="text-[10px] opacity-80">(Recommended)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFormat("image/jpeg")}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      selectedFormat === "image/jpeg"
                        ? "bg-[#174c3a] text-white shadow-sm"
                        : "border border-[#d7e2d6] bg-[#f8faf7] text-[#425547] hover:bg-[#edf3ec]"
                    }`}
                  >
                    JPEG
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFormat("image/png")}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      selectedFormat === "image/png"
                        ? "bg-[#174c3a] text-white shadow-sm"
                        : "border border-[#d7e2d6] bg-[#f8faf7] text-[#425547] hover:bg-[#edf3ec]"
                    }`}
                  >
                    PNG
                  </button>
                </div>
              </div>

              {/* Quality Slider (for WebP & JPEG) */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#3b4e41]">Quality</label>
                  <span className="text-xs font-semibold text-[#174c3a]">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  disabled={selectedFormat === "image/png"}
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#e2ebe0] accent-[#174c3a] disabled:opacity-40"
                />
                <p className="mt-1 text-[10px] text-[#718276]">
                  {selectedFormat === "image/png" ? "PNG is lossless" : "85% is optimal for e-commerce"}
                </p>
              </div>

              {/* Max Width / Dimension Preset */}
              <div>
                <label className="text-xs font-medium text-[#3b4e41]">Max Resolution</label>
                <select
                  value={maxDimension}
                  onChange={(e) => setMaxDimension(parseInt(e.target.value, 10))}
                  className="mt-1.5 h-8 w-full rounded-lg border border-[#d7e2d6] bg-[#f8faf7] px-2 text-xs text-[#304337] outline-none transition focus:border-[#174c3a]"
                >
                  <option value={1200}>1200px (Web standard)</option>
                  <option value={1600}>1600px (High-res catalog)</option>
                  <option value={800}>800px (Fast mobile)</option>
                  <option value={0}>Original dimensions</option>
                </select>
                <p className="mt-1 text-[10px] text-[#718276]">Auto-downscales large camera shots</p>
              </div>
            </div>
          </div>

          {/* Live Before & After Result Preview */}
          {isConverting ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-[#e1eae0] bg-white p-8 text-xs text-[#4b6051]">
              <LoaderCircle className="size-4 animate-spin text-[#174c3a]" /> Converting image in browser…
            </div>
          ) : conversionResult ? (
            <div className="overflow-hidden rounded-xl border border-[#dbe6db] bg-white shadow-sm">
              <div className="grid gap-4 p-4 sm:grid-cols-[180px_1fr]">
                {/* Converted thumbnail preview */}
                <div className="relative aspect-square overflow-hidden rounded-xl border border-[#e8efe8] bg-slate-50">
                  <Image
                    src={conversionResult.dataUrl}
                    alt="Converted preview"
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                  <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {conversionResult.width} × {conversionResult.height}
                  </span>
                </div>

                {/* Comparison stats and actions */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf2e8] px-2.5 py-0.5 text-xs font-semibold text-[#174c3a]">
                        <CheckCircle2 className="size-3.5" /> Ready for upload
                      </span>
                      {conversionResult.savingsPercent > 0 && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                          {conversionResult.savingsPercent}% Smaller
                        </span>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-[#f7f9f6] p-3 text-xs">
                      <div>
                        <span className="text-[10px] text-[#728377]">Original size</span>
                        <p className="font-semibold text-[#293c30]">
                          {formatBytes(conversionResult.originalSize)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#728377]">Converted size</span>
                        <p className="font-semibold text-[#174c3a]">
                          {formatBytes(conversionResult.newSize)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 text-[11px] text-[#697a6f]">
                      File: <span className="font-mono">{conversionResult.file.name}</span>
                    </p>
                  </div>

                  {/* Converter Action Buttons: Download or Change */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#edf2ec] pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="h-8 gap-1.5 rounded-lg border-[#d5e0d4] text-xs text-[#2b4134] hover:bg-[#eff5ee]"
                    >
                      <Download className="size-3.5" /> Download Converted File
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 gap-1.5 rounded-lg text-xs text-[#4b6052] hover:bg-[#eff5ee]"
                    >
                      <RotateCcw className="size-3.5" /> Select another photo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {conversionError && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {conversionError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

