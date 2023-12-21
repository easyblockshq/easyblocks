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

export function snapToEdgeSchemaProp(fieldName: string): SchemaProp {
  return {
    prop: fieldName,
    type: "boolean",
  };
}
