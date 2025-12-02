import DOMPurify from "dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(dirty: string): string {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    // For server-side rendering, return the string as-is
    // You may want to use a server-side sanitization library like isomorphic-dompurify
    return dirty;
  }

  // Use type assertion to avoid config type issues
  const sanitized = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
      "span",
      "div",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
    ALLOW_DATA_ATTR: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  return String(sanitized);
}

/**
 * Sanitizes plain text by escaping HTML characters
 * Use this when you want to display user input as plain text
 * @param text - The text to sanitize
 * @returns Escaped text safe for rendering
 */
export function sanitizeText(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
