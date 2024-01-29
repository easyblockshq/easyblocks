import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";
import { RadioGroup } from "../components";

const RadioGroupField = wrapFieldsWithMeta(RadioGroup);

export const RadioGroupFieldPlugin = {
  name: "radio-group",
  Component: RadioGroupField,
};
