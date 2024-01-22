import { ComponentSchemaProp } from "../../types";

export const buttonOptionalIconSchemaProp: ComponentSchemaProp = {
  prop: "symbol",
  label: "Symbol",
  type: "component",
  accepts: ["symbol"],
  visible: true,
  group: "Properties",
};

export const buttonRequiredIconSchemaProp: ComponentSchemaProp = {
  ...buttonOptionalIconSchemaProp,
  required: true,
};
