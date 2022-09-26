import { test, expect } from "@playwright/test";
import { allure } from "allure-playwright";
import {
  checkNumberOfCompletedTodosInLocalStorage,
  checkNumberOfTodosInLocalStorage,
  createDefaultTodos,
  visitTestApp,
} from "./test-utils";

test.beforeEach(async ({ page }) => {
  allure.severity("Medium");
  allure.epic("E2E Tests for all Todo app features set");
  allure.feature("Manage the state via Bulk operations");
  allure.owner("baev");

  await visitTestApp(page);
});

test.describe("Mark all as completed", () => {

  test.beforeEach(async ({ page }) => {
    await test.step("Create default todos", async () => {
      await createDefaultTodos(page);
      await checkNumberOfTodosInLocalStorage(page, 3);
    });
  });

  test.afterEach(async ({ page }) => {
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("Check if an end user can mark all todo items as completed", async ({ page }) => {
    allure.story("Set the completed state via Bulk operations");
    allure.description("check if an end user can mark all items as completed");

    allure.tag("bulk");
    allure.tag("critical");
    allure.tag("smoke");

    await test.step("Complete all todos.", async () => {
      await page.locator(".toggle-all").check();
    });

    await expect(
      page.locator(".todo-list li"),
      "Ensure all todos have 'completed' class."
    ).toHaveClass(["completed", "completed", "completed"]);
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  });

  test("Check if an end user can clear the complete state of all items", async ({
    page,
  }, testInfo) => {
    allure.story("Clear the state via Bulk operations");
    allure.tag("bulk");
    allure.tag("critical");
    allure.tag("smoke");
    allure.tag("release");
    allure.description("Make shure, you can clear the complete state of all items");

    await test.step("Check and then immediately uncheck.", async () => {
      await page.locator(".toggle-all").check();
      await page.locator(".toggle-all").uncheck();
    });

    await testInfo.attach("All-completed-unchecked", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await expect(
      page.locator(".todo-list li"),
      "Should be no completed classes."
    ).toHaveClass(["", "", ""]);
  });

  test("check if \"complete all\" checkbox updates the state when items are completed / cleared", async ({
    page,
  }, testInfo) => {
    const toggleAll = page.locator(".toggle-all");
    await test.step("Toggle all", async () => {
      await toggleAll.check();
    });

    allure.tag("bulk");
    allure.tag("critical");
    allure.tag("smoke");
    allure.story("Set the completed state via Bulk operations");

    await expect(toggleAll).toBeChecked();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    const firstTodo = page.locator(".todo-list li").nth(0);
    await test.step("Uncheck first todo.", async () => {
      await firstTodo.locator(".toggle").uncheck();
    });

    
    await testInfo.attach("first-unchecked", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await expect(
      toggleAll,
      "Reuse toggleAll locator and make sure its not checked."
    ).not.toBeChecked();

    await test.step("Toggle first todo", async () => {
      await firstTodo.locator(".toggle").check();
      await checkNumberOfCompletedTodosInLocalStorage(page, 3);
    });

    await expect(
      toggleAll,
      "Assert the toggle all is checked again."
    ).toBeChecked();
  });
});
