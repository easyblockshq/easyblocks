import type { RichTextProps } from "../$richText.editor";
import { RichTextBlockElementCompiledComponentConfig } from "../$richTextBlockElement/$richTextBlockElement";
import { RichTextInlineWrapperElementCompiledComponentConfig } from "../$richTextInlineWrapperElement/$richTextInlineWrapperElement";
import { RichTextLineElementCompiledComponentConfig } from "../$richTextLineElement/$richTextLineElement";
import { traverseCompiledRichTextComponentConfig } from "./traverseCompiledRichTextComponentConfig";

function extractElementsFromCompiledComponents(
  compiledRichText: RichTextProps
): Array<
  | RichTextBlockElementCompiledComponentConfig
  | RichTextLineElementCompiledComponentConfig
  | RichTextInlineWrapperElementCompiledComponentConfig
> {
  const extractedCompiledElementComponents: ReturnType<
    typeof extractElementsFromCompiledComponents
  > = [];

  traverseCompiledRichTextComponentConfig(
    compiledRichText,
    (compiledConfig) => {
      if (
        compiledConfig._template === "@easyblocks/rich-text-block-element" ||
        compiledConfig._template === "@easyblocks/rich-text-line-element" ||
        compiledConfig._template ===
          "@easyblocks/rich-text-inline-wrapper-element"
      ) {
        extractedCompiledElementComponents.push(
          compiledConfig as
            | RichTextBlockElementCompiledComponentConfig
            | RichTextLineElementCompiledComponentConfig
            | RichTextInlineWrapperElementCompiledComponentConfig
        );
      }
    }
  );

  return extractedCompiledElementComponents;
}

export { extractElementsFromCompiledComponents };
