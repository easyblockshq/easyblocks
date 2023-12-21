import { SchemaProp } from "@easyblocks/core";
import { pxValueNormalize } from "./pxValueNormalize";

export function paddingSchemaProp(
  prop: string,
  label: string,
  group: string
): SchemaProp {
  return {
    prop,
    label,
    group,
    type: "space",
    defaultValue: {
      ref: "16",
      value: "16px",
    },
  };
}

export function borderSchemaProp(
  prop: string,
  label: string,
  group: string
): SchemaProp {
  return {
    prop: prop,
    label,
    group,
    type: "string",
    params: {
      normalize: pxValueNormalize(0, 32),
    },
    defaultValue: "1",
  };
}

export function snapToEdgeSchemaProp(fieldName: string): SchemaProp {
  return {
    prop: fieldName,
    type: "boolean",
  };
}
