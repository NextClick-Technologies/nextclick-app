import { sanitizeHtml, sanitizeText } from "@/shared/utils/sanitize";

describe("sanitizeHtml", () => {
  describe("XSS Attack Prevention", () => {
    it("should remove script tags", () => {
      const malicious = '<script>alert("XSS")</script><p>Safe content</p>';
      const result = sanitizeHtml(malicious);

      expect(result).not.toContain("<script>");
      expect(result).not.toContain("alert");
      expect(result).toContain("<p>Safe content</p>");
    });

    it("should remove inline event handlers", () => {
      const malicious = '<img src=x onerror=alert("XSS")>';
      const result = sanitizeHtml(malicious);

      expect(result).not.toContain("onerror");
      expect(result).not.toContain("alert");
    });

    it("should remove javascript: URLs", () => {
      const malicious = "<a href=\"javascript:alert('XSS')\">Click me</a>";
      const result = sanitizeHtml(malicious);

      expect(result).not.toContain("javascript:");
    });

    it("should remove onclick handlers", () => {
      const malicious = "<div onclick=\"alert('XSS')\">Click me</div>";
      const result = sanitizeHtml(malicious);

      expect(result).not.toContain("onclick");
      expect(result).toContain("Click me");
    });

    it("should remove onerror handlers from images", () => {
      const malicious = '<img src="invalid.jpg" onerror="alert(\'XSS\')">';
      const result = sanitizeHtml(malicious);

      expect(result).not.toContain("onerror");
    });

    it("should remove iframe tags", () => {
      const malicious = '<iframe src="evil.com"></iframe><p>Content</p>';
      const result = sanitizeHtml(malicious);

      expect(result).not.toContain("<iframe");
      expect(result).not.toContain("evil.com");
      expect(result).toContain("<p>Content</p>");
    });

    it("should remove object and embed tags", () => {
      const malicious = '<object data="evil.swf"></object><p>Safe</p>';
      const result = sanitizeHtml(malicious);

      expect(result).not.toContain("<object");
      expect(result).toContain("<p>Safe</p>");
    });

    it("should handle multiple XSS vectors in one string", () => {
      const malicious = `
        <script>alert('1')</script>
        <img src=x onerror=alert('2')>
        <a href="javascript:alert('3')">Link</a>
        <p>Safe content</p>
      `;
      const result = sanitizeHtml(malicious);

      expect(result).not.toContain("<script>");
      expect(result).not.toContain("onerror");
      expect(result).not.toContain("javascript:");
      expect(result).toContain("<p>Safe content</p>");
    });
  });

  describe("Safe HTML Preservation", () => {
    it("should allow paragraphs", () => {
      const safe = "<p>This is a paragraph</p>";
      const result = sanitizeHtml(safe);

      expect(result).toBe("<p>This is a paragraph</p>");
    });

    it("should allow strong tags", () => {
      const safe = "<strong>Bold text</strong>";
      const result = sanitizeHtml(safe);

      expect(result).toBe("<strong>Bold text</strong>");
    });

    it("should allow em tags", () => {
      const safe = "<em>Italic text</em>";
      const result = sanitizeHtml(safe);

      expect(result).toBe("<em>Italic text</em>");
    });

    it("should allow headings h1-h6", () => {
      const safe = "<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>";
      const result = sanitizeHtml(safe);

      expect(result).toContain("<h1>Title</h1>");
      expect(result).toContain("<h2>Subtitle</h2>");
      expect(result).toContain("<h3>Section</h3>");
    });

    it("should allow lists (ul, ol, li)", () => {
      const safe = "<ul><li>Item 1</li><li>Item 2</li></ul>";
      const result = sanitizeHtml(safe);

      expect(result).toContain("<ul>");
      expect(result).toContain("<li>Item 1</li>");
      expect(result).toContain("</ul>");
    });

    it("should allow links with safe href", () => {
      const safe = '<a href="https://example.com">Link</a>';
      const result = sanitizeHtml(safe);

      expect(result).toContain('<a href="https://example.com">');
      expect(result).toContain("Link");
    });

    it("should allow blockquote", () => {
      const safe = "<blockquote>Quote</blockquote>";
      const result = sanitizeHtml(safe);

      expect(result).toBe("<blockquote>Quote</blockquote>");
    });

    it("should allow code and pre tags", () => {
      const safe = "<pre><code>const x = 1;</code></pre>";
      const result = sanitizeHtml(safe);

      expect(result).toContain("<pre>");
      expect(result).toContain("<code>");
      expect(result).toContain("const x = 1;");
    });

    it("should allow br tags", () => {
      const safe = "Line 1<br>Line 2";
      const result = sanitizeHtml(safe);

      expect(result).toContain("<br>");
    });

    it("should allow nested safe tags", () => {
      const safe = "<p>Text with <strong>bold</strong> and <em>italic</em></p>";
      const result = sanitizeHtml(safe);

      expect(result).toContain("<p>");
      expect(result).toContain("<strong>bold</strong>");
      expect(result).toContain("<em>italic</em>");
    });
  });

  describe("Attribute Handling", () => {
    it("should allow href attribute on links", () => {
      const safe = '<a href="https://example.com">Link</a>';
      const result = sanitizeHtml(safe);

      expect(result).toContain('href="https://example.com"');
    });

    it("should allow class attribute", () => {
      const safe = '<p class="text-primary">Styled text</p>';
      const result = sanitizeHtml(safe);

      expect(result).toContain('class="text-primary"');
    });

    it("should allow target and rel on links", () => {
      const safe =
        '<a href="https://example.com" target="_blank" rel="noopener">Link</a>';
      const result = sanitizeHtml(safe);

      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener"');
    });

    it("should remove data attributes", () => {
      const unsafe = '<div data-user-id="123">Content</div>';
      const result = sanitizeHtml(unsafe);

      expect(result).not.toContain("data-user-id");
      expect(result).toContain("Content");
    });

    it("should remove style attributes", () => {
      const unsafe = '<p style="color: red;">Text</p>';
      const result = sanitizeHtml(unsafe);

      expect(result).not.toContain("style=");
      expect(result).toContain("Text");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string", () => {
      const result = sanitizeHtml("");
      expect(result).toBe("");
    });

    it("should handle plain text without HTML", () => {
      const plain = "Just plain text";
      const result = sanitizeHtml(plain);

      expect(result).toBe("Just plain text");
    });

    it("should handle malformed HTML", () => {
      const malformed = "<p>Unclosed tag";
      const result = sanitizeHtml(malformed);

      expect(result).toContain("Unclosed tag");
    });

    it("should handle HTML entities", () => {
      const withEntities =
        "<p>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</p>";
      const result = sanitizeHtml(withEntities);

      expect(result).toContain("<p>");
      // Entities are preserved as-is, which is safe since they're already escaped
      expect(result).toContain("&lt;script&gt;");
    });

    it("should handle unicode characters", () => {
      const unicode = "<p>Hello 世界 🌍</p>";
      const result = sanitizeHtml(unicode);

      expect(result).toBe("<p>Hello 世界 🌍</p>");
    });

    it("should handle mixed safe and unsafe content", () => {
      const mixed = `
        <p>Safe paragraph</p>
        <script>alert('unsafe')</script>
        <strong>Bold text</strong>
        <img src=x onerror=alert('XSS')>
        <em>Italic</em>
      `;
      const result = sanitizeHtml(mixed);

      expect(result).toContain("<p>Safe paragraph</p>");
      expect(result).toContain("<strong>Bold text</strong>");
      expect(result).toContain("<em>Italic</em>");
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("onerror");
    });
  });

  describe("Real-world Scenarios", () => {
    it("should sanitize project description with formatting", () => {
      const description = `
        <p>This is a project description with <strong>important</strong> details.</p>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>
      `;
      const result = sanitizeHtml(description);

      expect(result).toContain("<p>");
      expect(result).toContain("<strong>important</strong>");
      expect(result).toContain("<ul>");
      expect(result).toContain("<li>Feature 1</li>");
    });

    it("should sanitize user bio with links", () => {
      const bio =
        '<p>Check out my <a href="https://portfolio.com">portfolio</a></p>';
      const result = sanitizeHtml(bio);

      expect(result).toContain('<a href="https://portfolio.com">');
      expect(result).toContain("portfolio");
    });

    it("should handle address with line breaks", () => {
      const address = "123 Main St<br>Apt 4B<br>New York, NY 10001";
      const result = sanitizeHtml(address);

      expect(result).toContain("<br>");
      expect(result).toContain("123 Main St");
      expect(result).toContain("New York, NY 10001");
    });
  });
});

describe("sanitizeText", () => {
  it("should escape HTML tags", () => {
    const html = '<script>alert("XSS")</script>';
    const result = sanitizeText(html);

    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });

  it("should escape HTML entities", () => {
    const text = "A & B < C > D";
    const result = sanitizeText(text);

    expect(result).toContain("&amp;");
    expect(result).toContain("&lt;");
    expect(result).toContain("&gt;");
  });

  it("should handle plain text", () => {
    const text = "Just plain text";
    const result = sanitizeText(text);

    expect(result).toBe("Just plain text");
  });

  it("should handle text with quotes", () => {
    const text = "Text with \"quotes\" and 'apostrophes'";
    const result = sanitizeText(text);

    // textContent doesn't escape quotes, only HTML tags
    expect(result).toBe("Text with \"quotes\" and 'apostrophes'");
  });

  it("should handle empty string", () => {
    const result = sanitizeText("");
    expect(result).toBe("");
  });
});
