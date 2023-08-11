import { EditorContextType } from "@easyblocks/app-utils";
import {
  buildRichTextComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextParagraphBlockElementComponentConfig,
  buildRichTextPartComponentConfig,
} from "../builders";
import { convertRichTextElementsToEditorValue } from "./convertRichTextElementsToEditorValue";

const testEditorContext: EditorContextType = {
  contextParams: {
    locale: "en",
  },
} as EditorContextType;

test("converts empty elements to default editor value", () => {
  expect(convertRichTextElementsToEditorValue([])).toEqual([
    {
      id: expect.any(String),
      type: "paragraph",
      children: [
        {
          type: "text-line",
          id: expect.any(String),
          children: [
            {
              id: expect.any(String),
              color: {
                ref: "black",
                value: "black",
              },
              font: {
                ref: "$body",
                value: "",
              },
              text: "",
            },
          ],
        },
      ],
    },
  ]);
});

test("converts paragraph with single line containing single text part", () => {
  const richTextSingleLineComponentConfig = buildRichTextComponentConfig({
    elements: [
      buildRichTextParagraphBlockElementComponentConfig({
        elements: [
          buildRichTextLineElementComponentConfig({
            elements: [
              buildRichTextPartComponentConfig({
                color: {
                  $res: true,
                  xl: "red",
                },
                font: {
                  $res: true,
                  xl: {
                    fontFamily: "sans serif",
                    fontSize: 16,
                    lineHeight: 1.4,
                  },
                },
                value: "Lorem ipsum",
              }),
            ],
          }),
        ],
      }),
    ],
    compilationContext: testEditorContext,
    mainColor: {
      $res: true,
    },
    mainFont: {
      $res: true,
    },
  }).elements[testEditorContext.contextParams.locale];

  expect(
    convertRichTextElementsToEditorValue(richTextSingleLineComponentConfig)
  ).toEqual([
    {
      id: expect.any(String),
      type: "paragraph",
      children: [
        {
          type: "text-line",
          id: expect.any(String),
          children: [
            {
              id: expect.any(String),
              color: {
                $res: true,
                xl: "red",
              },
              font: {
                $res: true,
                xl: {
                  fontFamily: "sans serif",
                  fontSize: 16,
                  lineHeight: 1.4,
                },
              },
              text: "Lorem ipsum",
            },
          ],
        },
      ],
    },
  ]);
});

test("converts paragraph with single line containing multiple text parts", () => {
  const richTextSingleLineComponentConfig = buildRichTextComponentConfig({
    elements: [
      buildRichTextParagraphBlockElementComponentConfig({
        elements: [
          buildRichTextLineElementComponentConfig({
            elements: [
              buildRichTextPartComponentConfig({
                color: {
                  $res: true,
                  xl: "red",
                },
                font: {
                  $res: true,
                  xl: {
                    fontFamily: "sans serif",
                    fontSize: 16,
                    lineHeight: 1.4,
                  },
                },
                value: "Lorem ipsum",
              }),
              buildRichTextPartComponentConfig({
                color: {
                  $res: true,
                  xl: "red",
                },
                font: {
                  $res: true,
                  xl: {
                    fontFamily: "sans serif",
                    fontSize: 16,
                    lineHeight: 1.4,
                  },
                },
                value: " dolor ",
              }),
              buildRichTextPartComponentConfig({
                color: {
                  $res: true,
                  xl: "red",
                },
                font: {
                  $res: true,
                  xl: {
                    fontFamily: "sans serif",
                    fontSize: 16,
                    lineHeight: 1.4,
                  },
                },
                value: "sit amet",
              }),
            ],
          }),
        ],
      }),
    ],
    compilationContext: testEditorContext,
    mainColor: {
      $res: true,
    },
    mainFont: {
      $res: true,
    },
  }).elements[testEditorContext.contextParams.locale];

  expect(
    convertRichTextElementsToEditorValue(richTextSingleLineComponentConfig)
  ).toEqual([
    {
      id: expect.any(String),
      type: "paragraph",
      children: [
        {
          type: "text-line",
          id: expect.any(String),
          children: [
            {
              id: expect.any(String),
              color: {
                $res: true,
                xl: "red",
              },
              font: {
                $res: true,
                xl: {
                  fontFamily: "sans serif",
                  fontSize: 16,
                  lineHeight: 1.4,
                },
              },
              text: "Lorem ipsum",
            },
            {
              id: expect.any(String),
              color: {
                $res: true,
                xl: "red",
              },
              font: {
                $res: true,
                xl: {
                  fontFamily: "sans serif",
                  fontSize: 16,
                  lineHeight: 1.4,
                },
              },
              text: " dolor ",
            },
            {
              id: expect.any(String),
              color: {
                $res: true,
                xl: "red",
              },
              font: {
                $res: true,
                xl: {
                  fontFamily: "sans serif",
                  fontSize: 16,
                  lineHeight: 1.4,
                },
              },
              text: "sit amet",
            },
          ],
        },
      ],
    },
  ]);
});

test("converts paragraph of multiple lines each containing single text part", () => {
  const richTextSingleLineComponentConfig = buildRichTextComponentConfig({
    elements: [
      buildRichTextParagraphBlockElementComponentConfig({
        elements: [
          buildRichTextLineElementComponentConfig({
            elements: [
              buildRichTextPartComponentConfig({
                color: {
                  $res: true,
                  xl: "red",
                },
                font: {
                  $res: true,
                  xl: {
                    fontFamily: "sans serif",
                    fontSize: 16,
                    lineHeight: 1.4,
                  },
                },
                value: "Lorem ipsum",
              }),
            ],
          }),
          buildRichTextLineElementComponentConfig({
            elements: [
              buildRichTextPartComponentConfig({
                color: {
                  $res: true,
                  xl: "red",
                },
                font: {
                  $res: true,
                  xl: {
                    fontFamily: "sans serif",
                    fontSize: 16,
                    lineHeight: 1.4,
                  },
                },
                value: "dolor sit amet",
              }),
            ],
          }),
        ],
      }),
    ],
    compilationContext: testEditorContext,
    mainColor: {
      $res: true,
    },
    mainFont: {
      $res: true,
    },
  }).elements[testEditorContext.contextParams.locale];

  expect(
    convertRichTextElementsToEditorValue(richTextSingleLineComponentConfig)
  ).toEqual([
    {
      id: expect.any(String),
      type: "paragraph",
      children: [
        {
          type: "text-line",
          id: expect.any(String),
          children: [
            {
              id: expect.any(String),
              color: {
                $res: true,
                xl: "red",
              },
              font: {
                $res: true,
                xl: {
                  fontFamily: "sans serif",
                  fontSize: 16,
                  lineHeight: 1.4,
                },
              },
              text: "Lorem ipsum",
            },
          ],
        },
        {
          type: "text-line",
          id: expect.any(String),
          children: [
            {
              id: expect.any(String),
              color: {
                $res: true,
                xl: "red",
              },
              font: {
                $res: true,
                xl: {
                  fontFamily: "sans serif",
                  fontSize: 16,
                  lineHeight: 1.4,
                },
              },
              text: "dolor sit amet",
            },
          ],
        },
      ],
    },
  ]);
});
