import { test, expect } from "@playwright/test";
import { buildQueryParam } from "./utils";

test("basic test", async ({ page }) => {
  const path = "actions.action";

  const url = buildQueryParam({ path });
  await page.goto(url);

  const button = await page.locator("text=Lorem ipsum");
  await expect(button).toHaveText("Lorem ipsum");
  await expect(button).toHaveAttribute("href", "https://wikipedia.org");
  await expect(button).toHaveAttribute("target", "_blank");
});

test("empty action outputs default (no 'as' parameter)", async ({ page }) => {
  const path = "actions.empty-action";

  const url = buildQueryParam({ path });
  await page.goto(url);

  const element = page.locator('div:has( > :has-text("Lorem ipsum"))'); // no action makes a "div"
  const href = await element.getAttribute("href");
  expect(href).toEqual(null);
});

test("[custom button] non-link custom action outputs button that has action connected", async ({
  page,
}) => {
  const path = "actions.alert-action";

  const url = buildQueryParam({ path });

  await page.on("dialog", async (dialog) => {
    expect(dialog.message()).toEqual(
      "action text: The owls are not what they seem"
    );
    await dialog.dismiss();
  });

  await page.goto(url);
  await page.click("text=Click to alert");
});

test("[shopstory button] non-link custom action outputs button that has action connected", async ({
  page,
}) => {
  const path = "actions.shopstory-action";
  const url = buildQueryParam({ path });

  await page.on("dialog", async (dialog) => {
    expect(dialog.message()).toEqual(
      "action text: Every Day, Once A Day, Give Yourself A Present."
    );
    await dialog.dismiss();
  });

  await page.goto(url);
  await page.click("data-testid=ButtonRoot");
});

test("works correctly with target=blank", async ({ page }) => {
  const path = "actions.standard-link";
  const url = buildQueryParam({ path });

  await page.goto(url);
  const element = page.locator('a:has-text("Lorem ipsum")');
  const href = await element.getAttribute("href");
  expect(href).toEqual("https://wikipedia.org");
  const target = await element.getAttribute("target");
  expect(target).toEqual("_blank");
});

test("works correctly with NOT target=blank", async ({ page }) => {
  const path = "actions.standard-link-no-target";
  const url = buildQueryParam({ path });

  await page.goto(url);
  const element = page.locator('a:has-text("Lorem ipsum")');
  const href = await element.getAttribute("href");
  expect(href).toEqual("https://wikipedia.org");
  const target = await element.getAttribute("target");
  expect(target).toEqual(null);
});

test("[shopstory button] works correctly with shopstory button", async ({
  page,
}) => {
  const path = "actions.shopstory-standard-link";
  const url = buildQueryParam({ path });

  await page.goto(url);
  const element = page.locator("data-testid=ButtonRoot");
  const href = await element.getAttribute("href");
  expect(href).toEqual("https://wikipedia.org");
  const target = await element.getAttribute("target");
  expect(target).toEqual("_blank");
});
