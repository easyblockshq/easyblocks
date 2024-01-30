import type { RichTextProps } from "../$richText.editor";
import type { RichTextBlockElementCompiledComponentConfig } from "../$richTextBlockElement/$richTextBlockElement";
import type { RichTextLineElementCompiledComponentConfig } from "../$richTextLineElement/$richTextLineElement";
import { traverseCompiledRichTextComponentConfig } from "./traverseCompiledRichTextComponentConfig";

function extractElementsFromCompiledComponents(
  compiledRichText: RichTextProps
): Array<
  | RichTextBlockElementCompiledComponentConfig
  | RichTextLineElementCompiledComponentConfig
> {
  const extractedCompiledElementComponents: ReturnType<
    typeof extractElementsFromCompiledComponents
  > = [];

  traverseCompiledRichTextComponentConfig(
    compiledRichText,
    (compiledConfig) => {
      if (
        compiledConfig._component === "@easyblocks/rich-text-block-element" ||
        compiledConfig._component === "@easyblocks/rich-text-line-element"
      ) {
        extractedCompiledElementComponents.push(
          compiledConfig as
            | RichTextBlockElementCompiledComponentConfig
            | RichTextLineElementCompiledComponentConfig
        );
      }
    }
  );

  return extractedCompiledElementComponents;
}

export { extractElementsFromCompiledComponents };
