import { RefMap, SchemaProp } from "@easyblocks/core";

import { ContextProps } from "@easyblocks/app-utils";

import {
  CompilationContextType,
  EditingInfoComponent,
  EditingInfoComponentCollection,
} from "@easyblocks/app-utils";
import { CompilationCache } from "./CompilationCache";
import { getSchemaDefinition } from "./definitions";

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
    // @ts-expect-error //FIXME
    value,
    contextProps,
    meta,
    editingInfoComponent,
    configPrefix,
    cache
  );
}
