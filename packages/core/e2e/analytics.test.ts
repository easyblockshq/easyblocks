import { test, expect, ConsoleMessage } from "@playwright/test";
import { TracingEvent } from "../src/types";
import { buildQueryParam } from "./utils";

const collectLog =
  (messages: TracingEvent[]) => async (msg: ConsoleMessage) => {
    for (const arg of msg.args()) {
      if (msg.type() === "log") {
        messages.push(await arg.jsonValue());
      }
    }
  };

test.use({
  viewport: {
    height: 1000,
    width: 568,
  },
});

test.describe.skip("Basic tracing", () => {
  test("Impression and Click on action", async ({ page }) => {
    const loggedValues: TracingEvent[] = [];
    page.on("console", await collectLog(loggedValues));

    const path = "analytics.image";
    const url = buildQueryParam({ path });

    await page.goto(url);
    await page.waitForSelector("img");

    expect(loggedValues).toContainEqual({
      event: "impression",
      source: {
        component: undefined,
        props: undefined,
        traceId: "Typiara_01",
        type: "item",
      },
    });

    await page.click("img");

    expect(loggedValues).toContainEqual({
      event: "click",
      source: {
        component: undefined,
        props: undefined,
        traceId: "Typiara_01",
        type: "item",
      },
    });
  });

  test("Click on action with traceClick disabled", async ({ page }) => {
    const loggedValues: TracingEvent[] = [];
    page.on("console", await collectLog(loggedValues));

    const path = "analytics.image.traceClickDisabled";
    const url = buildQueryParam({ path });

    await page.goto(url);
    await page.waitForSelector("img");

    expect(loggedValues).toContainEqual({
      event: "impression",
      source: {
        component: undefined,
        props: undefined,
        traceId: "Typiara_01",
        type: "item",
      },
    });

    await page.click("img");

    expect(loggedValues).not.toContainEqual({
      event: "click",
      source: {
        component: undefined,
        props: undefined,
        traceId: "Typiara_01",
        type: "item",
      },
    });
  });

  test("No impression when traceImpressions disabled", async ({ page }) => {
    const loggedValues: TracingEvent[] = [];
    page.on("console", await collectLog(loggedValues));

    const path = "analytics.image.traceImpressionsDisabled";
    const url = buildQueryParam({ path });

    await page.goto(url);
    await page.waitForSelector("img");

    expect(loggedValues).not.toContainEqual({
      event: "impression",
      source: {
        component: undefined,
        props: undefined,
        traceId: "Typiara_01",
        type: "item",
      },
    });

    await page.click("img");

    expect(loggedValues).toContainEqual({
      event: "click",
      source: {
        component: undefined,
        props: undefined,
        traceId: "Typiara_01",
        type: "item",
      },
    });
  });
});

test.describe.skip("Basic tracing of custom component", () => {
  test("Impression and Click", async ({ page }) => {
    const loggedValues: TracingEvent[] = [];
    page.on("console", await collectLog(loggedValues));

    const path = "analytics.button";
    const url = buildQueryParam({ path });

    await page.goto(url);
    await page.waitForSelector("button");

    expect(loggedValues).toContainEqual({
      event: "impression",
      source: {
        component: "Button",
        props: {
          action: [
            {
              _id: "f821cf84-257e-48a4-bca9-b416f8652853",
              _template: "MyAction",
            },
          ],
          label: {
            id: "local.d878ebc1-cb9b-43c5-bb7c-71f291c7162f",
            value: "Lorem ipsum",
          },
          light: false,
          outline: false,
          symbol: [],
        },
        traceId: "Button-44f5b9da",
        type: "button",
      },
    });

    await page.click("button");

    expect(loggedValues).toContainEqual({
      event: "click",
      source: {
        component: "Button",
        props: {
          action: [
            {
              _id: "f821cf84-257e-48a4-bca9-b416f8652853",
              _template: "MyAction",
            },
          ],
          label: {
            id: "local.d878ebc1-cb9b-43c5-bb7c-71f291c7162f",
            value: "Lorem ipsum",
          },
          light: false,
          outline: false,
          symbol: [],
        },
        traceId: "Button-44f5b9da",
        type: "button",
      },
    });
  });

  test("Click on button with traceClick disabled", async ({ page }) => {
    const loggedValues: TracingEvent[] = [];
    page.on("console", await collectLog(loggedValues));

    const path = "analytics.button.traceClicksDisabled";
    const url = buildQueryParam({ path });

    await page.goto(url);
    await page.waitForSelector("button");

    expect(loggedValues).toContainEqual({
      event: "impression",
      source: {
        component: "Button",
        props: {
          action: [
            {
              _id: "f821cf84-257e-48a4-bca9-b416f8652853",
              _template: "MyAction",
            },
          ],
          label: {
            id: "local.d878ebc1-cb9b-43c5-bb7c-71f291c7162f",
            value: "Lorem ipsum",
          },
          light: false,
          outline: false,
          symbol: [],
        },
        traceId: "Button-44f5b9da",
        type: "button",
      },
    });

    await page.click("button");

    expect(loggedValues).not.toContainEqual({
      event: "click",
      source: {
        component: "Button",
        props: {
          action: [
            {
              _id: "f821cf84-257e-48a4-bca9-b416f8652853",
              _template: "MyAction",
            },
          ],
          label: {
            id: "local.d878ebc1-cb9b-43c5-bb7c-71f291c7162f",
            value: "Lorem ipsum",
          },
          light: false,
          outline: false,
          symbol: [],
        },
        traceId: "Button-44f5b9da",
        type: "button",
      },
    });
  });
});

test.skip("Impression fires only after element appears on the screen", async ({
  page,
}) => {
  const loggedValues: TracingEvent[] = [];

  page.on("console", collectLog(loggedValues));

  const path = "analytics.slider";
  const url = buildQueryParam({ path });
  await page.goto(url);

  const rightArrow = await page.locator(
    "data-testid=RightArrowWrapper >> button"
  );

  await page.waitForTimeout(500);

  const lastMessage = loggedValues.pop();
  expect(lastMessage).toEqual({
    event: "impression",
    source: {
      traceId: "1",
      component: "ProductCard",
      props: {
        hasBorder: false,
        product: {
          id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NDU1MzY0Mjg=",
          value: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NDU1MzY0Mjg=",
            images: [
              {
                alt: "The Carry-On",
                src: "https://cdn.shopify.com/s/files/1/0587/0528/1196/products/PDP_Serena_Drop2_PC_Coral_CAR_3x4_374191af-3882-4381-bc13-123e4ab653e5_400x400.jpg?v=1627035841",
              },
            ],
            price: "236.0",
            title: "The Carry-On",
          },
        },
        productOptional: {
          id: null,
        },
      },
      type: "card",
    },
  });

  await test.step("Slide to 2nd product", async () => {
    await rightArrow.click();
    await page.waitForTimeout(500);
    const lastMessage = loggedValues.pop();
    expect(lastMessage).toEqual({
      event: "impression",
      source: {
        traceId: "2",
        component: "ProductCard",
        props: {
          hasBorder: false,
          product: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NzE2MTk3NTY=",
            value: {
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NzE2MTk3NTY=",
              images: [
                {
                  alt: "The Bigger Carry-On",
                  src: "https://cdn.shopify.com/s/files/1/0587/0528/1196/products/PDP_Serena_Drop2_PC_Aqua_BCO_3x4_b94e7bcb-4b6a-4b29-b5ef-d508622f7610_400x400.jpg?v=1627037454",
                },
              ],
              price: "255.0",
              title: "The Bigger Carry-On",
            },
          },
          productOptional: {
            id: null,
          },
        },
        type: "card",
      },
    });
  });

  await test.step("Slide to 3rd product", async () => {
    await page.locator("data-testid=itemContainers.2").waitFor();
    await rightArrow.click();
    await page.waitForTimeout(500);

    const lastMessage = loggedValues.pop();
    expect(lastMessage).toEqual({
      event: "impression",
      source: {
        traceId: "3",
        component: "ProductCard",
        props: {
          hasBorder: false,
          product: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NDU1MzY0Mjg=",
            value: {
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NDU1MzY0Mjg=",
              images: [
                {
                  alt: "The Carry-On",
                  src: "https://cdn.shopify.com/s/files/1/0587/0528/1196/products/PDP_Serena_Drop2_PC_Coral_CAR_3x4_374191af-3882-4381-bc13-123e4ab653e5_400x400.jpg?v=1627035841",
                },
              ],
              price: "236.0",
              title: "The Carry-On",
            },
          },
          productOptional: {
            id: null,
          },
        },
        type: "card",
      },
    });
  });

  await test.step("Slide to 4th product", async () => {
    await rightArrow.click();
    await page.waitForTimeout(500);
    const lastMessage = loggedValues.pop();
    expect(lastMessage).toEqual({
      event: "impression",
      source: {
        traceId: "4",
        component: "ProductCard",
        props: {
          hasBorder: false,
          product: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NzE2MTk3NTY=",
            value: {
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NzE2MTk3NTY=",
              images: [
                {
                  alt: "The Bigger Carry-On",
                  src: "https://cdn.shopify.com/s/files/1/0587/0528/1196/products/PDP_Serena_Drop2_PC_Aqua_BCO_3x4_b94e7bcb-4b6a-4b29-b5ef-d508622f7610_400x400.jpg?v=1627037454",
                },
              ],
              price: "255.0",
              title: "The Bigger Carry-On",
            },
          },
          productOptional: {
            id: null,
          },
        },
        type: "card",
      },
    });
  });

  await test.step("Slide to 5th product", async () => {
    await rightArrow.click();
    await page.waitForTimeout(500);

    const lastMessage = loggedValues.pop();
    expect(lastMessage).toEqual({
      event: "impression",
      source: {
        traceId: "5",
        component: "ProductCard",
        props: {
          hasBorder: false,
          product: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NDU1MzY0Mjg=",
            value: {
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NDU1MzY0Mjg=",
              images: [
                {
                  alt: "The Carry-On",
                  src: "https://cdn.shopify.com/s/files/1/0587/0528/1196/products/PDP_Serena_Drop2_PC_Coral_CAR_3x4_374191af-3882-4381-bc13-123e4ab653e5_400x400.jpg?v=1627035841",
                },
              ],
              price: "236.0",
              title: "The Carry-On",
            },
          },
          productOptional: {
            id: null,
          },
        },
        type: "card",
      },
    });
  });

  await test.step("Slide to 6th product", async () => {
    await rightArrow.click();
    await page.waitForTimeout(500);

    const lastMessage = loggedValues.pop();
    expect(lastMessage).toEqual({
      event: "impression",
      source: {
        traceId: "6",
        component: "ProductCard",
        props: {
          hasBorder: false,
          product: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NzE2MTk3NTY=",
            value: {
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY4Mzk2NzE2MTk3NTY=",
              images: [
                {
                  alt: "The Bigger Carry-On",
                  src: "https://cdn.shopify.com/s/files/1/0587/0528/1196/products/PDP_Serena_Drop2_PC_Aqua_BCO_3x4_b94e7bcb-4b6a-4b29-b5ef-d508622f7610_400x400.jpg?v=1627037454",
                },
              ],
              price: "255.0",
              title: "The Bigger Carry-On",
            },
          },
          productOptional: {
            id: null,
          },
        },
        type: "card",
      },
    });
  });
});

test.describe.skip("'intermediate' Banner/Grid/TwoCards", () => {
  test.use({
    viewport: {
      height: 500,
      width: 640,
    },
  });

  test("Should trace impression of 'intermediate' BannerCard as section", async ({
    page,
  }) => {
    const loggedValues: TracingEvent[] = [];

    page.on("console", collectLog(loggedValues));

    const path = "analytics.cardInSection";
    const url = buildQueryParam({ path });
    await page.goto(url);

    expect(loggedValues).toContainEqual({
      event: "impression",
      source: {
        traceId: "BannerCardAsSection",
        type: "section",
        component: undefined,
        props: undefined,
      },
    });
    expect(loggedValues).toContainEqual({
      event: "impression",
      source: {
        traceId: "BannerCard",
        type: "card",
        component: undefined,
        props: undefined,
      },
    });
  });

  test("Should trace impression of 'intermediate' GridCard as section", async ({
    page,
  }) => {
    const loggedValues: TracingEvent[] = [];

    page.on("console", collectLog(loggedValues));

    const path = "analytics.cardInGrid";
    const url = buildQueryParam({ path });
    await page.goto(url);

    expect(loggedValues).toContainEqual({
      event: "impression",
      source: {
        traceId: "$GridCard-0a40aa76",
        type: "section",
        component: undefined,
        props: undefined,
      },
    });

    expect(loggedValues).toContainEqual({
      event: "impression",
      source: {
        traceId: "$BannerCard-d200f0e1",
        type: "card",
        component: undefined,
        props: undefined,
      },
    });
  });

  test("Should trace impression of 'intermediate' TwoCards as section", async ({
    page,
  }) => {
    const loggedValues: TracingEvent[] = [];

    page.on("console", collectLog(loggedValues));

    const path = "analytics.cardInTwoCards";
    const url = buildQueryParam({ path });
    await page.goto(url);

    expect(loggedValues).toContainEqual({
      event: "impression",
      source: {
        traceId: "$TwoCardsCard-d308a3bc",
        type: "section",
        component: undefined,
        props: undefined,
      },
    });

    expect(loggedValues).toContainEqual({
      event: "impression",
      source: {
        traceId: "$BannerCard-9bee7935",
        type: "card",
        component: undefined,
        props: undefined,
      },
    });
  });
});

test.describe.skip("Scrolling", () => {
  test.use({
    viewport: {
      height: 500,
      width: 640,
    },
  });

  test("Should trace impression while scrolling", async ({ page }) => {
    const loggedValues: TracingEvent[] = [];

    page.on("console", collectLog(loggedValues));

    const path = "analytics.scroll";
    const url = buildQueryParam({ path });

    await page.goto(url);

    expect(loggedValues.length).toEqual(1);
    expect(loggedValues[0]).toEqual({
      event: "impression",
      source: {
        traceId: "widoczek",
        type: "item",
      },
    });

    await test.step("Scroll to 2nd image", async () => {
      await page.evaluate(() => window.scrollTo(0, 400));
      await page.waitForTimeout(500);
      expect(loggedValues.length).toEqual(2);
      expect(loggedValues[1]).toEqual({
        event: "impression",
        source: {
          traceId: "typiara",
          type: "item",
        },
      });
    });

    await test.step("Scroll to 3rd image", async () => {
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(500);
      expect(loggedValues.length).toEqual(3);
      expect(loggedValues[2]).toEqual({
        event: "impression",
        source: {
          traceId: "bunkier",
          type: "item",
        },
      });
    });

    await test.step("Scroll to 4th image", async () => {
      await page.evaluate(() => window.scrollTo(0, 1200));
      await page.waitForTimeout(500);
      expect(loggedValues.length).toEqual(4);
      expect(loggedValues[3]).toEqual({
        event: "impression",
        source: {
          traceId: "zlom",
          type: "item",
        },
      });
    });
  });
});

test.describe.skip("Scrolling on short viewport", () => {
  test.use({
    viewport: {
      height: 100,
      width: 640,
    },
  });

  test("Should trace impression when >=50 viewport height visible", async ({
    page,
  }) => {
    const loggedValues: TracingEvent[] = [];

    page.on("console", collectLog(loggedValues));

    const path = "analytics.image.shortViewport";
    const url = buildQueryParam({ path });

    await page.goto(url);

    expect(loggedValues).toEqual([]);

    await test.step("Scroll almost to the image", async () => {
      await page.evaluate(() => {
        window.scrollTo(0, 1000);
      });
      await page.waitForTimeout(500);
      expect(loggedValues).toEqual([
        {
          event: "impression",
          source: {
            traceId: "widoczek",
            type: "item",
          },
        },
      ]);
    });
  });
});
