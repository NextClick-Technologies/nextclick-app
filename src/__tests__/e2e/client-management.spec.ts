import { test, expect } from "./fixtures/auth.fixture";
import { createTestClient, waitForApiResponse } from "./helpers/test-data";

test.describe("Client Management", () => {
  test("should display clients list page", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/clients");

    // Check page title/heading
    await expect(
      authenticatedPage.locator("h1, h2").filter({ hasText: /clients/i })
    ).toBeVisible();

    // Should see table or list of clients
    await expect(
      authenticatedPage.locator(
        'table, [role="table"], [data-testid*="client-list"]'
      )
    ).toBeVisible();
  });

  test("should open create client dialog/form", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/clients");

    // Click "Add Client" or "New Client" button
    await authenticatedPage.click(
      'button:has-text("Add"), button:has-text("New"), button:has-text("Create")'
    );

    // Should see form dialog/modal
    await expect(
      authenticatedPage
        .locator('[role="dialog"], form')
        .filter({ hasText: /client/i })
    ).toBeVisible();

    // Should see form fields
    await expect(authenticatedPage.locator('input[name="name"]')).toBeVisible();
    await expect(
      authenticatedPage.locator('input[name="email"]')
    ).toBeVisible();
  });

  test("should validate required fields when creating client", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/clients");

    // Open create dialog
    await authenticatedPage.click(
      'button:has-text("Add"), button:has-text("New"), button:has-text("Create")'
    );

    // Try to submit without filling required fields
    await authenticatedPage.click(
      'button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")'
    );

    // Should see validation errors or remain on form
    // Form should still be visible
    await expect(
      authenticatedPage
        .locator('[role="dialog"], form')
        .filter({ hasText: /client/i })
    ).toBeVisible();
  });

  test("should create new client successfully", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto("/clients");

    // Open create dialog
    await authenticatedPage.click(
      'button:has-text("Add"), button:has-text("New"), button:has-text("Create")'
    );

    // Fill form with test data
    const testClient = createTestClient();
    await authenticatedPage.fill('input[name="name"]', testClient.name);
    await authenticatedPage.fill('input[name="email"]', testClient.email);

    // Fill optional fields if present
    const phoneInput = authenticatedPage.locator('input[name="phoneNumber"]');
    if (await phoneInput.isVisible()) {
      await phoneInput.fill(testClient.phoneNumber || "");
    }

    // Submit form and wait for API response
    const responsePromise = waitForApiResponse(
      authenticatedPage,
      "/api/client"
    );
    await authenticatedPage.click(
      'button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")'
    );
    await responsePromise;

    // Should see success message or client in list
    await expect(
      authenticatedPage.locator(`text=${testClient.name}`).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should search/filter clients", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/clients");

    // Look for search input
    const searchInput = authenticatedPage.locator(
      'input[placeholder*="Search"], input[type="search"]'
    );

    if (await searchInput.isVisible()) {
      await searchInput.fill("test");

      // Wait for filtered results
      await authenticatedPage.waitForTimeout(500);

      // Results should be filtered
      // This is a basic check - adjust based on your implementation
      await expect(
        authenticatedPage.locator('table, [role="table"]')
      ).toBeVisible();
    }
  });

  test("should view client details", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/clients");

    // Click on first client row/link
    await authenticatedPage.click(
      'table tr:not(:first-child):first-child, [data-testid*="client-row"]:first-child'
    );

    // Should navigate to client detail page or open detail modal
    // Check for client information display
    await expect(
      authenticatedPage.locator("text=/email|phone|status/i")
    ).toBeVisible({ timeout: 5000 });
  });

  test.skip("should edit existing client", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/clients");

    // Find and click edit button on first client
    await authenticatedPage.click(
      'button[aria-label*="Edit"]:first, button:has-text("Edit"):first'
    );

    // Should see edit form
    await expect(authenticatedPage.locator('input[name="name"]')).toBeVisible();

    // Modify client name
    const newName = `Updated Client ${Date.now()}`;
    await authenticatedPage.fill('input[name="name"]', newName);

    // Submit changes
    const responsePromise = waitForApiResponse(
      authenticatedPage,
      "/api/client"
    );
    await authenticatedPage.click(
      'button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Update")'
    );
    await responsePromise;

    // Should see updated client in list
    await expect(
      authenticatedPage.locator(`text=${newName}`).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test.skip("should delete client", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/clients");

    // Get initial row count
    const initialCount = await authenticatedPage
      .locator('table tr:not(:first-child), [data-testid*="client-row"]')
      .count();

    // Click delete button on first client
    await authenticatedPage.click(
      'button[aria-label*="Delete"]:first, button:has-text("Delete"):first'
    );

    // Confirm deletion in dialog
    await authenticatedPage.click(
      'button:has-text("Confirm"), button:has-text("Delete"):last'
    );

    // Wait for API response
    await waitForApiResponse(authenticatedPage, "/api/client");

    // Row count should decrease
    const newCount = await authenticatedPage
      .locator('table tr:not(:first-child), [data-testid*="client-row"]')
      .count();
    expect(newCount).toBeLessThan(initialCount);
  });
});
