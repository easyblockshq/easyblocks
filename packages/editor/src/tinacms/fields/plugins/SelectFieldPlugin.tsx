import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";
import { Select } from "../components";
import { parse } from "./textFormat";

export const SelectField = wrapFieldsWithMeta(Select);

export const SelectFieldPlugin = {
  name: "select",
  type: "select",
  Component: SelectField,
  parse,
};
