import { FormApi, InternalField } from "@easyblocks/app-utils";
import { FieldRenderProps } from "../../form-builder";

export interface FieldProps<InputProps extends Record<string, unknown>>
  extends FieldRenderProps<any, HTMLElement> {
  field: InternalField;
  form: FormApi;
}
