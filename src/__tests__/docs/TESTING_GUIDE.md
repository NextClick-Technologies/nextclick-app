# Testing Strategy & Implementation Guide

## Overview

This document outlines the comprehensive testing strategy implemented for the nextclick-app project. The goal is to create a scalable testing infrastructure that supports the application as it grows from 20% to 100% completion.

---

## Current Test Coverage

### ✅ Completed (143 Passing Tests)

#### 1. **Test Infrastructure**

- ✅ Jest configuration with TypeScript support
- ✅ Testing utilities (`src/__tests__/utils/test-utils.tsx`)
- ✅ Mock infrastructure for Supabase and Fetch
- ✅ Test fixtures for Client, Company, and Project resources
- ✅ Path alias support (`@/` → `src/`)

#### 2. **Unit Tests - Utilities** (70+ tests)

- ✅ `api-utils.test.ts` - **50 tests**

  - Case transformation (camelCase ↔ snake_case)
  - Pagination parsing and building
  - OrderBy parsing
  - Error handling
  - Response formatting

- ✅ `cn.test.ts` - **17 tests**
  - Tailwind className merging
  - Conditional classes
  - Variant handling

#### 3. **Unit Tests - Schemas** (76+ tests)

- ✅ `client.schema.test.ts` - **51 tests**

  - All field validations (name, familyName, email, phone, etc.)
  - Enum validations (Title, Gender, ClientStatus)
  - UUID validation for companyId
  - Default values
  - Partial update schema

- ✅ `pagination.schema.test.ts` - **25 tests**
  - Page/pageSize validation
  - Min/max constraints
  - Type coercion
  - Edge cases

#### 4. **Test Fixtures**

- ✅ Client fixtures (camelCase + snake_case variants)
- ✅ Company fixtures
- ✅ Project fixtures
- ✅ Helper functions for creating paginated responses

---

## Test Organization Structure

```
src/__tests__/
├── fixtures/               # Mock data for testing
│   ├── client.fixtures.ts
│   ├── company.fixtures.ts
│   ├── project.fixtures.ts
│   └── index.ts
├── mocks/                  # Mock implementations
│   ├── supabase.mock.ts   # Supabase client mock
│   └── fetch.mock.ts      # Fetch API mock
├── utils/                  # Test utilities
│   └── test-utils.tsx     # React Query provider wrapper
├── unit/                   # Unit tests
│   ├── utils/
│   │   ├── api-utils.test.ts
│   │   └── cn.test.ts
│   └── schemas/
│       ├── client.schema.test.ts
│       └── pagination.schema.test.ts
└── integration/            # Integration tests
    ├── api/               # API route tests
    └── hooks/             # React Query hook tests
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- client.schema.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should validate"
```

### Coverage Thresholds

Configured in `jest.config.ts`:

- **Utilities**: Target 90-100%
- **Schemas**: Target 90-100%
- **API Routes**: Target 80-90%
- **Hooks**: Target 80-90%
- **UI Components**: Target 70-80%

---

## Testing Patterns & Best Practices

### 1. **Unit Tests**

**Utilities (`src/lib/api/api-utils.ts`)**

```typescript
describe("transformToDb", () => {
  it("should convert camelCase keys to snake_case", () => {
    const data = {
      firstName: "John",
      lastName: "Doe",
      emailAddress: "john@example.com",
    };

    const result = transformToDb(data);

    expect(result).toEqual({
      first_name: "John",
      last_name: "Doe",
      email_address: "john@example.com",
    });
  });
});
```

**Schemas (`src/schemas/client.schema.ts`)**

```typescript
describe("clientSchema", () => {
  it("should validate correct client data", () => {
    const validData = {
      name: "John",
      familyName: "Doe",
      phoneNumber: "+1234567890",
      companyId: "550e8400-e29b-41d4-a716-446655440001",
    };

    const result = clientSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });
});
```

### 2. **Integration Tests - React Query Hooks**

**Example for `useClient` hooks:**

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useClients } from "@/hooks/useClient";

describe("useClients", () => {
  it("should fetch clients successfully", async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [mockClient],
            pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
          }),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useClients(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={new QueryClient()}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.data).toHaveLength(1);
  });
});
```

### 3. **Component Tests**

**Example for UI components:**

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("should render with text", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should handle onClick", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    screen.getByText("Click").click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Next Steps (Remaining 80% of Project)

### Phase 1: Complete Unit Tests (Week 1-2)

1. **Remaining Schemas** (40-50 tests)

   - [ ] `company.schema.test.ts`
   - [ ] `project.schema.test.ts`
   - [ ] `employee.schema.test.ts`
   - [ ] `milestone.schema.test.ts`
   - [ ] `payment.schema.test.ts`
   - [ ] `communication-log.schema.test.ts`

2. **Image Utility** (10-15 tests)

   - [ ] `image.test.ts` - Test compression logic
   - Mock Canvas/Image APIs

3. **UI Components** (70-80 tests)
   - [ ] All 15 Radix UI components
   - Focus on Button, Dialog, Select, Input first

### Phase 2: Integration Tests (Week 3-4)

1. **React Query Hooks** (50-55 tests)

   - [ ] `useClient.test.ts` (5 hooks × 3 tests = 15)
   - [ ] `useCompany.test.ts`
   - [ ] `useProject.test.ts`
   - [ ] `useEmployee.test.ts`
   - [ ] `useMilestone.test.ts`
   - [ ] `usePayment.test.ts`
   - [ ] `useCommunicationLog.test.ts`
   - [ ] `useProjectMembers.test.ts`

2. **API Routes** (65-70 tests)
   - Use **MSW (Mock Service Worker)** for HTTP mocking
   - Test each CRUD endpoint for all 7 resources
   - Test case transformations
   - Test error handling

### Phase 3: E2E Tests (Week 5-6)

1. **Setup Playwright or Cypress**
2. **Critical User Flows** (10-15 tests)
   - [ ] Authentication flow
   - [ ] Client CRUD operations
   - [ ] Project management with team members
   - [ ] Payment processing
   - [ ] Communication logs

---

## Recommended Libraries

### Current Stack

- ✅ Jest - Test runner
- ✅ @testing-library/react - Component testing
- ✅ @testing-library/user-event - User interactions
- ✅ @testing-library/jest-dom - Custom matchers

### Recommended Additions

- **MSW (Mock Service Worker)** - For API mocking

  ```bash
  npm install --save-dev msw
  ```

- **Playwright** - For E2E tests

  ```bash
  npm init playwright@latest
  ```

- **@testing-library/react-hooks** - If needed for older React versions

---

## Key Insights & Recommendations

### 1. **Case Transformation is Critical**

- Every API endpoint transforms camelCase ↔ snake_case
- Any bug in `transformToDb` or `transformFromDb` affects all 7 resources
- **Priority**: Keep 100% coverage on these utilities

### 2. **Consistent CRUD Patterns**

- All resources follow the same pattern
- Write one comprehensive test suite, then replicate for others
- Use test generators or templates

### 3. **Zod Schema Validation**

- Schemas are the first line of defense
- Test all validation rules thoroughly
- Include edge cases (empty strings, null, undefined)

### 4. **Mock Data Management**

- Centralized fixtures prevent duplication
- Keep fixtures in sync with database types
- Use helper functions for common patterns

### 5. **Test-Driven Development (TDD)**

- For remaining 80% of features, write tests FIRST
- This ensures:
  - Better API design
  - Fewer bugs
  - Self-documenting code

---

## Coverage Goals

| Layer       | Current  | Target   | Priority  |
| ----------- | -------- | -------- | --------- |
| Utilities   | ~90%     | 95%+     | 🔴 High   |
| Schemas     | ~75%     | 95%+     | 🔴 High   |
| API Routes  | 0%       | 85%+     | 🔴 High   |
| Hooks       | 0%       | 85%+     | 🔴 High   |
| Components  | 0%       | 75%+     | 🟡 Medium |
| Pages       | 0%       | 60%+     | 🟢 Low    |
| **Overall** | **~15%** | **80%+** | -         |

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Troubleshooting

### Common Issues

**1. "Cannot find module '@/...'"**

- Ensure `moduleNameMapper` is configured in `jest.config.ts`
- Check `tsconfig.json` paths

**2. "TextEncoder is not defined"**

- Added polyfill in `jest.setup.ts`

**3. "Request is not defined" (Next.js API routes)**

- Mock Next.js server utilities
- Consider using MSW for API route testing

**4. "Tests are slow"**

- Use `--maxWorkers=50%` to limit parallelism
- Mock heavy dependencies (database, external APIs)

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Conclusion

We've established a solid foundation with **143 passing tests** covering:

- ✅ Core utilities (case transformation, pagination, orderBy)
- ✅ Validation schemas (Client, Pagination)
- ✅ Helper functions (cn utility)
- ✅ Test infrastructure (fixtures, mocks, utilities)

**Next Priority**: Complete remaining schema tests, then move to React Query hooks integration tests using MSW for realistic API mocking.

The testing infrastructure is now **production-ready** and will scale effectively as the project grows to 100% completion.
