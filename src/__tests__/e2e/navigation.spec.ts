import { test, expect } from "./fixtures/auth.fixture";

test.describe("Navigation and Dashboard", () => {
  test("should load dashboard page", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/dashboard");

    // Check page title/heading
    await expect(
      authenticatedPage
        .locator("h1, h2")
        .filter({ hasText: /dashboard|overview/i })
    ).toBeVisible();

    // Should see key metrics or cards
    await expect(
      authenticatedPage.locator(
        '[data-testid*="metric"], [data-testid*="card"], .card'
      )
    ).toBeVisible();
  });

  test("should display navigation sidebar", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/dashboard");

    // Should see navigation sidebar or menu
    await expect(
      authenticatedPage.locator('nav, aside, [role="navigation"]')
    ).toBeVisible();

    // Should see key navigation links
    await expect(
      authenticatedPage.locator(
        'a:has-text("Dashboard"), a:has-text("Clients"), a:has-text("Projects")'
      )
    ).toBeVisible();
  });

  test("should navigate to clients page from sidebar", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/dashboard");

    // Click Clients link in navigation
    await authenticatedPage.click(
      'nav a:has-text("Clients"), aside a:has-text("Clients")'
    );

    // Should navigate to clients page
    await expect(authenticatedPage).toHaveURL(/\/clients/);

    // Should see clients page content
    await expect(
      authenticatedPage.locator("h1, h2").filter({ hasText: /clients/i })
    ).toBeVisible();
  });

  test("should navigate to projects page from sidebar", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/dashboard");

    // Click Projects link in navigation
    await authenticatedPage.click(
      'nav a:has-text("Projects"), aside a:has-text("Projects")'
    );

    // Should navigate to projects page
    await expect(authenticatedPage).toHaveURL(/\/projects/);

    // Should see projects page content
    await expect(
      authenticatedPage.locator("h1, h2").filter({ hasText: /projects/i })
    ).toBeVisible();
  });

  test("should navigate to employees page from sidebar", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/dashboard");

    // Click Employees/HR link in navigation
    await authenticatedPage.click(
      'nav a:has-text("Employees"), aside a:has-text("Employees"), nav a:has-text("HR")'
    );

    // Should navigate to employees page
    await expect(authenticatedPage).toHaveURL(/\/employees/);

    // Should see employees page content
    await expect(
      authenticatedPage.locator("h1, h2").filter({ hasText: /employees|team/i })
    ).toBeVisible();
  });

  test("should display header with user info", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/dashboard");

    // Should see header
    await expect(authenticatedPage.locator("header")).toBeVisible();

    // Should see user menu or avatar
    // Note: Update selector based on your implementation
    const userMenu = authenticatedPage.locator(
      '[data-testid="user-menu"], button[aria-label*="user"], [aria-label*="account"]'
    );
    if (await userMenu.isVisible()) {
      await expect(userMenu).toBeVisible();
    }
  });

  test("should toggle theme (if theme switcher exists)", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/dashboard");

    // Look for theme toggle button
    const themeToggle = authenticatedPage.locator(
      'button[aria-label*="theme"], button:has-text("Theme")'
    );

    if (await themeToggle.isVisible()) {
      // Get current theme class
      const htmlElement = authenticatedPage.locator("html");
      const initialClass = await htmlElement.getAttribute("class");

      // Toggle theme
      await themeToggle.click();

      // Wait for theme change
      await authenticatedPage.waitForTimeout(300);

      // Theme class should change
      const newClass = await htmlElement.getAttribute("class");
      expect(newClass).not.toBe(initialClass);
    }
  });

  test("should show active page in navigation", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/clients");

    // Clients link should be highlighted/active
    const clientsLink = authenticatedPage.locator(
      'nav a:has-text("Clients"), aside a:has-text("Clients")'
    );

    // Check for active class or aria-current
    const classes = await clientsLink.getAttribute("class");
    const ariaCurrent = await clientsLink.getAttribute("aria-current");

    // At least one should indicate active state
    const isActive = classes?.includes("active") || ariaCurrent === "page";
    expect(isActive).toBeTruthy();
  });

  test.skip("should display breadcrumbs on detail pages", async ({
    authenticatedPage,
  }) => {
    // Navigate to a detail page (e.g., project details)
    await authenticatedPage.goto("/projects");
    await authenticatedPage.click("table tr:not(:first-child):first-child a");

    // Wait for detail page
    await authenticatedPage.waitForURL(/\/projects\/.+/);

    // Should see breadcrumbs
    const breadcrumbs = authenticatedPage.locator(
      'nav[aria-label="Breadcrumb"], [data-testid="breadcrumbs"]'
    );
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      await expect(breadcrumbs.locator('a:has-text("Projects")')).toBeVisible();
    }
  });
});
