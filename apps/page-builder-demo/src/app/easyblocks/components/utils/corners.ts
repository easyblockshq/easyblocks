import { pxValueNormalize } from "@/app/easyblocks/components/utils/pxValueNormalize";
import { SchemaProp } from "@easyblocks/core";

export const cornerSchemaProps: SchemaProp[] = [
  {
    prop: "cornerRadius",
    label: "Radius",
    group: "Corner",
    type: "string",
    responsive: true,
    params: {
      normalize: pxValueNormalize(0, 32),
    },
    defaultValue: "0",
  },
];

export function cornerStyles(
  values: Record<string, any>,
  disable: boolean = false
) {
  return {
    borderRadius: disable ? "initial" : `${values.cornerRadius}px`,
  };
}
