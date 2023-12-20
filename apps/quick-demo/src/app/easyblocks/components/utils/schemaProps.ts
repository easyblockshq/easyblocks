import { SchemaProp } from "@easyblocks/core";
import { pxValueNormalize } from "./pxValueNormalize";

export function paddingSchemaProp(fieldName: string): SchemaProp {
  return {
    prop: fieldName,
    type: "space",
    defaultValue: {
      ref: "16",
      value: "16px",
    },
  };
}

export function borderSchemaProp(fieldName: string): SchemaProp {
  return {
    prop: fieldName,
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
