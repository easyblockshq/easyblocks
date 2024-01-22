import { cleanString } from "@easyblocks/utils";
import { Element } from "slate";
import type {
  BlockElement,
  BulletedList,
  ListItemElement,
  NumberedList,
  ParagraphElement,
  TextLineElement,
} from "../$richText.types";
import type { RichTextBlockElementComponentConfig } from "../$richTextBlockElement/$richTextBlockElement";
import type { RichTextLineElementComponentConfig } from "../$richTextLineElement/$richTextLineElement";
import {
  buildRichTextBlockElementComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextPartComponentConfig,
} from "../builders";

function convertEditorValueToRichTextElements(
  editorValue: Array<BlockElement>
): Array<RichTextBlockElementComponentConfig> {
  return editorValue.map((blockElement) => {
    if (Element.isElementType<BulletedList>(blockElement, "bulleted-list")) {
      return convertEditorListElementToRichTextListBlockElement<BulletedList>(
        "bulleted-list",
        blockElement
      );
    }

    if (Element.isElementType<NumberedList>(blockElement, "numbered-list")) {
      return convertEditorListElementToRichTextListBlockElement<NumberedList>(
        "numbered-list",
        blockElement
      );
    }

    if (Element.isElementType<ParagraphElement>(blockElement, "paragraph")) {
      return convertEditorParagraphElementToRichTextParagraphBlockElement(
        blockElement
      );
    }

    throw new Error("Unknown block element");
  });
}

function convertEditorElementToRichTextLineElement(
  editorElement: TextLineElement | ListItemElement
): RichTextLineElementComponentConfig {
  const lineElement = buildRichTextLineElementComponentConfig({
    elements: editorElement.children.map((child) => {
      return buildRichTextPartComponentConfig({
        value: cleanString(child.text),
        color: child.color,
        font: child.font,
        id: child.id,
        TextWrapper: child.TextWrapper,
      });
    }),
  });
  lineElement._id = editorElement.id;

  return lineElement;
}

function convertEditorListElementToRichTextListBlockElement<
  ListElement extends BulletedList | NumberedList
>(
  type: "bulleted-list" | "numbered-list",
  editorElement: ListElement
): RichTextBlockElementComponentConfig {
  const listBlockElement = buildRichTextBlockElementComponentConfig(
    type,
    editorElement.children.map((child) => {
      return convertEditorElementToRichTextLineElement(child);
    })
  );
  listBlockElement._id = editorElement.id;

  return listBlockElement;
}

function convertEditorParagraphElementToRichTextParagraphBlockElement(
  editorElement: ParagraphElement
): RichTextBlockElementComponentConfig {
  const paragraphBlockElement = buildRichTextBlockElementComponentConfig(
    "paragraph",
    editorElement.children.map((child) => {
      return convertEditorElementToRichTextLineElement(child);
    })
  );
  paragraphBlockElement._id = editorElement.id;

  return paragraphBlockElement;
}

export { convertEditorValueToRichTextElements };
