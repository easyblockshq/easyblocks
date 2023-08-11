import {
  InternalComponentDefinition,
  InternalField,
} from "@easyblocks/app-utils";
import { SchemaProp } from "@easyblocks/core";
import { last } from "@easyblocks/utils";
import { getUniqueValues } from "../../fields/components/getUniqueValues";

export interface MergeCommonFieldsParameters {
  fields: Array<Array<InternalField>>;
}

function mergeCommonFields({
  fields,
}: MergeCommonFieldsParameters): Array<InternalField> {
  const mergedCommonFields: Array<InternalField> = [];
  const fieldsGroupedByProperty = groupFieldsByPropertyName(fields.flat());

  for (const currentFields of Object.values(fieldsGroupedByProperty)) {
    if (currentFields.length < fields.length) {
      continue;
    }

    /**
     * Some fields can be hidden depending on the context of usage
     * ex. margin bottom is not applicable to the last element in stack
     */
    const visibleFields = currentFields.filter((field) => {
      return !field.hidden;
    });

    if (visibleFields.length === 0) {
      continue;
    }

    const fieldDefinitionIds = visibleFields.map(
      (field) => getFieldSchemaWithDefinition(field).definition.id
    );

    /**
     * All fields for given property have to be defined within the same schema, because ex.
     * field can have the same prop name in schema A, but different meaning in schema B
     */
    const uniqueDefinitionIds = getUniqueValues(fieldDefinitionIds);

    // It's common when interacting with $richText to pass fields of parent or ancestor down to $richTextPart.
    // Verify if the all unique ids aren't fields of $richText components.
    if (
      uniqueDefinitionIds.length > 1 &&
      !uniqueDefinitionIds.every((id) => id.startsWith("$richText"))
    ) {
      continue;
    }

    const firstVisibleField = visibleFields[0];

    mergedCommonFields.push({
      ...firstVisibleField,
      name:
        visibleFields.length === 1
          ? firstVisibleField.name
          : getUniqueValues(visibleFields.flatMap((field) => field.name)),
    });
  }

  return mergedCommonFields;
}

function groupFieldsByPropertyName(
  fields: Array<InternalField>
): Record<string, Array<InternalField>> {
  return fields.reduce((repeatedFields, field) => {
    const currentFieldPropertyName = getPropertyName(field.schemaProp.prop);
    const fields = repeatedFields[currentFieldPropertyName];
    repeatedFields[currentFieldPropertyName] =
      fields !== undefined ? [...fields, field] : [field];
    return repeatedFields;
  }, {} as Record<string, Array<InternalField>>);
}

function getPropertyName(fieldName: string): string {
  const fieldNameParts = fieldName.split(".");
  let lastPart = last(fieldNameParts);

  // If property name starts with `$` sign it's a special property of fake field.
  if (lastPart.startsWith("$")) {
    lastPart = lastPart.slice(1);
  }

  if (fieldNameParts[0] === "$previous") {
    return `${fieldNameParts[0]}.${lastPart}`;
  }

  return lastPart;
}

function getFieldSchemaWithDefinition(field: InternalField): SchemaProp & {
  definition: InternalComponentDefinition;
} {
  return field.schemaProp as SchemaProp & {
    definition: InternalComponentDefinition;
  };
}

export { mergeCommonFields };
