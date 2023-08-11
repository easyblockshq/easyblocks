import { Form } from "@easyblocks/app-utils";
import React, { useContext, useState } from "react";
import { Field } from "react-final-form";
import { FormBuilder } from "./form-builder";

interface RenderProps {
  isEditing: boolean;
  setIsEditing(nextVal: boolean): any;
}
export interface Props {
  form: Form;
  children({ isEditing, setIsEditing }: RenderProps): any; // TODO: Fix return type
}

const EditingContext = React.createContext(false);

export function TinaForm({ form, children }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  if (!form) {
    return (
      <EditingContext.Provider value={isEditing}>
        {children({ isEditing, setIsEditing })}
      </EditingContext.Provider>
    );
  }

  return (
    <EditingContext.Provider value={isEditing}>
      <FormBuilder form={form}>
        {() => {
          return children({ isEditing, setIsEditing });
        }}
      </FormBuilder>
    </EditingContext.Provider>
  );
}

interface TinaFieldsProps {
  name: string;
  type?: string;
  Component: any;
  children: any;
}

export function TinaField({
  Component,
  children,
  ...fieldProps
}: TinaFieldsProps) {
  const isEditing = useContext(EditingContext);
  if (!isEditing) return children || null;

  return (
    <Field {...fieldProps}>
      {({ input, meta }) => {
        return <Component input={input} meta={meta} {...fieldProps} />;
      }}
    </Field>
  );
}
