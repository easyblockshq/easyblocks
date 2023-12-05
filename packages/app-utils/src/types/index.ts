import type {
  CompilationMetadata,
  CompiledComponentConfig,
  CompiledShopstoryComponentConfig,
  ConfigComponent,
  ExternalData,
} from "@easyblocks/core";
import { EditorContextType } from "@easyblocks/core/_internals";

export * from "./ConfigComponentIdentifier";
export * from "./ConfigModel";
export * from "./ConfigOrConfigArray";

export type InternalCompilationOutput = {
  compiled: CompiledShopstoryComponentConfig;
  meta: CompilationMetadata;
};

export type EditorCompilationOutput = InternalCompilationOutput & {
  configAfterAuto: ConfigComponent;
};

export type EditorWindowAPI = {
  config: ConfigComponent;
  editorContext: EditorContextType;
  compilationOutput: EditorCompilationOutput;
  onUpdate?: () => void; // this function will be called by parent window when data is changed, child should "subscribe" to this function
  meta: CompilationMetadata;
  compiled: CompiledComponentConfig;
  externalData: ExternalData;
};
