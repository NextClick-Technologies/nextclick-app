import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  compressImage,
  isImageFile,
  getExtensionFromMimeType,
  generateUniqueFilename,
} from "@/shared/utils/image-compress";

// Mock File and Blob
global.File = class MockFile extends Blob {
  name: string;
  lastModified: number;

  constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
    super(bits, options);
    this.name = name;
    this.lastModified = options?.lastModified || Date.now();
  }
} as any;

describe("isImageFile", () => {
  it("should return true for JPEG files", () => {
    const file = new File([""], "test.jpg", { type: "image/jpeg" });
    expect(isImageFile(file)).toBe(true);
  });

  it("should return true for PNG files", () => {
    const file = new File([""], "test.png", { type: "image/png" });
    expect(isImageFile(file)).toBe(true);
  });

  it("should return true for GIF files", () => {
    const file = new File([""], "test.gif", { type: "image/gif" });
    expect(isImageFile(file)).toBe(true);
  });

  it("should return true for WEBP files", () => {
    const file = new File([""], "test.webp", { type: "image/webp" });
    expect(isImageFile(file)).toBe(true);
  });

  it("should return true for SVG files", () => {
    const file = new File([""], "test.svg", { type: "image/svg+xml" });
    expect(isImageFile(file)).toBe(true);
  });

  it("should return false for PDF files", () => {
    const file = new File([""], "test.pdf", { type: "application/pdf" });
    expect(isImageFile(file)).toBe(false);
  });

  it("should return false for text files", () => {
    const file = new File([""], "test.txt", { type: "text/plain" });
    expect(isImageFile(file)).toBe(false);
  });

  it("should return false for JSON files", () => {
    const file = new File([""], "test.json", { type: "application/json" });
    expect(isImageFile(file)).toBe(false);
  });

  it("should handle files with no type", () => {
    const file = new File([""], "test", { type: "" });
    expect(isImageFile(file)).toBe(false);
  });
});

describe("getExtensionFromMimeType", () => {
  it("should return 'jpg' for 'image/jpeg'", () => {
    expect(getExtensionFromMimeType("image/jpeg")).toBe("jpg");
  });

  it("should return 'jpg' for 'image/jpg'", () => {
    expect(getExtensionFromMimeType("image/jpg")).toBe("jpg");
  });

  it("should return 'png' for 'image/png'", () => {
    expect(getExtensionFromMimeType("image/png")).toBe("png");
  });

  it("should return 'gif' for 'image/gif'", () => {
    expect(getExtensionFromMimeType("image/gif")).toBe("gif");
  });

  it("should return 'webp' for 'image/webp'", () => {
    expect(getExtensionFromMimeType("image/webp")).toBe("webp");
  });

  it("should return 'svg' for 'image/svg+xml'", () => {
    expect(getExtensionFromMimeType("image/svg+xml")).toBe("svg");
  });

  it("should return 'jpg' for unknown mime types", () => {
    expect(getExtensionFromMimeType("image/unknown")).toBe("jpg");
  });

  it("should return 'jpg' for non-image mime types", () => {
    expect(getExtensionFromMimeType("application/pdf")).toBe("jpg");
  });

  it("should return 'jpg' for empty string", () => {
    expect(getExtensionFromMimeType("")).toBe("jpg");
  });
});

describe("generateUniqueFilename", () => {
  beforeEach(() => {
    // Mock Date.now() for predictable timestamps
    jest.spyOn(Date, "now").mockReturnValue(1234567890000);
    // Mock Math.random() for predictable random strings
    jest.spyOn(Math, "random").mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should generate filename with original extension", () => {
    const filename = generateUniqueFilename("photo.jpg");
    expect(filename).toMatch(/^\d+_[a-z0-9]+\.jpg$/);
  });

  it("should extract extension from filename", () => {
    const filename = generateUniqueFilename("document.pdf");
    expect(filename).toMatch(/\.pdf$/);
  });

  it("should handle multiple dots in filename", () => {
    const filename = generateUniqueFilename("my.photo.jpg");
    expect(filename).toMatch(/\.jpg$/);
  });

  it("should use last part as extension even for single word", () => {
    const filename = generateUniqueFilename("file");
    // If no extension, it uses "file" itself as extension
    expect(filename).toMatch(/\.\w+$/);
  });

  it("should include prefix when provided", () => {
    const filename = generateUniqueFilename("photo.jpg", "avatar");
    expect(filename).toMatch(/^avatar_\d+_[a-z0-9]+\.jpg$/);
  });

  it("should not include prefix when not provided", () => {
    const filename = generateUniqueFilename("photo.jpg");
    expect(filename).not.toMatch(/^avatar_/);
  });

  it("should generate different filenames for different calls", () => {
    jest.spyOn(Date, "now").mockReturnValueOnce(1000000000000);
    const filename1 = generateUniqueFilename("photo.jpg");

    jest.spyOn(Date, "now").mockReturnValueOnce(2000000000000);
    const filename2 = generateUniqueFilename("photo.jpg");

    expect(filename1).not.toBe(filename2);
  });

  it("should handle uppercase extensions", () => {
    const filename = generateUniqueFilename("photo.JPG");
    expect(filename).toMatch(/\.JPG$/);
  });

  it("should handle filenames with special characters", () => {
    const filename = generateUniqueFilename("my-photo_2023.jpg");
    expect(filename).toMatch(/\.jpg$/);
  });
});

describe("compressImage", () => {
  it("should return original file if already small enough and correct type", async () => {
    const smallFile = new File(["x".repeat(100)], "small.jpg", {
      type: "image/jpeg",
    });

    const result = await compressImage(smallFile);
    expect(result).toBe(smallFile);
  });

  // Note: Canvas API-based compression tests require canvas npm package
  // These tests should be run as integration tests with canvas installed
  // or in a real browser environment. Skipping for unit tests.

  it.skip("should compress file if larger than maxSizeKB", () => {
    // Requires canvas npm package for jsdom
  });

  it.skip("should use custom options when provided", () => {
    // Requires canvas npm package for jsdom
  });

  it.skip("should maintain aspect ratio when resizing", () => {
    // Requires canvas npm package for jsdom
  });

  it.skip("should handle FileReader error", () => {
    // Requires canvas npm package for jsdom
  });

  it.skip("should handle Image load error", () => {
    // Requires canvas npm package for jsdom
  });

  it.skip("should handle canvas context error", () => {
    // Requires canvas npm package for jsdom
  });

  it.skip("should handle blob creation failure", () => {
    // Requires canvas npm package for jsdom
  });

  it.skip("should preserve filename in compressed file", () => {
    // Requires canvas npm package for jsdom
  });
});
