import { Form } from "@easyblocks/app-utils";
import {
  buildRichTextComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextParagraphBlockElementComponentConfig,
  buildRichTextPartComponentConfig,
} from "../builders";
import { getEditorSelectionFromFocusedFields } from "./getEditorSelectionFromFocusedFields";

const testForm = new Form({
  id: "test",
  label: "Test",
  onSubmit: () => {},
  initialValues: {
    richText: buildRichTextComponentConfig({
      // @ts-expect-error We only care about locale here
      compilationContext: { contextParams: { locale: "en" } },
      elements: [
        buildRichTextParagraphBlockElementComponentConfig({
          elements: [
            buildRichTextLineElementComponentConfig({
              elements: [
                buildRichTextPartComponentConfig({
                  color: {},
                  font: {},
                  value: "Lorem ipsum",
                }),
                buildRichTextPartComponentConfig({
                  color: {},
                  font: {},
                  value: "dolor sit amet",
                }),
              ],
            }),
            buildRichTextLineElementComponentConfig({
              elements: [
                buildRichTextPartComponentConfig({
                  color: {},
                  font: {},
                  value: "Lorem ipsum",
                }),
                buildRichTextPartComponentConfig({
                  color: {},
                  font: {},
                  value: "dolor sit amet",
                }),
              ],
            }),
          ],
        }),
      ],
      mainColor: {
        $res: true,
      },
      mainFont: {
        $res: true,
      },
    }),
  },
});

test("returns editor selection for selection of single text part", () => {
  expect(
    getEditorSelectionFromFocusedFields(
      ["richText.elements.en.0.elements.0.elements.0.{2,6}"],
      testForm
    )
  ).toEqual({
    anchor: {
      offset: 2,
      path: [0, 0, 0],
    },
    focus: {
      offset: 6,
      path: [0, 0, 0],
    },
  });

  expect(
    getEditorSelectionFromFocusedFields(
      ["richText.elements.en.0.elements.1.elements.1.{2,8}"],
      testForm
    )
  ).toEqual({
    anchor: {
      offset: 2,
      path: [0, 1, 1],
    },
    focus: {
      offset: 8,
      path: [0, 1, 1],
    },
  });

  expect(
    getEditorSelectionFromFocusedFields(
      ["richText.elements.en.0.elements.0.elements.0"],
      testForm
    )
  ).toEqual({
    anchor: {
      offset: 0,
      path: [0, 0, 0],
    },
    focus: {
      offset: 11,
      path: [0, 0, 0],
    },
  });

  expect(
    getEditorSelectionFromFocusedFields(
      ["richText.elements.en.0.elements.1.elements.1"],
      testForm
    )
  ).toEqual({
    anchor: {
      offset: 0,
      path: [0, 1, 1],
    },
    focus: {
      offset: 14,
      path: [0, 1, 1],
    },
  });
});

test("returns editor selection for selection of multiple parts", () => {
  expect(
    getEditorSelectionFromFocusedFields(
      [
        "richText.elements.en.0.elements.0.elements.0.{2,11}",
        "richText.elements.en.0.elements.0.elements.1.{0,8}",
      ],
      testForm
    )
  ).toEqual({
    anchor: {
      offset: 2,
      path: [0, 0, 0],
    },
    focus: {
      offset: 8,
      path: [0, 0, 1],
    },
  });

  expect(
    getEditorSelectionFromFocusedFields(
      [
        "richText.elements.en.0.elements.0.elements.0",
        "richText.elements.en.0.elements.0.elements.1",
      ],
      testForm
    )
  ).toEqual({
    anchor: {
      offset: 0,
      path: [0, 0, 0],
    },
    focus: {
      offset: 14,
      path: [0, 0, 1],
    },
  });
});
