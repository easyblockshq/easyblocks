import { InlineTypeDefinition, LocalValue } from "@easyblocks/core";
import { InternalField } from "@easyblocks/core/_internals";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { EditorContextType, useEditorContext } from "../../../EditorContext";
import { MissingWidget } from "./MissingWidget";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";

function useInlineTypes(): Record<
  string,
  Extract<EditorContextType["types"][string], { type: "inline" }>
> {
  const editorContext = useEditorContext();

  const tokenTypes = Object.fromEntries(
    Object.entries(editorContext.types).filter<[string, InlineTypeDefinition]>(
      (
        typeDefinitionEntry
      ): typeDefinitionEntry is [string, InlineTypeDefinition] => {
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
    const WidgetComponent = inlineTypeDefinition?.widgets?.[0]?.component;

    if (!WidgetComponent) {
      return <MissingWidget type={field.schemaProp.type} />;
    }

    return (
      <WidgetComponent
        value={input.value.value}
        onChange={(value) => {
          if (value === input.value.value) {
            return;
          }

          input.onChange({
            value,
            widgetId: input.value.widgetId,
          });
        }}
      />
    );
  }),
};

export { LocalFieldPlugin };
