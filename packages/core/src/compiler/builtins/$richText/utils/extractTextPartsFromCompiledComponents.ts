import type { RichTextProps } from "../$richText.editor";
import type { RichTextPartCompiledComponentConfig } from "../$richTextPart/$richTextPart";
import { traverseCompiledRichTextComponentConfig } from "./traverseCompiledRichTextComponentConfig";

function extractTextPartsFromCompiledComponents(
  compiledRichText: RichTextProps
): Array<RichTextPartCompiledComponentConfig> {
  const extractedTextPartComponents: Array<RichTextPartCompiledComponentConfig> =
    [];

  traverseCompiledRichTextComponentConfig(
    compiledRichText,
    (compiledConfig) => {
      if (compiledConfig._component === "@easyblocks/rich-text-part") {
        extractedTextPartComponents.push(
          compiledConfig as RichTextPartCompiledComponentConfig
        );
      }
    }
  );

  return extractedTextPartComponents;
}

export { extractTextPartsFromCompiledComponents };
