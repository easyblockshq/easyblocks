import type { RichTextProps } from "../$richText.editor";
import { RichTextBlockElementCompiledComponentConfig } from "../$richTextBlockElement/$richTextBlockElement";
import { RichTextInlineWrapperElementCompiledComponentConfig } from "../$richTextInlineWrapperElement/$richTextInlineWrapperElement";
import { RichTextLineElementCompiledComponentConfig } from "../$richTextLineElement/$richTextLineElement";
import { RichTextPartCompiledComponentConfig } from "../$richTextPart/$richTextPart";

function traverseCompiledRichTextComponentConfig(
  config: RichTextProps,
  callback: (
    compiledConfig:
      | RichTextBlockElementCompiledComponentConfig
      | RichTextLineElementCompiledComponentConfig
      | RichTextPartCompiledComponentConfig
      | RichTextInlineWrapperElementCompiledComponentConfig
  ) => void
): void {
  config.elements.forEach((reactElement) => {
    callback(reactElement.props.compiled);
    reactElement.props.compiled.components.elements.forEach(
      (compiledLineElement) => {
        callback(compiledLineElement);
        compiledLineElement.components.elements.forEach((compiledTextPart) => {
          callback(compiledTextPart);
        });
      }
    );
  });
}

export { traverseCompiledRichTextComponentConfig };
