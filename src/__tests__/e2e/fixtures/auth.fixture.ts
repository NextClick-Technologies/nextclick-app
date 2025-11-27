import { test as base } from "@playwright/test";
import { login } from "../helpers/auth";

/**
 * Authenticated test fixture
 * Use this for tests that require authentication
 */
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login before each test
    await login(page);
    await use(page);
    // Cleanup happens automatically
  },
});

export { expect } from "@playwright/test";
