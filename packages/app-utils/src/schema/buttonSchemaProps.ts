import { ComponentSchemaProp, TextSchemaProp } from "@easyblocks/core";

export const buttonActionSchemaProp: ComponentSchemaProp = {
  prop: "action",
  label: "Action",
  type: "component", // for now actions are components
  componentTypes: ["action"],
  visible: true,
  group: "Action",
  defaultValue: [],
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
  componentTypes: ["symbol"],
  visible: true,
  group: "Properties",
};

export const buttonRequiredIconSchemaProp: ComponentSchemaProp = {
  ...buttonOptionalIconSchemaProp,
  required: true,
};
