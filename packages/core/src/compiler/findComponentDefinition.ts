import { toArray } from "@easyblocks/utils";
import { NoCodeComponentEntry } from "../types";
import {
  InternalComponentDefinition,
  InternalComponentDefinitions,
} from "./types";

type AnyContextWithDefinitions = { definitions: InternalComponentDefinitions };

function allDefs(
  context?: AnyContextWithDefinitions
): InternalComponentDefinition[] {
  return context?.definitions.components || [];
}

/**
 * Versions with context and custom components sweep
 */

export function findComponentDefinition(
  config: NoCodeComponentEntry | undefined | null,
  context: AnyContextWithDefinitions
): InternalComponentDefinition | undefined {
  return $findComponentDefinition(config, context);
}

export function findComponentDefinitionById(
  id: string,
  context: AnyContextWithDefinitions
): InternalComponentDefinition | undefined {
  return $findComponentDefinitionById(id, context);
}

export function findComponentDefinitionsByType(
  tag: string,
  context: AnyContextWithDefinitions
): InternalComponentDefinition[] {
  return allDefs(context).filter((def) =>
    toArray(def.type ?? []).includes(tag)
  );
}

/**
 * Generic
 */

function $findComponentDefinition(
  config: NoCodeComponentEntry | undefined | null,
  context?: AnyContextWithDefinitions
): InternalComponentDefinition | undefined {
  if (!config) {
    return undefined;
  }

  return $findComponentDefinitionById(config._component, context);
}

function $findComponentDefinitionById(
  id: string,
  context?: AnyContextWithDefinitions
): InternalComponentDefinition | undefined {
  return allDefs(context).find((component) => component.id === id);
}
