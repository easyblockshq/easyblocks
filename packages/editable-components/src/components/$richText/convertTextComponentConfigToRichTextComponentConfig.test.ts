import { defaultTheme } from "@easyblocks/app-utils";
import { TextComponentConfig } from "../$text/$text";
import { RichTextComponentConfig } from "./$richText";
import { convertTextComponentConfigToRichTextComponentConfig } from "./convertTextComponentConfigToRichTextComponentConfig";

const DEFAULT_BODY = defaultTheme.fonts.$body.value;
const TEST_LOCALE = "en";

test("converts when text is a single line", () => {
  const testTextComponentConfig: TextComponentConfig = {
    _id: "testId",
    _template: "$text",
    color: {
      $res: true,
      b4: {
        ref: "black",
        value: "black",
      },
    },
    font: {
      $res: true,
      b4: {
        ref: "$body",
        value: DEFAULT_BODY,
      },
    },
    value: {
      id: "testTextId",
    },
    accessibilityRole: "p",
  };

  const expectedRichTextComponentConfig: RichTextComponentConfig = {
    _id: expect.any(String),
    _template: "$richText",

    accessibilityRole: "div",
    elements: {
      [TEST_LOCALE]: [
        {
          $$$refs: undefined,
          _id: expect.any(String),
          _template: "$richTextBlockElement",

          elements: [
            {
              $$$refs: undefined,
              _id: expect.any(String),
              _template: "$richTextLineElement",

              elements: [
                {
                  $$$refs: undefined,
                  _id: expect.any(String),
                  _template: "$richTextPart",

                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "resolved test text value",
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
      [
        {
          id: "testTextId",
          values: {
            default: {
              [TEST_LOCALE]: "resolved test text value",
            },
          },
          status: "success",
          error: null,
          type: "text",
        },
      ]
    )
  ).toEqual(expectedRichTextComponentConfig);
});

test("converts when text contains new line", () => {
  const testTextComponentConfig: TextComponentConfig = {
    _id: "testId",
    _template: "$text",
    color: {
      $res: true,
      b4: {
        ref: "black",
        value: "black",
      },
    },
    font: {
      $res: true,
      b4: {
        ref: "$body",
        value: DEFAULT_BODY,
      },
    },
    value: {
      id: "testTextId",
    },
    accessibilityRole: "p",
  };

  const expectedRichTextComponentConfig: RichTextComponentConfig = {
    _id: expect.any(String),
    _template: "$richText",

    accessibilityRole: "div",
    elements: {
      [TEST_LOCALE]: [
        {
          _id: expect.any(String),
          _template: "$richTextBlockElement",

          elements: [
            {
              _id: expect.any(String),
              _template: "$richTextLineElement",

              elements: [
                {
                  _id: expect.any(String),
                  _template: "$richTextPart",

                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "resolved test text value",
                },
              ],
            },
            {
              _id: expect.any(String),
              _template: "$richTextLineElement",

              elements: [
                {
                  _id: expect.any(String),
                  _template: "$richTextPart",

                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "next line of resolved text value",
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
      [
        {
          id: "testTextId",
          values: {
            default: {
              [TEST_LOCALE]:
                "resolved test text value\nnext line of resolved text value",
            },
          },
          status: "success",
          error: null,
          type: "text",
        },
      ]
    )
  ).toEqual(expectedRichTextComponentConfig);
});

test("converts when text contains more than one new line between text lines", () => {
  const testTextComponentConfig: TextComponentConfig = {
    _id: "testId",
    _template: "$text",
    color: {
      $res: true,
      b4: {
        ref: "black",
        value: "black",
      },
    },
    font: {
      $res: true,
      b4: {
        ref: "$body",
        value: DEFAULT_BODY,
      },
    },
    value: {
      id: "testTextId",
    },
    accessibilityRole: "p",
  };

  const expectedRichTextComponentConfig: RichTextComponentConfig = {
    _id: expect.any(String),
    _template: "$richText",
    accessibilityRole: "div",
    elements: {
      [TEST_LOCALE]: [
        {
          _id: expect.any(String),
          _template: "$richTextBlockElement",
          elements: [
            {
              _id: expect.any(String),
              _template: "$richTextLineElement",
              elements: [
                {
                  _id: expect.any(String),
                  _template: "$richTextPart",
                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "resolved test text value",
                },
              ],
            },
            {
              _id: expect.any(String),
              _template: "$richTextLineElement",
              elements: [
                {
                  _id: expect.any(String),
                  _template: "$richTextPart",
                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "",
                },
              ],
            },
            {
              _id: expect.any(String),
              _template: "$richTextLineElement",
              elements: [
                {
                  _id: expect.any(String),
                  _template: "$richTextPart",
                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "",
                },
              ],
            },
            {
              _id: expect.any(String),
              _template: "$richTextLineElement",
              elements: [
                {
                  _id: expect.any(String),
                  _template: "$richTextPart",
                  color: testTextComponentConfig.color,
                  font: testTextComponentConfig.font,
                  value: "next line of resolved text value",
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
      [
        {
          id: "testTextId",
          values: {
            default: {
              [TEST_LOCALE]:
                "resolved test text value\n\n\nnext line of resolved text value",
            },
          },
          status: "success",
          error: null,
          type: "text",
        },
      ]
    )
  ).toEqual(expectedRichTextComponentConfig);
});
