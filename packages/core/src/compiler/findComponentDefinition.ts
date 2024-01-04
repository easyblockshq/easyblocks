import { toArray } from "@easyblocks/utils";
import { splitTemplateName } from "./splitTemplateName";
import { ComponentConfig } from "../types";
import {
  InternalComponentDefinition,
  InternalComponentDefinitions,
} from "./types";

type AnyContextWithDefinitions = { definitions: InternalComponentDefinitions };

function allDefs(
  context?: AnyContextWithDefinitions
): InternalComponentDefinition[] {
  return [
    ...(context?.definitions.components || []),
    ...(context?.definitions.links || []),
    ...(context?.definitions.actions || []),
    ...(context?.definitions.textModifiers ?? []),
  ];
}

/**
 * Versions with context and custom components sweep
 */

export function findComponentDefinition(
  config: ComponentConfig | undefined | null,
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

export function findComponentDefinitionsByTag(
  tag: string,
  context: AnyContextWithDefinitions
): InternalComponentDefinition[] {
  return $findComponentDefinitionsByTag(tag, context);
}

export function findComponentDefinitionsByComponentType(
  componentType: string[],
  context: AnyContextWithDefinitions
): InternalComponentDefinition[] {
  return $findComponentDefinitionsByComponentType(componentType, context);
}

/**
 * Generic
 */

function $findComponentDefinition(
  config: ComponentConfig | undefined | null,
  context?: AnyContextWithDefinitions
): InternalComponentDefinition | undefined {
  if (!config) {
    return undefined;
  }

  return $findComponentDefinitionById(config._template, context);
}

function $findComponentDefinitionById(
  id: string,
  context?: AnyContextWithDefinitions
): InternalComponentDefinition | undefined {
  return allDefs(context).find(
    (component) => component.id === splitTemplateName(id).name
  );
}

function $findComponentDefinitionsByTag(
  tag: string,
  context?: AnyContextWithDefinitions
): InternalComponentDefinition[] {
  return allDefs(context).filter((def) =>
    toArray(def.type ?? []).includes(tag)
  );
}

function $findComponentDefinitionsByComponentType(
  componentTypes: string[],
  context?: AnyContextWithDefinitions
): InternalComponentDefinition[] {
  let componentDefinitions: InternalComponentDefinition[] = [];

  componentTypes.forEach((componentType) => {
    componentDefinitions = [
      ...componentDefinitions,
      ...$findComponentDefinitionsByTag(componentType, context),
    ];
  });

  return componentDefinitions;
}
