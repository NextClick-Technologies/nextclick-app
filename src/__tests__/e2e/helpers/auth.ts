import { Page } from "@playwright/test";

/**
 * E2E test authentication helpers
 */

export async function login(
  page: Page,
  email: string = "test@example.com",
  password: string = "password"
) {
  await page.goto("/signin");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("/dashboard");
}

export async function logout(page: Page) {
  // Click user menu/avatar
  await page.click('[data-testid="user-menu"]');
  await page.click("text=Sign out");
  await page.waitForURL("/signin");
}

export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check if we're on a protected route (not signin)
  const url = page.url();
  return !url.includes("/signin") && !url.includes("/signout");
}
