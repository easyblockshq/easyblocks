import { ComponentDefinitionShared, SchemaProp } from "@easyblocks/core";
import { traceClicksSchemaProp } from "./traceClicksSchemaProp";
import { traceIdSchemaProp } from "./traceIdSchemaProp";
import { traceImpressionsSchemaProp } from "./traceImpressionsSchemaProp";

const hasSchema = (
  definition: ComponentDefinitionShared,
  schemaProp: SchemaProp
) => {
  return definition.schema.some(({ prop }) => prop === schemaProp.prop);
};

function addTracingSchema(definition: ComponentDefinitionShared) {
  if (definition.tags.includes("notrace")) {
    return definition;
  }

  const traceIdProp = traceIdSchemaProp();
  if (!hasSchema(definition, traceIdProp)) {
    definition.schema.push(traceIdProp);
  }

  const traceImpressionsSchemaPropInstance = traceImpressionsSchemaProp();
  if (!hasSchema(definition, traceImpressionsSchemaPropInstance)) {
    definition.schema.push(traceImpressionsSchemaPropInstance);
  }

  const traceClicksSchemaPropInstance = traceClicksSchemaProp();
  if (!hasSchema(definition, traceClicksSchemaPropInstance)) {
    definition.schema.push(traceClicksSchemaPropInstance);
  }

  return definition;
}

export { addTracingSchema };
