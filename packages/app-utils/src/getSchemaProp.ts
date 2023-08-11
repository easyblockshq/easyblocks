import { InternalComponentDefinition } from "./types";
import { SchemaProp } from "@easyblocks/core";

function getSchemaPropByProp(
  definition: InternalComponentDefinition,
  prop: string
): SchemaProp {
  const schemaProp = definition.schema.find(
    (schemaProp) => schemaProp.prop === prop
  );

  if (!schemaProp) {
    throw new Error(
      `Missing schema prop "${prop}" in "${definition.id}" component definition`
    );
  }

  return schemaProp;
}

export { getSchemaPropByProp };
