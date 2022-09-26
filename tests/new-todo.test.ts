import { test, expect } from "@playwright/test";

import {
  checkNumberOfTodosInLocalStorage,
  createDefaultTodos,
  TODO_ITEMS,
  visitTestApp,
} from "./test-utils";

import { allure } from "allure-playwright";

test.beforeEach(async ({ page }) => {
  allure.severity("High");
  allure.epic("E2E Tests for all Todo app features set");
  allure.feature("Single item operations");
  allure.owner("eroshenkoam");

  await visitTestApp(page);
});

// comments

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({ page },testInfo) => {
    allure.description("This Test makes shure, you can add todo items");
    allure.story("Todo note creation");
    allure.issue({
      url: "https://github.com/allure-framework/allure-js/pull/408",
      name: "github issue",
    });
    allure.tag("critical");
    allure.tag("release");
    allure.tag("regular");

    await testInfo.attach("TODO_ITEMS", {
      body: JSON.stringify(TODO_ITEMS),
      contentType: "application/json",
    });

    await test.step("Create 1st todo.", async () => {
      await page.locator(".new-todo").fill(TODO_ITEMS[0]);
      await page.locator(".new-todo").press("Enter");
    });

    await expect(
      page.locator(".view label"),
      "Make sure the list only has one todo item."
    ).toHaveText([TODO_ITEMS[0]]);

    await test.step("Create 2nd todo.", async () => {
      await page.locator(".new-todo").fill(TODO_ITEMS[1]);
      await page.locator(".new-todo").press("Enter");
    });

    await expect(
      page.locator(".view label"),
      "Make sure the list now has two todo items."
    ).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);

    await checkNumberOfTodosInLocalStorage(page, 2);
  });

  test("text input field must be cleared when a new item is added", async ({
    page,
  }) => {
    allure.description("check if text input is cleared field after a new item is added");
    allure.story("Todo note creation");    
    allure.tag("single");
    allure.tag("critical");
    allure.tag("smoke");

    await test.step("Create one todo item.", async () => {
      await page.locator(".new-todo").fill(TODO_ITEMS[0]);
      await page.locator(".new-todo").press("Enter");
    });
    await expect(
      page.locator(".new-todo"),
      "Check that input is empty."
    ).toBeEmpty();
    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test("should append new items to the bottom of the list", async ({
    page,
  }) => {
    allure.description("Check if a newly created item is added to the bottom of the existing list");
    allure.issue({ url: "https://qameta.io/", name: "qameta.io site" });
    allure.tag("non-critical");
    allure.tag("release");
    allure.tag("smoke");
    
    allure.story("Todo note creation");

    await test.step("Create 3 todo items.", async () => {
      await createDefaultTodos(page);
    });
    await test.step("Check test using different methods.", async () => {
      await expect(page.locator(".todo-count")).toHaveText("3 items left");
      await expect(page.locator(".todo-count")).toContainText("3");
      await expect(page.locator(".todo-count")).toHaveText(/3/);
    });

    await test.step("Check all items in one call.", async () => {
      await expect(page.locator(".view label")).toHaveText(TODO_ITEMS);
      await checkNumberOfTodosInLocalStorage(page, 3);
    });
  });
});
