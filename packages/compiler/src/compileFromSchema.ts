import {
  CompilationContextType,
  ContextProps,
  EditingInfoComponent,
  EditingInfoComponentCollection,
} from "@easyblocks/app-utils";
import { RefMap, SchemaProp } from "@easyblocks/core";
import { CompilationCache } from "./CompilationCache";
import { getSchemaDefinition } from "./definitions";

export function compileFromSchema<T extends SchemaProp>(
  value: any,
  schemaProp: T,
  compilationContext: CompilationContextType,
  cache: CompilationCache,
  contextProps?: ContextProps,
  meta?: any,
  refMap?: RefMap,
  editingInfoComponent?:
    | EditingInfoComponent
    | EditingInfoComponentCollection
    | undefined,
  configPrefix?: string
) {
  return getSchemaDefinition(schemaProp, compilationContext).compile(
    value,
    contextProps as any,
    meta,
    refMap as any,
    editingInfoComponent,
    configPrefix as any,
    cache
  );
}
