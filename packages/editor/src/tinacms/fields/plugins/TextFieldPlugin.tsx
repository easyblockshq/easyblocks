import { InternalField, useTextValue } from "@easyblocks/app-utils";
import { LocalTextReference, ResponsiveValue } from "@easyblocks/core";
import { SSInput } from "@easyblocks/design-system";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { useEditorContext } from "../../../EditorContext";
import { parse } from "./textFormat";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";

type TextFieldProps = FieldRenderProps<
  ResponsiveValue<string> | LocalTextReference
> & {
  field: InternalField & {
    placeholder?: string;
    normalize: (value: string) => string | null;
  };
};

export function TextField({ input, field, noWrap }: TextFieldProps) {
  const editorContext = useEditorContext();
  const { value, onChange, ...restInputProperties } = input;

  const inputProps = useTextValue(
    value,
    onChange,
    editorContext.contextParams.locale,
    editorContext.locales,
    field.placeholder,
    field.normalize
  );

  return (
    <SSInput
      {...restInputProperties}
      {...inputProps}
      controlSize="full-width"
      align={noWrap ? "right" : "left"}
      withBorder={!noWrap}
    />
  );
}

export const TextFieldPlugin = {
  name: "text",
  Component: wrapFieldsWithMeta(TextField, { layout: "column" }),
  parse,
};
