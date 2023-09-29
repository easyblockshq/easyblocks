import {
  buildRichTextBlockElementComponentConfig,
  buildRichTextComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextPartComponentConfig,
} from "@easyblocks/editable-components";
import { EditorContextType } from "../EditorContext";

export type GenerateTextTemplateParams = {
  text?: string;
  colorToken?: string;
  fontToken?: string;
};

export function generateTextTemplate(
  editorContext: EditorContextType,
  options?: GenerateTextTemplateParams
) {
  return buildRichTextComponentConfig({
    compilationContext: editorContext,
    elements: [
      buildRichTextBlockElementComponentConfig("paragraph", [
        buildRichTextLineElementComponentConfig({
          elements: [
            buildRichTextPartComponentConfig({
              color: {
                ref: options?.colorToken ?? "$dark",
                value: "black",
              },
              font: {
                value: {},
                ref: options?.fontToken ?? "$body",
              },
              value: options?.text ?? "Lorem ipsum",
            }),
          ],
        }),
      ]),
    ],
    mainColor: {
      ref: "$dark",
      value: "black",
    },
    mainFont: {
      value: {},
      ref: options?.fontToken ?? "$body",
    },
  });
}
