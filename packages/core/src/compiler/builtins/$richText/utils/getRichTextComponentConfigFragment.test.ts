import { Form } from "@easyblocks/app-utils";
import { RichTextComponentConfig } from "../$richText";
import { createCompilationContext } from "../../../createCompilationContext";
import { EditorContextType } from "../../../types";
import {
  buildRichTextBlockElementComponentConfig,
  buildRichTextComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextPartComponentConfig,
} from "../builders";
import { getRichTextComponentConfigFragment } from "./getRichTextComponentConfigFragment";

const compilationContext = createCompilationContext(
  { accessToken: "" },
  { locale: "en" },
  "content"
);

const testEditorContext: EditorContextType = {
  ...compilationContext,
  mainBreakpointIndex: "b4",
  form: new Form({
    label: "Test",
    id: "test",
    onSubmit: () => {},
  }),
} as unknown as EditorContextType;

afterEach(() => {
  testEditorContext.form.reset();
  testEditorContext.focussedField.length = 0;
});

test("returns whole component config when all text is selected", () => {
  const sourceRichTextComponentConfig = buildRichTextComponentConfig({
    compilationContext: testEditorContext,
    elements: [
      buildRichTextBlockElementComponentConfig("paragraph", [
        buildRichTextLineElementComponentConfig({
          elements: [
            buildRichTextPartComponentConfig({
              color: {
                $res: true,
                [testEditorContext.mainBreakpointIndex]: {
                  value: "#fff",
                },
              },
              font: {
                $res: true,
                [testEditorContext.mainBreakpointIndex]: {
                  value: {
                    fontFamily: "Arial",
                    fontSize: 16,
                  },
                },
              },
              value: "Lorem ipsum",
            }),
          ],
        }),
      ]),
    ],
    mainColor: {
      $res: true,
      [testEditorContext.mainBreakpointIndex]: {
        value: "#fff",
      },
    },
    mainFont: {
      $res: true,
      [testEditorContext.mainBreakpointIndex]: {
        value: {
          fontFamily: "Arial",
          fontSize: 16,
        },
      },
    },
  });

  testEditorContext.form.change("", sourceRichTextComponentConfig);
  testEditorContext.focussedField = ["elements.en.0.elements.0.elements.0"];

  const expectedRichTextComponentConfigFragment: RichTextComponentConfig = {
    _id: testEditorContext.form.values._id,
    _template: "@easyblocks/rich-text",
    accessibilityRole: "div",
    elements: {
      [testEditorContext.contextParams.locale]: [
        {
          _template: "@easyblocks/rich-text-block-element",
          _id: testEditorContext.form.values.elements[
            testEditorContext.contextParams.locale
          ][0]._id,
          elements: [
            {
              _template: "@easyblocks/rich-text-line-element",
              _id: testEditorContext.form.values.elements[
                testEditorContext.contextParams.locale
              ][0].elements[0]._id,
              elements: [
                {
                  _id: expect.any(String),
                  _template: "@easyblocks/rich-text-part",
                  color: {
                    $res: true,
                    [testEditorContext.mainBreakpointIndex]: {
                      value: "#fff",
                    },
                  },
                  font: {
                    $res: true,
                    [testEditorContext.mainBreakpointIndex]: {
                      value: {
                        fontFamily: "Arial",
                        fontSize: 16,
                      },
                    },
                  },
                  value: "Lorem ipsum",
                  traceId: expect.any(String),
                },
              ],
            },
          ],
          type: "paragraph",
        },
      ],
    },
    isListStyleAuto: true,
    mainColor: {
      $res: true,
      [testEditorContext.mainBreakpointIndex]: {
        value: "#fff",
      },
    },
    mainFont: {
      $res: true,
      [testEditorContext.mainBreakpointIndex]: {
        value: {
          fontFamily: "Arial",
          fontSize: 16,
        },
      },
    },
  };

  expect(
    getRichTextComponentConfigFragment(
      sourceRichTextComponentConfig,
      testEditorContext
    )
  ).toEqual(expectedRichTextComponentConfigFragment);
});

test("returns fragment of component config when is bulleted list and only last list item is selected", () => {
  const sourceRichTextComponentConfig = buildRichTextComponentConfig({
    compilationContext: testEditorContext,
    elements: [
      buildRichTextBlockElementComponentConfig("bulleted-list", [
        buildRichTextLineElementComponentConfig({
          elements: [
            buildRichTextPartComponentConfig({
              color: {
                $res: true,
                [testEditorContext.mainBreakpointIndex]: {
                  value: "#fff",
                },
              },
              font: {
                $res: true,
                [testEditorContext.mainBreakpointIndex]: {
                  value: {
                    fontFamily: "Arial",
                    fontSize: 16,
                  },
                },
              },
              value: "one",
            }),
          ],
        }),
        buildRichTextLineElementComponentConfig({
          elements: [
            buildRichTextPartComponentConfig({
              color: {
                $res: true,
                [testEditorContext.mainBreakpointIndex]: {
                  value: "#fff",
                },
              },
              font: {
                $res: true,
                [testEditorContext.mainBreakpointIndex]: {
                  value: {
                    fontFamily: "Arial",
                    fontSize: 16,
                  },
                },
              },
              value: "two",
            }),
          ],
        }),
        buildRichTextLineElementComponentConfig({
          elements: [
            buildRichTextPartComponentConfig({
              color: {
                $res: true,
                [testEditorContext.mainBreakpointIndex]: {
                  value: "#fff",
                },
              },
              font: {
                $res: true,
                [testEditorContext.mainBreakpointIndex]: {
                  value: {
                    fontFamily: "Arial",
                    fontSize: 16,
                  },
                },
              },
              value: "three",
            }),
          ],
        }),
      ]),
    ],
    mainColor: {
      $res: true,
      [testEditorContext.mainBreakpointIndex]: {
        value: "#fff",
      },
    },
    mainFont: {
      $res: true,
      [testEditorContext.mainBreakpointIndex]: {
        value: {
          fontFamily: "Arial",
          fontSize: 16,
        },
      },
    },
  });

  testEditorContext.form.change("", sourceRichTextComponentConfig);
  testEditorContext.focussedField = ["elements.en.0.elements.2.elements.0"];

  const expectedRichTextComponentConfigFragment: RichTextComponentConfig = {
    _id: testEditorContext.form.values._id,
    _template: "@easyblocks/rich-text",
    accessibilityRole: "div",
    elements: {
      [testEditorContext.contextParams.locale]: [
        {
          _template: "@easyblocks/rich-text-block-element",
          _id: testEditorContext.form.values.elements[
            testEditorContext.contextParams.locale
          ][0]._id,
          elements: [
            {
              _template: "@easyblocks/rich-text-line-element",
              _id: testEditorContext.form.values.elements[
                testEditorContext.contextParams.locale
              ][0].elements[2]._id,
              elements: [
                {
                  _id: expect.any(String),
                  _template: "@easyblocks/rich-text-part",
                  color: {
                    $res: true,
                    [testEditorContext.mainBreakpointIndex]: {
                      value: "#fff",
                    },
                  },
                  font: {
                    $res: true,
                    [testEditorContext.mainBreakpointIndex]: {
                      value: {
                        fontFamily: "Arial",
                        fontSize: 16,
                      },
                    },
                  },
                  traceId: expect.any(String),
                  value: "three",
                },
              ],
            },
          ],
          type: "bulleted-list",
        },
      ],
    },
    isListStyleAuto: true,
    mainColor: {
      $res: true,
      [testEditorContext.mainBreakpointIndex]: {
        value: "#fff",
      },
    },
    mainFont: {
      $res: true,
      [testEditorContext.mainBreakpointIndex]: {
        value: {
          fontFamily: "Arial",
          fontSize: 16,
        },
      },
    },
  };

  expect(
    getRichTextComponentConfigFragment(
      sourceRichTextComponentConfig,
      testEditorContext
    )
  ).toEqual(expectedRichTextComponentConfigFragment);
});
