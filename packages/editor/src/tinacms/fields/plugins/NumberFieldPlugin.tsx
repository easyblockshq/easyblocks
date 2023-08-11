import React from "react";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";
import { NumberInput as BaseNumberField, InputProps } from "../components";
import { parse } from "./numberFormat";

export const NumberField = wrapFieldsWithMeta<{
  step: string | number;
  min?: number;
  max?: number;
  input: InputProps;
}>(({ input, field }) => {
  return (
    <BaseNumberField
      {...input}
      step={field.step}
      min={field.min}
      max={field.max}
    />
  );
});

export const NumberFieldPlugin = {
  name: "number",
  Component: NumberField,
  parse,
};
