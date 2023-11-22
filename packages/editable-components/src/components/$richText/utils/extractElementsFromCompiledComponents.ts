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
        compiledConfig._template === "$richTextBlockElement" ||
        compiledConfig._template === "$richTextLineElement" ||
        compiledConfig._template === "$richTextInlineWrapperElement"
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
