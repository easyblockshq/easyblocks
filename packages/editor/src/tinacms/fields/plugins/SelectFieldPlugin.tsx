import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";
import { SelectFieldComponent } from "../components";
import { parse } from "./textFormat";

export const SelectField = wrapFieldsWithMeta(SelectFieldComponent);

export const SelectFieldPlugin = {
  name: "select",
  type: "select",
  Component: SelectField,
  parse,
};
