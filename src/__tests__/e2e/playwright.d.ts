/**
 * TypeScript declarations for Playwright custom fixtures
 */

import type { Page } from "@playwright/test";

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      // Add custom matchers here if needed
    }
  }
}

// Extend Playwright test fixtures
export interface CustomFixtures {
  authenticatedPage: Page;
}

// This merges with Playwright's built-in test types
declare module "@playwright/test" {
  export interface PlaywrightTestArgs extends CustomFixtures {}
}
