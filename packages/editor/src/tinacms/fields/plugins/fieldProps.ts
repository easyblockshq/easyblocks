import { FormApi, InternalField } from "@easyblocks/app-utils";
import { FieldRenderProps } from "../../form-builder";

export interface FieldProps<InputProps>
  extends FieldRenderProps<any, HTMLElement> {
  field: InternalField & InputProps;
  form: FormApi;
}
