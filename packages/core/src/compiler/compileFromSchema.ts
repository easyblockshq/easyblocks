import { SchemaProp } from "../types";
import { CompilationCache } from "./CompilationCache";
import { getSchemaDefinition } from "./definitions";
import {
  CompilationContextType,
  ContextProps,
  EditingInfoComponent,
  EditingInfoComponentCollection,
} from "./types";

export function compileFromSchema<T extends SchemaProp>(
  value: any,
  schemaProp: T,
  compilationContext: CompilationContextType,
  cache: CompilationCache,
  contextProps?: ContextProps,
  meta?: any,
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
    editingInfoComponent,
    configPrefix as any,
    cache
  );
}
