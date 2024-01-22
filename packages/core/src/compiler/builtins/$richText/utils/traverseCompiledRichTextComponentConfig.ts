import type { RichTextProps } from "../$richText.editor";
import type { RichTextBlockElementCompiledComponentConfig } from "../$richTextBlockElement/$richTextBlockElement";
import type { RichTextLineElementCompiledComponentConfig } from "../$richTextLineElement/$richTextLineElement";
import type { RichTextPartCompiledComponentConfig } from "../$richTextPart/$richTextPart";

function traverseCompiledRichTextComponentConfig(
  config: RichTextProps,
  callback: (
    compiledConfig:
      | RichTextBlockElementCompiledComponentConfig
      | RichTextLineElementCompiledComponentConfig
      | RichTextPartCompiledComponentConfig
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
