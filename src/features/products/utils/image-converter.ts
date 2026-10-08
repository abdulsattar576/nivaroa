export type OutputFormat = "image/webp" | "image/jpeg" | "image/png";

export type ImageConvertOptions = {
  format?: OutputFormat;
  quality?: number; // 0.1 to 1.0 (for webp and jpeg)
  maxWidth?: number;
  maxHeight?: number;
};

export type ImageConvertResult = {
  blob: Blob;
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  newSize: number;
  savingsPercent: number;
  format: OutputFormat;
};

const FORMAT_EXTENSIONS: Record<OutputFormat, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/**
 * Client-side browser image converter using the HTML5 Canvas API.
 * Converts any image format (PNG, JPG, HEIC, WEBP, AVIF, BMP, etc.)
 * directly in the browser without uploading to any external third-party service.
 */
export async function convertImageInBrowser(
  sourceFile: File,
  options: ImageConvertOptions = {}
): Promise<ImageConvertResult> {
  const {
    format = "image/webp",
    quality = 0.85,
    maxWidth = 1600,
    maxHeight = 1600,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read image file"));

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to decode image"));

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect-ratio preserved scaling if limits are set
        if (maxWidth && width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (maxHeight && height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { willReadFrequently: false });
        if (!ctx) {
          reject(new Error("Canvas context is not available"));
          return;
        }

        // Fill background with white for JPEG if original had transparency
        if (format === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        }

        // High quality bicubic image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to encode converted image"));
              return;
            }

            const extension = FORMAT_EXTENSIONS[format] || "webp";
            const originalBaseName = sourceFile.name.replace(/\.[^/.]+$/, "");
            const newFileName = `${originalBaseName}.${extension}`;

            const convertedFile = new File([blob], newFileName, {
              type: format,
              lastModified: Date.now(),
            });

            const dataUrl = URL.createObjectURL(blob);
            const originalSize = sourceFile.size;
            const newSize = blob.size;
            const savingsPercent = Math.max(
              0,
              Math.round(((originalSize - newSize) / originalSize) * 100)
            );

            resolve({
              blob,
              file: convertedFile,
              dataUrl,
              width,
              height,
              originalSize,
              newSize,
              savingsPercent,
              format,
            });
          },
          format,
          quality
        );
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(sourceFile);
  });
}

/**
 * Downloads a File or Blob directly to the user's computer
 */
export function downloadFile(file: File | Blob, filename: string) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Format bytes into human-readable string (e.g. 1.4 MB, 250 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

