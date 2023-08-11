import type { RichTextBlockElementComponentConfig } from "../$richTextBlockElement/$richTextBlockElement";

function isElementListBlockElement(
  blockElement: RichTextBlockElementComponentConfig
) {
  return (
    blockElement.type === "bulleted-list" ||
    blockElement.type === "numbered-list"
  );
}

export { isElementListBlockElement };
