import { test, expect } from "@playwright/test";

/**
 * E2E: streamliner configuration flow.
 * Requires an authenticated session (configure via Playwright storageState).
 */
test.describe("Streamliner page", () => {
  test("shows file dropzone after login", async ({ page }) => {
    await page.goto("/streamliner");
    await expect(page.getByText(/drag and drop files/i)).toBeVisible();
  });
});
