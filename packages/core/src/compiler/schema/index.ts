import {
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentPickerType,
  ComponentSchemaProp,
  ExternalSchemaProp,
  Field,
  SchemaProp as CoreSchemaProp,
  SchemaPropShared,
  LocalSchemaProp,
} from "../../types";
import { EditorContextType, InternalComponentDefinition } from "../types";

type SchemaProp = CoreSchemaProp | Component$$$SchemaProp;

export type Component$$$SchemaProp = SchemaPropShared<"component$$$"> & {
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
): schemaProp is ComponentSchemaProp {
  return schemaProp.type === "component";
}

export function isSchemaPropComponentOrComponentCollection(
  schemaProp: SchemaProp
): schemaProp is
  | ComponentCollectionLocalisedSchemaProp
  | ComponentCollectionSchemaProp
  | ComponentSchemaProp {
  return (
    isSchemaPropCollection(schemaProp) || isSchemaPropComponent(schemaProp)
  );
}

export function isSchemaPropActionTextModifier(schemaProp: SchemaProp) {
  return (
    schemaProp.type === "component" &&
    (schemaProp as ComponentSchemaProp).accepts.includes("actionTextModifier")
  );
}

export function isSchemaPropTextModifier(schemaProp: SchemaProp) {
  return (
    schemaProp.type === "component" &&
    (schemaProp as ComponentSchemaProp).accepts.includes("textModifier")
  );
}

const internalTypes = new Set<SchemaProp["type"]>([
  "string",
  "number",
  "boolean",
  "select",
  "radio-group",
  "color",
  "space",
  "font",
  "icon",
  "text",
  "component",
  "component-collection",
  "position",
  "component$$$",
  "component-collection-localised",
  "aspectRatio",
  "containerWidth",
  "boxShadow",
]);

export function isCustomSchemaProp(
  schemaProp: SchemaProp
): schemaProp is ExternalSchemaProp | LocalSchemaProp {
  return !internalTypes.has(schemaProp.type);
}

export function isExternalSchemaProp(
  schemaProp: SchemaProp,
  types: EditorContextType["types"]
): schemaProp is ExternalSchemaProp {
  return types[schemaProp.type] && types[schemaProp.type].type === "external";
}

type TextModifierSchemaPropOptions = Omit<
  ComponentSchemaProp,
  "type" | "accepts" | "hidden"
> &
  Partial<Pick<ComponentSchemaProp, "accepts">>;

export function textModifierSchemaProp(
  options: TextModifierSchemaPropOptions
): ComponentSchemaProp {
  return {
    type: "component",
    accepts: ["textModifier"],
    // Schema props of type "component" are hidden by default
    visible: true,
    ...options,
  };
}
