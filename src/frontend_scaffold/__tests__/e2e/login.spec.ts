import { test, expect } from "@playwright/test";

/**
 * E2E: login flow.
 * Verifies the Microsoft sign-in button is present on the /login page.
 */
test("shows sign-in button on login page", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /sign in with microsoft/i })).toBeVisible();
});
