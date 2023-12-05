import { ComponentSchemaProp, TextSchemaProp } from "../../types";

export const buttonActionSchemaProp: ComponentSchemaProp = {
  prop: "action",
  label: "Action",
  type: "component", // for now actions are components
  accepts: ["action"],
  visible: true,
  group: "Action",
  isLabelHidden: true,
};

export const buttonLabelSchemaProp: TextSchemaProp = {
  prop: "label",
  type: "text",
  label: "Label",
  group: "Properties",
  normalize: (x) => {
    if (x.trim() === "") {
      return null;
    }
    return x;
  },
};

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
