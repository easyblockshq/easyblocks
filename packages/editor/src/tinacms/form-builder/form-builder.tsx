import { Form } from "@easyblocks/app-utils";
import React, { FC } from "react";
import { Form as FinalForm, FormRenderProps } from "react-final-form";

export interface FormBuilderProps {
  form: Form;
  children(props: FormRenderProps<string>): any;
}

const FF: any = FinalForm;

export const FormBuilder: FC<FormBuilderProps> = ({ form, children }) => {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    setI((i) => i + 1);
  }, [form]);
  /**
   * > Why is a `key` being set when this isn't an array?
   *
   * `FinalForm` does not update when given a new `form` prop.
   *
   * We can force `FinalForm` to update by setting the `key` to
   * the name of the form. When the name changes React will
   * treat it as a new instance of `FinalForm`, destroying the
   * old `FinalForm` componentt and create a new one.
   *
   * See: https://github.com/final-form/react-final-form/blob/master/src/ReactFinalForm.js#L68-L72
   */
  return (
    <FF form={form.finalForm} key={`${i}: ${form.id}`}>
      {children}
    </FF>
  );
};
