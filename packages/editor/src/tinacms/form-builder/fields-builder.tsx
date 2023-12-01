import { Form } from "@easyblocks/app-utils";
import { InternalField } from "@easyblocks/core/_internals";
import { SSColors, SSFonts } from "@easyblocks/design-system";
import { toArray } from "@easyblocks/utils";
import React from "react";
import styled, { css } from "styled-components";
import { useEditorContext } from "../../EditorContext";
import { useCMS } from "../react-core";
import { FieldPlugin } from "./field-plugin";
import { createFieldController } from "./utils/createFieldController";

export interface FieldBuilderProps {
  form: Form;
  field: InternalField;
  noWrap?: boolean;
  isLabelHidden?: boolean;
}

function shouldFieldBeDisplayed(form: Form, field: InternalField): boolean {
  if (field.component === null) return false;

  if (Array.isArray(field.name)) {
    return true;
  }

  if (field.hidden) {
    return false;
  }

  return true;
}

export function FieldBuilder({
  form,
  field,
  noWrap,
  isLabelHidden,
}: FieldBuilderProps) {
  const cms = useCMS();
  const editorContext = useEditorContext();

  if (!shouldFieldBeDisplayed(form, field)) {
    return null;
  }

  const plugin = cms.plugins
    .findOrCreateMap<FieldPlugin>("field")
    .find(field.component as string);

  const { onChange, getValue } = createFieldController({
    field,
    editorContext,
    format: field.format ?? plugin?.format,
    parse: field.parse ?? plugin?.parse,
  });

  if (plugin) {
    return (
      <plugin.Component
        // Let's talk about this code
        // This branch of code is created to display single input and label that handles multiple inputs under the hood
        // To make this work, we had to skip usage of `Field` from `Final Form` because it requires a single field object with single name
        // Moreover, since we don't use `Field` anymore we have to pretend that it still exists to make fields works as it was there.
        // In the future, this code should become a part of new component (ex. FieldWrapper)
        // and new controller should be introduced (ex. fieldWrapperController) to have single source of truth about behaviour of responsive field.
        input={{
          value: getValue(),
          onChange,
        }}
        // MetaFieldWrapper accesses `error` property of this object, it's needed to prevent runtime error
        meta={{}}
        tinaForm={form}
        form={form.finalForm}
        field={field}
        noWrap={noWrap}
        isLabelHidden={isLabelHidden}
      />
    );
  }

  if (typeof field.component !== "string" && field.component !== null) {
    return (
      <field.component
        input={{
          value: getValue(),
          onChange,
        }}
        meta={{}}
        tinaForm={form}
        form={form.finalForm}
        field={field}
        noWrap={noWrap}
        isLabelHidden={isLabelHidden}
      />
    );
  }

  return <p>Unrecognized field type</p>;
}

export interface FieldsBuilderProps {
  form: Form;
  fields: InternalField[];
}

export function FieldsBuilder({ form, fields }: FieldsBuilderProps) {
  const grouped: Record<string, Array<InternalField>> = {};
  const ungrouped: Array<InternalField> = [];

  fields.forEach((field) => {
    if (!shouldFieldBeDisplayed(form, field)) {
      return;
    }

    if (field.group) {
      grouped[field.group] = grouped[field.group] || [];
      grouped[field.group].push(field);
    } else {
      if (field.component === "identity") {
        return;
      }

      ungrouped.push(field);
    }
  });

  const horizontalLine = (
    <div
      css={css`
        height: 1px;
        margin-top: -1px;
        background-color: ${SSColors.black10};
      `}
    />
  );

  const identityField = fields.find((field) => field.component === "identity");

  return (
    <FieldsGroup>
      {identityField !== undefined && (
        <React.Fragment>
          <FieldBuilder field={identityField} form={form} />
          {horizontalLine}
        </React.Fragment>
      )}
      {Object.keys(grouped).map((groupName) => (
        <div key={groupName}>
          <FieldsGroupLabel>{groupName}</FieldsGroupLabel>
          {grouped[groupName].map((field, index, fields) => (
            <div
              key={generateFieldKey(field)}
              css={css`
                margin-bottom: ${index === fields.length - 1 ? "8px" : 0};
              `}
            >
              <FieldBuilder
                field={field}
                form={form}
                isLabelHidden={field.schemaProp.isLabelHidden}
              />
            </div>
          ))}
          {horizontalLine}
        </div>
      ))}
      {ungrouped.map((field, index, fields) => (
        <div
          key={generateFieldKey(field)}
          css={css`
            margin-bottom: ${index === fields.length - 1 ? "8px" : 0};
          `}
        >
          <FieldBuilder
            field={field}
            form={form}
            isLabelHidden={field.schemaProp.isLabelHidden}
          />
        </div>
      ))}
      {horizontalLine}
    </FieldsGroup>
  );
}

function generateFieldKey(field: InternalField) {
  const key = `${toArray(field.name).join("_")}_${field.schemaProp.type}`;
  return key;
}

export const FieldsGroupLabel = styled.div`
  display: flex;
  align-items: center;

  //min-height: 48px;
  padding: 20px 16px 10px 16px;

  ${SSFonts.label};
  color: #000;
`;

export const FieldsGroup = styled.div`
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: auto !important;
`;
