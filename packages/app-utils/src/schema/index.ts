import {
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentFixedSchemaProp,
  ComponentSchemaProp,
  ExternalSchemaProp,
  Field,
  SchemaProp as CoreSchemaProp,
  SchemaPropShared,
} from "@easyblocks/core";
import { InternalComponentDefinition } from "../types";

type SchemaProp = CoreSchemaProp | Component$$$SchemaProp;

type ComponentPickerType = "large" | "small";

export type Component$$$SchemaProp = SchemaPropShared<"component$$$", never> & {
  definition: InternalComponentDefinition;
  picker?: ComponentPickerType;
  required?: boolean;
};

export type InternalAnyField = InternalField & { [key: string]: any };

export type InternalAnyTinaField = InternalAnyField;

export type InternalField = Omit<Field, "schemaProp" | "parse" | "format"> & {
  parse?: (value: any, name: string, field: InternalAnyField) => any;
  format?: (value: any, name: string, field: InternalAnyField) => any;
  schemaProp: Field["schemaProp"] | Component$$$SchemaProp;
};

export function isSchemaPropComponentCollectionLocalised(
  schemaProp: SchemaProp
): schemaProp is ComponentCollectionLocalisedSchemaProp {
  return schemaProp.type === "component-collection-localised";
}

export function isSchemaPropCollection(
  schemaProp: SchemaProp
): schemaProp is
  | ComponentCollectionLocalisedSchemaProp
  | ComponentCollectionSchemaProp {
  return (
    schemaProp.type === "component-collection" ||
    schemaProp.type === "component-collection-localised"
  );
}

export function isSchemaPropComponent(
  schemaProp: SchemaProp
): schemaProp is ComponentSchemaProp | ComponentFixedSchemaProp {
  return (
    schemaProp.type === "component" || schemaProp.type === "component-fixed"
  );
}

export function isSchemaPropComponentOrComponentCollection(
  schemaProp: SchemaProp
): schemaProp is
  | ComponentCollectionLocalisedSchemaProp
  | ComponentCollectionSchemaProp
  | ComponentSchemaProp
  | ComponentFixedSchemaProp {
  return (
    isSchemaPropCollection(schemaProp) || isSchemaPropComponent(schemaProp)
  );
}

export function isSchemaPropAction(schemaProp: SchemaProp) {
  return (
    schemaProp.type === "component" &&
    (schemaProp as ComponentSchemaProp).componentTypes?.includes("action")
  );
}

export function isSchemaPropActionTextModifier(schemaProp: SchemaProp) {
  return (
    schemaProp.type === "component" &&
    (schemaProp as ComponentSchemaProp).componentTypes.includes(
      "actionTextModifier"
    )
  );
}

export function isSchemaPropTextModifier(schemaProp: SchemaProp) {
  return (
    schemaProp.type === "component" &&
    (schemaProp as ComponentSchemaProp).componentTypes.includes("textModifier")
  );
}

const internalTypes = new Set<SchemaProp["type"]>([
  "string",
  "number",
  "boolean",
  "string$",
  "boolean$",
  "select",
  "select$",
  "radio-group",
  "radio-group$",
  "color",
  "space",
  "font",
  "stringToken",
  "icon",
  "text",
  "component",
  "component-collection",
  "component-fixed",
  "position",
  "component$$$",
  "component-collection-localised",
]);

export function isExternalSchemaProp(
  schemaProp: SchemaProp
): schemaProp is ExternalSchemaProp {
  return !internalTypes.has(schemaProp.type);
}

export function isSchemaPropTokenized(schemaProp: SchemaProp) {
  return (
    schemaProp.type === "color" ||
    schemaProp.type === "space" ||
    schemaProp.type === "font" ||
    schemaProp.type === "stringToken"
  );
}

type TextModifierSchemaPropOptions = Omit<
  ComponentSchemaProp,
  "type" | "componentTypes" | "hidden"
> &
  Partial<Pick<ComponentSchemaProp, "componentTypes">>;

export function textModifierSchemaProp(
  options: TextModifierSchemaPropOptions
): ComponentSchemaProp {
  return {
    type: "component",
    componentTypes: ["textModifier"],
    // Schema props of type "component" are hidden by default
    visible: true,
    ...options,
  };
}
