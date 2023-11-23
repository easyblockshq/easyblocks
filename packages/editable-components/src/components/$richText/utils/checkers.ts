import { ComponentConfig } from "@easyblocks/core";
import { RichTextInlineWrapperElementEditableComponentConfig } from "../$richTextInlineWrapperElement/$richTextInlineWrapperElement";

function isRichTextInlineWrapperElementNoCodeEntry(
  entry: ComponentConfig
): entry is RichTextInlineWrapperElementEditableComponentConfig {
  return entry._template === "@easyblocks/rich-text-inline-wrapper-element";
}

export { isRichTextInlineWrapperElementNoCodeEntry };
