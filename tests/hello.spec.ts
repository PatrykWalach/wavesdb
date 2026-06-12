import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("hello world", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("h1")).toHaveText("Welcome to React Router");
});

test("database works", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "POWER!", exact: true })).toBeVisible();
});
