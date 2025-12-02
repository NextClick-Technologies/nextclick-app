# XSS Protection with DOMPurify

## Quick Start

### Installation

Already installed. Import and use:

```tsx
import { sanitizeHtml, sanitizeText } from "@/shared/utils/sanitize";
```

## When to Sanitize

**ALWAYS sanitize user-generated content before rendering HTML.**

### Use `sanitizeHtml()` for:

- Project/milestone descriptions
- Employee/company addresses
- Any rich text/HTML from users or database

### Use `sanitizeText()` for:

- Plain text that should never contain HTML
- Simple string fields

## Usage

### Rendering User HTML Content

```tsx
// ✅ CORRECT
import { sanitizeHtml } from "@/shared/utils/sanitize";

export function ProjectCard({ project }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(project.description),
      }}
    />
  );
}
```

```tsx
// ❌ WRONG - NEVER DO THIS
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

### Rendering Plain Text

```tsx
// For plain text (escapes HTML)
import { sanitizeText } from "@/shared/utils/sanitize";

<p>{sanitizeText(userInput)}</p>;
```

## What's Allowed

### ✅ Safe HTML (Allowed)

- Text formatting: `<strong>`, `<em>`, `<u>`
- Structure: `<p>`, `<div>`, `<span>`, `<br>`
- Headings: `<h1>` to `<h6>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Links: `<a href="https://...">` (only https/http)
- Code: `<code>`, `<pre>`
- Quotes: `<blockquote>`

### ❌ Blocked (Security)

- Scripts: `<script>`
- Event handlers: `onclick`, `onerror`, `onload`, etc.
- JavaScript URLs: `javascript:`, `data:`, `vbscript:`
- Dangerous tags: `<iframe>`, `<object>`, `<embed>`
- Attributes: `style`, `data-*`

## Common Patterns

### Project Descriptions

```tsx
<div
  className="text-sm"
  dangerouslySetInnerHTML={{
    __html: sanitizeHtml(project.description || ""),
  }}
/>
```

### Milestone Descriptions

```tsx
{
  milestone.description && (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(milestone.description),
      }}
    />
  );
}
```

### Addresses

```tsx
{
  address && (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(address),
      }}
    />
  );
}
```

### Tables with User Content

```tsx
{
  items.map((item) => (
    <div
      key={item.id}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(item.description),
      }}
    />
  ));
}
```

## Testing

Run sanitization tests:

```bash
npm test -- sanitize.test.ts
```

Test file: `src/__tests__/unit/utils/sanitize.test.ts`

## Rules

1. **Never** use `dangerouslySetInnerHTML` without `sanitizeHtml()`
2. **Always** sanitize before rendering, not on input
3. **Validate** on input (Zod), **sanitize** on output (DOMPurify)
4. **Use** `sanitizeText()` for plain text to prevent HTML rendering

## Examples of XSS Attacks Prevented

```typescript
// These are automatically blocked:
sanitizeHtml('<script>alert("XSS")</script>');
// Output: '' (empty)

sanitizeHtml('<img src=x onerror=alert("XSS")>');
// Output: '<img src="x">' (onerror removed)

sanitizeHtml('<a href="javascript:alert()">Click</a>');
// Output: '<a>Click</a>' (href removed)

// Safe content passes through:
sanitizeHtml("<p>Hello <strong>world</strong></p>");
// Output: '<p>Hello <strong>world</strong></p>'
```

## Resources

- Utility: `src/shared/utils/sanitize.ts`
- Tests: `src/__tests__/unit/utils/sanitize.test.ts`
- Full docs: `docs/DOMPURIFY_COMPLETE_REPORT.md`
- [DOMPurify GitHub](https://github.com/cure53/DOMPurify)
