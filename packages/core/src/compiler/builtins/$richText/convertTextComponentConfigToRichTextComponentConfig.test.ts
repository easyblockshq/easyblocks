import { TextComponentConfig } from "../$text/$text";
import { RichTextComponentConfig } from "./$richText";
import { convertTextComponentConfigToRichTextComponentConfig } from "./convertTextComponentConfigToRichTextComponentConfig";

const DEFAULT_BODY = { fontFamily: "sans-serif", fontSize: 16 };
const TEST_LOCALE = "en";

test("converts when text is a single line", () => {
  const testTextComponentConfig: TextComponentConfig = {
    _id: "testId",
    _component: "@easyblocks/text",
    color: {
      $res: true,
      xl: {
        tokenId: "black",
        value: "black",
        widgetId: "@easyblocks/color",
      },
    },
    font: {
      $res: true,
      xl: {
        tokenId: "$body",
        value: DEFAULT_BODY,
      },
    },
    value: {
      id: "testTextId",
      widgetId: "text",
    },
    accessibilityRole: "p",
  };

  const expectedRichTextComponentConfig: RichTextComponentConfig = {
    _id: expect.any(String),
    _component: "@easyblocks/rich-text",

    accessibilityRole: "div",
    elements: {
      [TEST_LOCALE]: [
        {
          $$$refs: undefined,
          _id: expect.any(String),
          _component: "@easyblocks/rich-text-block-element",

          elements: [
            {
              $$$refs: undefined,
              _id: expect.any(String),
              _component: "@easyblocks/rich-text-line-element",

              elements: [
                {
                  $$$refs: undefined,
                  _id: expect.any(String),
                  _component: "@easyblocks/rich-text-part",

                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "resolved test text value",
                  TextWrapper: [],
                },
              ],
            },
          ],
          type: "paragraph",
        },
      ],
    },
    isListStyleAuto: true,
    mainColor: testTextComponentConfig.color,
    mainFont: testTextComponentConfig.font,
  };

  expect(
    convertTextComponentConfigToRichTextComponentConfig(
      testTextComponentConfig,
      "en",

      {
        "testId.value": {
          type: "text",
          value: "resolved test text value",
        },
      }
    )
  ).toEqual(expectedRichTextComponentConfig);
});

test("converts when text contains new line", () => {
  const testTextComponentConfig: TextComponentConfig = {
    _id: "testId",
    _component: "@easyblocks/text",
    color: {
      $res: true,
      xl: {
        tokenId: "black",
        value: "black",
        widgetId: "@easyblocks/color",
      },
    },
    font: {
      $res: true,
      xl: {
        tokenId: "$body",
        value: DEFAULT_BODY,
      },
    },
    value: {
      id: "testTextId",
      widgetId: "text",
    },
    accessibilityRole: "p",
  };

  const expectedRichTextComponentConfig: RichTextComponentConfig = {
    _id: expect.any(String),
    _component: "@easyblocks/rich-text",

    accessibilityRole: "div",
    elements: {
      [TEST_LOCALE]: [
        {
          _id: expect.any(String),
          _component: "@easyblocks/rich-text-block-element",

          elements: [
            {
              _id: expect.any(String),
              _component: "@easyblocks/rich-text-line-element",

              elements: [
                {
                  _id: expect.any(String),
                  _component: "@easyblocks/rich-text-part",

                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "resolved test text value",
                  TextWrapper: [],
                },
              ],
            },
            {
              _id: expect.any(String),
              _component: "@easyblocks/rich-text-line-element",

              elements: [
                {
                  _id: expect.any(String),
                  _component: "@easyblocks/rich-text-part",

                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "next line of resolved text value",
                  TextWrapper: [],
                },
              ],
            },
          ],
          type: "paragraph",
        },
      ],
    },
    isListStyleAuto: true,
    mainColor: testTextComponentConfig.color,
    mainFont: testTextComponentConfig.font,
  };

  expect(
    convertTextComponentConfigToRichTextComponentConfig(
      testTextComponentConfig,
      "en",
      {
        "testId.value": {
          type: "text",
          value: "resolved test text value\nnext line of resolved text value",
        },
      }
    )
  ).toEqual(expectedRichTextComponentConfig);
});

test("converts when text contains more than one new line between text lines", () => {
  const testTextComponentConfig: TextComponentConfig = {
    _id: "testId",
    _component: "@easyblocks/text",
    color: {
      $res: true,
      xl: {
        tokenId: "black",
        value: "black",
        widgetId: "@easyblocks/color",
      },
    },
    font: {
      $res: true,
      xl: {
        tokenId: "$body",
        value: DEFAULT_BODY,
      },
    },
    value: {
      id: "testTextId",
      widgetId: "text",
    },
    accessibilityRole: "p",
  };

  const expectedRichTextComponentConfig: RichTextComponentConfig = {
    _id: expect.any(String),
    _component: "@easyblocks/rich-text",
    accessibilityRole: "div",
    elements: {
      [TEST_LOCALE]: [
        {
          _id: expect.any(String),
          _component: "@easyblocks/rich-text-block-element",
          elements: [
            {
              _id: expect.any(String),
              _component: "@easyblocks/rich-text-line-element",
              elements: [
                {
                  _id: expect.any(String),
                  _component: "@easyblocks/rich-text-part",
                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "resolved test text value",
                  TextWrapper: [],
                },
              ],
            },
            {
              _id: expect.any(String),
              _component: "@easyblocks/rich-text-line-element",
              elements: [
                {
                  _id: expect.any(String),
                  _component: "@easyblocks/rich-text-part",
                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "",
                  TextWrapper: [],
                },
              ],
            },
            {
              _id: expect.any(String),
              _component: "@easyblocks/rich-text-line-element",
              elements: [
                {
                  _id: expect.any(String),
                  _component: "@easyblocks/rich-text-part",
                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "",
                  TextWrapper: [],
                },
              ],
            },
            {
              _id: expect.any(String),
              _component: "@easyblocks/rich-text-line-element",
              elements: [
                {
                  _id: expect.any(String),
                  _component: "@easyblocks/rich-text-part",
                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "next line of resolved text value",
                  TextWrapper: [],
                },
              ],
            },
          ],
          type: "paragraph",
        },
      ],
    },
    isListStyleAuto: true,
    mainColor: testTextComponentConfig.color,
    mainFont: testTextComponentConfig.font,
  };

  expect(
    convertTextComponentConfigToRichTextComponentConfig(
      testTextComponentConfig,
      "en",
      {
        "testId.value": {
          type: "text",
          value:
            "resolved test text value\n\n\nnext line of resolved text value",
        },
      }
    )
  ).toEqual(expectedRichTextComponentConfig);
});
