import { test, expect } from "@playwright/test";

import {
  checkNumberOfTodosInLocalStorage,
  createDefaultTodos,
  TODO_ITEMS,
  visitTestApp,
} from "./test-utils";

import { allure } from "allure-playwright";

test.beforeEach(async ({ page }) => {
  allure.severity("Hight");
  allure.epic("Todo App functionality");
  allure.owner("eroshenkoam");

  await visitTestApp(page);
});

// comments

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({ page },testInfo) => {
    allure.description("This Test make shure that you can add todo items");
    allure.issue({
      url: "https://github.com/allure-framework/allure-js/pull/408",
      name: "github issue",
    });

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

  test("should clear text input field when an item is added", async ({
    page,
  }) => {
    allure.description(
      "This Test make shure that text input was cleared field when an item is added"
    );
    allure.tag("unstable");

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
    allure.description(
      "This Test make shure that text input was cleared field when an item is added"
    );
    allure.issue({ url: "https://qameta.io/", name: "qameta.io site" });
    allure.tag("experemntal");

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
