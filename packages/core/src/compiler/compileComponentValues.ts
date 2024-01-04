/**
 * This compilation function doesn't take schema. It means that it assumes couple of things:
 * 1. That input is ComponentConfig or 1-item array of. ComponentConfig. Basically it's a single component.
 * 2. Return format
 */

import { CompilationCache } from "./CompilationCache";
import { compileFromSchema } from "./compileFromSchema";
import { isSchemaPropComponentOrComponentCollection } from "./schema";
import { CompilationContextType, InternalComponentDefinition } from "./types";

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
