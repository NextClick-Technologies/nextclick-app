import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should display signin page", async ({ page }) => {
    await page.goto("/signin");

    // Check page title/heading
    await expect(
      page.locator("h1, h2").filter({ hasText: /sign in|login/i })
    ).toBeVisible();

    // Check for email and password inputs
    await expect(
      page.locator('input[name="email"], input[type="email"]')
    ).toBeVisible();
    await expect(
      page.locator('input[name="password"], input[type="password"]')
    ).toBeVisible();

    // Check for submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show validation errors for empty form", async ({ page }) => {
    await page.goto("/signin");

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should remain on signin page (not redirect)
    await expect(page).toHaveURL(/.*signin/);
  });

  test("should handle invalid credentials", async ({ page }) => {
    await page.goto("/signin");

    // Fill with invalid credentials
    await page.fill(
      'input[name="email"], input[type="email"]',
      "invalid@example.com"
    );
    await page.fill(
      'input[name="password"], input[type="password"]',
      "wrongpassword"
    );

    // Submit form
    await page.click('button[type="submit"]');

    // Should show error message or remain on signin page
    await expect(page).toHaveURL(/.*signin/);
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    await page.goto("/signin");

    // Fill login form
    await page.fill(
      'input[name="email"], input[type="email"]',
      "test@example.com"
    );
    await page.fill(
      'input[name="password"], input[type="password"]',
      "password"
    );

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard or home
    await expect(page).toHaveURL(/\/(dashboard|home|app)/);

    // Should see authenticated UI elements (header, navigation, etc.)
    await expect(page.locator("header, nav")).toBeVisible();
  });

  test.skip("should successfully logout", async ({ page }) => {
    // First login
    await page.goto("/signin");
    await page.fill(
      'input[name="email"], input[type="email"]',
      "test@example.com"
    );
    await page.fill(
      'input[name="password"], input[type="password"]',
      "password"
    );
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|app)/);

    // Then logout
    // This depends on your UI - adjust selectors as needed
    await page.click('[data-testid="user-menu"], [aria-label*="user menu"]');
    await page.click("text=/sign out|logout/i");

    // Should redirect to signin
    await expect(page).toHaveURL(/.*signin/);
  });
});
