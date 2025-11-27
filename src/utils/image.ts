/**
 * Image compression utility
 * Compresses images to a maximum file size while maintaining quality
 */

interface CompressImageOptions {
  maxSizeKB?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

const DEFAULT_OPTIONS: Required<CompressImageOptions> = {
  maxSizeKB: 400,
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.9,
  mimeType: "image/jpeg",
};

/**
 * Compresses an image file to meet size requirements
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<File> - The compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // If file is already smaller than maxSize and is the correct type, return it
  if (file.size <= opts.maxSizeKB * 1024 && file.type === opts.mimeType) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read file"));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => reject(new Error("Failed to load image"));

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img;

          if (width > opts.maxWidth || height > opts.maxHeight) {
            const aspectRatio = width / height;

            if (width > height) {
              width = Math.min(width, opts.maxWidth);
              height = width / aspectRatio;
            } else {
              height = Math.min(height, opts.maxHeight);
              width = height * aspectRatio;
            }
          }

          // Create canvas and draw image
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Try different quality levels to meet size requirement
          let quality = opts.quality;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Failed to compress image"));
                  return;
                }

                // Check if size is acceptable or if we've tried enough
                if (blob.size <= opts.maxSizeKB * 1024 || quality <= 0.1) {
                  // Create a new File object with the compressed blob
                  const compressedFile = new File([blob], file.name, {
                    type: opts.mimeType,
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else {
                  // Reduce quality and try again
                  quality -= 0.1;
                  tryCompress();
                }
              },
              opts.mimeType,
              quality
            );
          };

          tryCompress();
        } catch (error) {
          reject(error);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validates if a file is an image
 * @param file - The file to validate
 * @returns boolean - True if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Gets the file extension from mime type
 * @param mimeType - The mime type
 * @returns string - The file extension
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  return map[mimeType] || "jpg";
}

/**
 * Generates a unique filename for uploads
 * @param originalName - The original filename
 * @param prefix - Optional prefix for the filename
 * @returns string - The unique filename
 */
export function generateUniqueFilename(
  originalName: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split(".").pop() || "jpg";
  const baseName = prefix ? `${prefix}_` : "";

  return `${baseName}${timestamp}_${random}.${extension}`;
}
