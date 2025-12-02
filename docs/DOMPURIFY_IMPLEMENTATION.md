# DOMPurify Implementation Guide

> **Note:** This document has been superseded by a more concise developer guide.  
> **See:** [`docs/instructions/XSS_PROTECTION.md`](instructions/XSS_PROTECTION.md) for quick-start instructions.

For complete implementation details and test results, see [`docs/DOMPURIFY_COMPLETE_REPORT.md`](DOMPURIFY_COMPLETE_REPORT.md).

---

## Overview

DOMPurify has been implemented to prevent XSS (Cross-Site Scripting) attacks by sanitizing user-generated content before rendering.

## Installation

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

## Utility Functions

### Location

`src/shared/utils/sanitize.ts`

### Available Functions

#### 1. `sanitizeHtml(dirty: string, config?: DOMPurify.Config): string`

Sanitizes HTML content with a secure default configuration.

**When to use:**

- Rendering user-generated HTML content
- Displaying rich text from databases
- Showing formatted descriptions or notes

**Example:**

```tsx
import { sanitizeHtml } from "@/shared/utils/sanitize";

// In your component
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />;
```

**Default allowed tags:**

- Text: `p`, `span`, `div`, `br`
- Headings: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Formatting: `strong`, `em`, `u`, `code`, `pre`
- Lists: `ul`, `ol`, `li`
- Links: `a`
- Quotes: `blockquote`

**Default allowed attributes:**

- `href`, `target`, `rel`, `class`

#### 2. `sanitizeText(text: string): string`

Escapes HTML characters for plain text display.

**When to use:**

- Displaying user input as plain text
- Preventing any HTML interpretation
- Simple text fields without formatting

**Example:**

```tsx
import { sanitizeText } from "@/shared/utils/sanitize";

<p>{sanitizeText(userInput)}</p>;
```

## Areas Requiring Sanitization

### High Priority (User-Generated HTML)

1. **Project Descriptions** (`src/features/projects/`)

   - Display: `ProjectDatesAndDetails.tsx` - ✅ IMPLEMENTED
   - Table: `ProjectTable.tsx`
   - Forms: Description fields (input validation already handled by Zod)

2. **Milestone Descriptions** (`src/features/milestone/`)

   - Display: `MilestoneCard.tsx`
   - Forms: Milestone description fields

3. **Employee Addresses** (`src/features/employees/`)
   - Display: Employee detail pages
   - Forms: Address textarea fields

### Medium Priority (Rich Text Fields)

4. **Company Addresses** (`src/features/companies/`)
   - Display: Company detail pages
   - Forms: Address fields

### Low Priority (Plain Text - Use sanitizeText)

5. **Names, Emails, Phone Numbers**
   - Generally safe as they're validated by Zod schemas
   - Can use `sanitizeText()` for extra security

## Implementation Examples

### Example 1: Displaying Project Description

```tsx
// Before
<p className="text-sm">{description}</p>;

// After
import { sanitizeHtml } from "@/shared/utils/sanitize";

<div
  className="text-sm"
  dangerouslySetInnerHTML={{ __html: sanitizeHtml(description || "") }}
/>;
```

### Example 2: Custom Configuration

```tsx
import { sanitizeHtml } from "@/shared/utils/sanitize";

// Allow only basic text formatting
const cleanHtml = sanitizeHtml(userContent, {
  ALLOWED_TAGS: ["p", "br", "strong", "em"],
  ALLOWED_ATTR: [],
});

<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
```

### Example 3: Server-Side Note

The current implementation returns unsanitized content on the server-side (SSR). For production applications handling untrusted content, consider using `isomorphic-dompurify` for server-side sanitization:

```bash
npm install isomorphic-dompurify
```

## Security Best Practices

### 1. Always Sanitize User Content

- Never trust user input
- Sanitize before rendering, not just on input
- Defense in depth: validate on input (Zod) + sanitize on output (DOMPurify)

### 2. Use Appropriate Function

- `sanitizeHtml()`: For formatted content (HTML)
- `sanitizeText()`: For plain text display
- Never use `dangerouslySetInnerHTML` without sanitization

### 3. Keep DOMPurify Updated

```bash
npm update dompurify @types/dompurify
```

### 4. Test Sanitization

Create test cases with XSS payloads:

```tsx
const maliciousInput = '<script>alert("XSS")</script><p>Safe content</p>';
const sanitized = sanitizeHtml(maliciousInput);
// Should output: '<p>Safe content</p>'
```

## Common XSS Vectors to Prevent

- `<script>` tags
- Event handlers (`onclick`, `onerror`, etc.)
- `javascript:` URLs
- Data URIs with executable content
- `<iframe>` and `<object>` tags
- Style injection

## Migration Checklist

- [x] Install DOMPurify and types
- [x] Create sanitization utility
- [x] Update project description displays
- [x] Update milestone description displays
- [x] Update employee address displays
- [x] Update company address displays
- [x] Add sanitization tests (37 tests, all passing)
- [ ] Security audit review

## Testing

### Manual Testing

1. Try entering HTML: `<strong>Bold text</strong>`
2. Try XSS payload: `<script>alert('XSS')</script>`
3. Try event handlers: `<img src=x onerror=alert('XSS')>`
4. Verify only safe HTML renders

### Automated Testing

**Test Location**: `src/__tests__/unit/utils/sanitize.test.ts`

```tsx
import { sanitizeHtml, sanitizeText } from "@/shared/utils/sanitize";

describe("sanitizeHtml", () => {
  it("should remove script tags", () => {
    const input = '<script>alert("XSS")</script><p>Safe</p>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script>");
    expect(result).toContain("<p>Safe</p>");
  });

  it("should remove event handlers", () => {
    const input = '<img src=x onerror=alert("XSS")>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onerror");
  });
});
```

## Resources

- [DOMPurify GitHub](https://github.com/cure53/DOMPurify)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
