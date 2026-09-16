import { test, expect } from "@playwright/test";

test.describe("Kanban Board Application", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Ensure cards are hydrated and rendered
    await expect(page.locator(".kanban-card", { hasText: "Design System Tokens" })).toBeVisible();
  });

  test("renders 1 board with fixed 5 columns and initial cards", async ({ page }) => {
    await expect(page.locator("h1.board-title")).toHaveText("Project Board");

    // Verify exactly 5 columns
    const columns = page.locator(".kanban-column");
    await expect(columns).toHaveCount(5);

    const expectedTitles = ["Backlog", "To Do", "In Progress", "Review", "Done"];
    for (let i = 0; i < expectedTitles.length; i++) {
      await expect(columns.nth(i).locator(".column-title")).toHaveText(expectedTitles[i]);
    }

    // Verify initial cards exist
    await expect(page.locator(".kanban-card", { hasText: "Design System Tokens" })).toBeVisible();
    await expect(page.locator(".kanban-card", { hasText: "Research Component Libraries" })).toBeVisible();
    await expect(page.locator(".kanban-card", { hasText: "Drag and Drop Integration" })).toBeVisible();
  });

  test("adds a new card to a column", async ({ page }) => {
    const backlogColumn = page.locator(".kanban-column").first();
    const countBefore = await backlogColumn.locator(".kanban-card").count();

    // Click Add card button
    await backlogColumn.locator(".column-add-btn").click();

    // Modal should appear
    const modal = page.locator(".modal-overlay");
    await expect(modal).toBeVisible();

    // Fill form
    await modal.locator("#card-title-input").fill("Automated Test Task");
    await modal.locator("#card-details-input").fill("Details for automated test card");
    await modal.locator("button[type='submit']").click();

    // Modal closes
    await expect(modal).not.toBeVisible();

    // Card should appear in the column
    await expect(page.locator(".kanban-card", { hasText: "Automated Test Task" })).toBeVisible();
    await expect(page.locator(".card-details", { hasText: "Details for automated test card" })).toBeVisible();

    const countAfter = await backlogColumn.locator(".kanban-card").count();
    expect(countAfter).toBe(countBefore + 1);
  });

  test("deletes an existing card", async ({ page }) => {
    const card = page.locator(".kanban-card", { hasText: "Design System Tokens" });
    await expect(card).toBeVisible();

    // Click delete button
    await card.locator(".card-delete-btn").click();

    // Card should disappear
    await expect(card).not.toBeVisible();
  });

  test("edits an existing card details", async ({ page }) => {
    const card = page.locator(".kanban-card", { hasText: "Research Component Libraries" });
    await expect(card).toBeVisible();

    // Click card to open edit modal
    await card.click();

    const modal = page.locator(".modal-overlay");
    await expect(modal).toBeVisible();
    await expect(modal.locator(".modal-title")).toHaveText("Edit Card");

    // Update details
    await modal.locator("#card-details-input").fill("Updated research notes and findings.");
    await modal.locator("button[type='submit']").click();

    await expect(modal).not.toBeVisible();
    await expect(card.locator(".card-details")).toHaveText("Updated research notes and findings.");
  });

  test("renames a column", async ({ page }) => {
    const column = page.locator(".kanban-column").first();
    await column.locator(".column-rename-btn").click();

    const input = column.locator(".column-title-input");
    await expect(input).toBeVisible();

    await input.fill("Ideas & Requests");
    await input.press("Enter");

    await expect(column.locator(".column-title")).toHaveText("Ideas & Requests");
  });

  test("moves a card between columns using keyboard drag and drop", async ({ page }) => {
    const sourceCard = page.locator(".kanban-card", { hasText: "Design System Tokens" });
    await sourceCard.focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Space");

    // Verify card moved to 'To Do' column (index 1)
    const targetColumn = page.locator(".kanban-column").nth(1);
    await expect(targetColumn.locator(".kanban-card", { hasText: "Design System Tokens" })).toBeVisible();
  });

  test("toggles dark theme", async ({ page }) => {
    const boardShell = page.locator(".board-shell");
    await expect(boardShell).not.toHaveClass(/dark-theme/);

    const themeToggleBtn = page.locator(".theme-toggle-btn");
    await expect(themeToggleBtn).toHaveText("Dark Mode");

    // Click to switch to dark mode
    await themeToggleBtn.click();
    await expect(boardShell).toHaveClass(/dark-theme/);
    await expect(themeToggleBtn).toHaveText("Light Mode");

    // Click to switch back to light mode
    await themeToggleBtn.click();
    await expect(boardShell).not.toHaveClass(/dark-theme/);
    await expect(themeToggleBtn).toHaveText("Dark Mode");
  });
});

