import { test as base, type Page } from "@playwright/test";
import { login } from "../helpers/auth";

/**
 * Authenticated test fixture
 * Use this for tests that require authentication
 */
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    // Login before each test
    await login(page);
    await use(page);
    // Cleanup happens automatically
  },
});

export { expect } from "@playwright/test";
