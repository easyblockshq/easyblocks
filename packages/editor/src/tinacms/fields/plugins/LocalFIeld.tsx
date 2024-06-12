import { LocalValue } from "@easyblocks/core";
import { InternalField } from "@easyblocks/core/_internals";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { EditorContextType, useEditorContext } from "../../../EditorContext";
import { MissingWidget } from "./MissingWidget";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";

type InlineTypesResult = Record<
  string,
  Extract<EditorContextType["types"][string], { type: "inline" }>
>;

function useInlineTypes(): InlineTypesResult {
  const editorContext = useEditorContext();

  const tokenTypes = Object.fromEntries(
    Object.entries(editorContext.types).filter<
      [string, InlineTypesResult[string]]
    >(
      (
        typeDefinitionEntry
      ): typeDefinitionEntry is [string, InlineTypesResult[string]] => {
        return typeDefinitionEntry[1].type === "inline";
      }
    )
  );

  return tokenTypes;
}

const LocalFieldPlugin = {
  name: "local",
  Component: wrapFieldsWithMeta(function LocalField({
    field,
    input,
  }: FieldRenderProps<LocalValue<any>> & {
    field: InternalField;
  }) {
    const inlineTypes = useInlineTypes();
    const inlineTypeDefinition = inlineTypes[field.schemaProp.type];
    const WidgetComponent = inlineTypeDefinition?.widget.component;

    if (!WidgetComponent) {
      return <MissingWidget type={field.schemaProp.type} />;
    }

    return (
      <WidgetComponent
        value={input.value.value}
        onChange={(value) => {
          input.onChange({
            value,
            widgetId: input.value.widgetId,
          });
        }}
        params={
          "params" in field.schemaProp ? field.schemaProp.params : undefined
        }
        field={field}
      />
    );
  }),
};

export { LocalFieldPlugin };
