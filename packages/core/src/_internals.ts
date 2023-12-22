export { CompilationCache } from "./compiler/CompilationCache";
export type { CompilationCacheItemValue } from "./compiler/CompilationCache";
export { compileBox, getBoxStyles } from "./compiler/box";
export { RichTextEditor } from "./compiler/builtins/$richText/$richText.editor";
export { optionalTextModifierSchemaProp } from "./compiler/builtins/$richText/$richTextInlineWrapperElement/$richTextInlineWrapperElement";
export { richTextInlineWrapperActionSchemaProp } from "./compiler/builtins/$richText/$richTextInlineWrapperElement/richTextInlineWrapperActionSchemaProp";
export { TextEditor } from "./compiler/builtins/$text/$text.editor";
export { buildText } from "./compiler/builtins/$text/buildText";
export { useTextValue } from "./compiler/builtins/useTextValue";
export { compileInternal } from "./compiler/compileInternal";
export { configTraverse } from "./compiler/configTraverse";
export { getSchemaDefinition } from "./compiler/definitions";
export { duplicateConfig } from "./compiler/duplicateConfig";
export {
  findComponentDefinition,
  findComponentDefinitionById,
} from "./compiler/findComponentDefinition";
export { normalize } from "./compiler/normalize";
export * from "./compiler/parsePath";
export type { PathInfo } from "./compiler/parsePath";
export { scalarizeConfig } from "./compiler/resop";
export * from "./compiler/schema";
export * from "./compiler/schema/buttonSchemaProps";
export { splitTemplateName } from "./compiler/splitTemplateName";
export { defaultTheme } from "./compiler/theme";
export { traverseComponents } from "./compiler/traverseComponents";
export type {
  CompilationContextType,
  CompilationDocumentType,
  ContextProps,
  EditorContextType,
  InternalComponentDefinition,
  InternalLinkDefinition,
  InternalRenderableComponentDefinition,
  InternalTextModifierDefinition,
} from "./compiler/types";
export {
  EasyblocksMetadataProvider,
  useEasyblocksMetadata,
} from "./components/EasyblocksMetadataProvider";
export * from "./events";
export {
  ComponentBuilder,
  type ComponentBuilderProps,
} from "./components/ComponentBuilder/ComponentBuilder";
