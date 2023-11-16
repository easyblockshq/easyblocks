/**
 * This compilation function doesn't take schema. It means that it assumes couple of things:
 * 1. That input is ConfigComponent or 1-item array of. ConfigComponent. Basically it's a single component.
 * 2. Return format
 */

import {
  InternalComponentDefinition,
  CompilationContextType,
  isSchemaPropComponentOrComponentCollection,
} from "@easyblocks/app-utils";
import { CompilationCache } from "./CompilationCache";
import { compileFromSchema } from "./compileFromSchema";

export function compileComponentValues(
  inputValues: Record<string, any>,
  componentDefinition: InternalComponentDefinition,
  compilationContext: CompilationContextType,
  cache: CompilationCache
) {
  const values: Record<string, any> = {};

  componentDefinition!.schema.forEach((schemaProp) => {
    if (!isSchemaPropComponentOrComponentCollection(schemaProp)) {
      values[schemaProp.prop] = compileFromSchema(
        inputValues[schemaProp.prop],
        schemaProp,
        compilationContext,
        cache
      );
    }
  });

  return values;
}
