import type { RichTextProps } from "../$richText.editor";
import { RichTextInlineWrapperElementCompiledComponentConfig } from "../$richTextInlineWrapperElement/$richTextInlineWrapperElement";
import { RichTextPartCompiledComponentConfig } from "../$richTextPart/$richTextPart";
import { traverseCompiledRichTextComponentConfig } from "./traverseCompiledRichTextComponentConfig";

function extractTextPartsFromCompiledComponents(
  compiledRichText: RichTextProps
): Array<RichTextPartCompiledComponentConfig> {
  const extractedTextPartComponents: Array<RichTextPartCompiledComponentConfig> =
    [];

  traverseCompiledRichTextComponentConfig(
    compiledRichText,
    (compiledConfig) => {
      if (compiledConfig._template === "$richTextPart") {
        extractedTextPartComponents.push(
          compiledConfig as RichTextPartCompiledComponentConfig
        );
      }

      if (compiledConfig._template === "$richTextInlineWrapperElement") {
        (
          compiledConfig as RichTextInlineWrapperElementCompiledComponentConfig
        ).components.elements.forEach((compiledTextPart) => {
          extractedTextPartComponents.push(compiledTextPart);
        });
      }
    }
  );

  return extractedTextPartComponents;
}

export { extractTextPartsFromCompiledComponents };
