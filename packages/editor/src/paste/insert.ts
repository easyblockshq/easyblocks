import {
  ComponentCollectionSchemaProp,
  NoCodeComponentEntry,
  ComponentSchemaProp,
  SchemaProp,
} from "@easyblocks/core";
import {
  CompilationContextType,
  duplicateConfig,
  findComponentDefinition,
} from "@easyblocks/core/_internals";
import { includesAny } from "@easyblocks/utils";
import { Form } from "../form";
import { normalizeToStringArray } from "../normalizeToStringArray";
import { reconcile } from "./reconcile";

const getTypes = (schema?: SchemaProp) => {
  if (schema?.type === "component-collection" || schema?.type === "component") {
    return (schema as ComponentCollectionSchemaProp | ComponentSchemaProp)
      .accepts;
  }
  return [];
};

const insertCommand = ({
  context,
  form,
  schema,
  templateId,
}: {
  context: CompilationContextType;
  form: Form;
  schema?: SchemaProp;
  templateId?: string;
}) => {
  const types = getTypes(schema);

  const reconcileItem = reconcile({
    context,
    templateId,
    fieldName: schema?.prop,
  });

  return (path: string, index: number, item: NoCodeComponentEntry) => {
    const itemDefinition = findComponentDefinition(item, context);
    if (!itemDefinition) {
      return null;
    }

    const itemTypes = [
      itemDefinition.id,
      ...normalizeToStringArray(itemDefinition.type),
    ];
    if (!includesAny(types, itemTypes)) {
      return null;
    }

    const reconciledItem = reconcileItem(item);
    const duplicatedItem = duplicateConfig(reconciledItem, context);

    form.mutators.insert(path, index, duplicatedItem);

    return `${path}.${index}`;
  };
};

export { insertCommand };
