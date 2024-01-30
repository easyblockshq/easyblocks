import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";
import { Toggle } from "../components";

const ToggleField = wrapFieldsWithMeta(Toggle);

export const ToggleFieldPlugin = {
  name: "toggle",
  type: "checkbox",
  Component: ToggleField,
};
