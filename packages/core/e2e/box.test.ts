import { test, expect } from "@playwright/test";
import { buildQueryParam } from "./utils";

test("boxes render properly with attributes passed", async ({ page }) => {
  const path = "box.basic";

  const url = buildQueryParam({ path });
  await page.goto(url);

  const span = await page.locator('span:has-text("I\'m span")');

  const spanElement = await span.evaluate((element) => element?.dataset);
  expect(spanElement).toEqual({
    refTest: "ref test value",
    spanAttribute: "span-attribute-value",
    testid: "Span",
  });
});
