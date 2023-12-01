import { RichTextInlineWrapperElementEditableComponentConfig } from "../$richTextInlineWrapperElement/$richTextInlineWrapperElement";
import { ComponentConfig } from "../../../../types";

function isRichTextInlineWrapperElementNoCodeEntry(
  entry: ComponentConfig
): entry is RichTextInlineWrapperElementEditableComponentConfig {
  return entry._template === "@easyblocks/rich-text-inline-wrapper-element";
}

export { isRichTextInlineWrapperElementNoCodeEntry };
