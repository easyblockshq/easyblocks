import { LocalTextReference, ResponsiveValue } from "@easyblocks/core";
import { InternalField, useTextValue } from "@easyblocks/core/_internals";
import { Input } from "@easyblocks/design-system";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { useEditorContext } from "../../../EditorContext";
import { parse } from "./textFormat";
import { FieldMetaWrapper } from "./wrapFieldWithMeta";

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

  const isTextSchemaProp = field.schemaProp.type === "text";

  return (
    <FieldMetaWrapper
      input={input}
      field={field}
      layout={isTextSchemaProp ? "column" : "row"}
      noWrap={noWrap}
    >
      <Input
        {...restInputProperties}
        {...inputProps}
        controlSize="full-width"
        align={!isTextSchemaProp ? "right" : "left"}
        withBorder={isTextSchemaProp}
      />
    </FieldMetaWrapper>
  );
}

export const TextFieldPlugin = {
  name: "text",
  Component: TextField,
  parse,
};
