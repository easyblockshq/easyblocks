import { InternalField } from "@easyblocks/core/_internals";
import { Colors, Fonts, Typography } from "@easyblocks/design-system";
import { toArray } from "@easyblocks/utils";
import React, { useContext } from "react";
import styled, { css } from "styled-components";
import { useEditorContext } from "../../EditorContext";
import { Form } from "../../form";
import {
  BlockFieldPlugin,
  ExternalFieldPlugin,
  FieldMetaWrapper,
  IdentityFieldPlugin,
  NumberFieldPlugin,
  RadioGroupFieldPlugin,
  ResponsiveFieldPlugin,
  SVGPickerFieldPlugin,
  SelectFieldPlugin,
  SliderFieldPlugin,
  TextFieldPlugin,
  ToggleFieldPlugin,
  TokenFieldPlugin,
} from "../fields";
import { PanelContext } from "../fields/plugins/BlockFieldPlugin";
import { LocalFieldPlugin } from "../fields/plugins/LocalFIeld";
import { PositionFieldPlugin } from "../fields/plugins/PositionFieldPlugin";
import { FieldPlugin } from "./field-plugin";
import { createFieldController } from "./utils/createFieldController";

export interface FieldBuilderProps {
  form: Form;
  field: InternalField;
  noWrap?: boolean;
  isLabelHidden?: boolean;
}

function shouldFieldBeDisplayed(field: InternalField): boolean {
  if (field.component === null) return false;

  if (Array.isArray(field.name)) {
    return true;
  }

  if (field.hidden) {
    return false;
  }

  return true;
}

const FIELD_COMPONENTS: Array<FieldPlugin> = [
  TextFieldPlugin,
  NumberFieldPlugin,
  ToggleFieldPlugin,
  SelectFieldPlugin,
  RadioGroupFieldPlugin,
  PositionFieldPlugin,
  BlockFieldPlugin,
  SliderFieldPlugin,
  SVGPickerFieldPlugin,
  ResponsiveFieldPlugin,
  ExternalFieldPlugin,
  TokenFieldPlugin,
  IdentityFieldPlugin,
  LocalFieldPlugin,
];

export function FieldBuilder({
  form,
  field,
  noWrap,
  isLabelHidden,
}: FieldBuilderProps) {
  const editorContext = useEditorContext();

  if (!shouldFieldBeDisplayed(field)) {
    return null;
  }

  const fieldComponent = FIELD_COMPONENTS.find(
    (component) => component.name === (field.component as string)
  );

  const { onChange, getValue } = createFieldController({
    field,
    editorContext,
    format: field.format ?? fieldComponent?.format,
    parse: field.parse ?? fieldComponent?.parse,
  });

  if (fieldComponent) {
    return (
      <fieldComponent.Component
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
    console.log("not a string");

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

  return (
    <FieldMetaWrapper
      input={{
        value: getValue(),
        onChange,
      }}
      field={field}
      layout="column"
    >
      <Typography>Unrecognized field type</Typography>
    </FieldMetaWrapper>
  );
}

export interface FieldsBuilderProps {
  form: Form;
  fields: InternalField[];
}

export function FieldsBuilder({ form, fields }: FieldsBuilderProps) {
  const editorContext = useEditorContext();
  const panelContext = useContext(PanelContext);
  // const grouped: Record<string, Array<InternalField>> = {};
  const groupedWithSubgroups: { groupName: string; subGroups: string[] }[] = [];
  const ungrouped: Array<InternalField> = [];

  fields.forEach((field) => {
    if (!shouldFieldBeDisplayed(field)) {
      return;
    }

    if (field.group) {
      let groupName: string;
      let subGroupName: string;
      if (field.group.includes("::")) {
        [groupName, subGroupName] = field.group.split("::");
      } else {
        groupName = field.group;
        subGroupName = "";
      }
      const existingGroup = groupedWithSubgroups.find(
        (group) => group.groupName === groupName
      );
      if (existingGroup) {
        if (!existingGroup.subGroups.includes(subGroupName)) {
          existingGroup.subGroups.push(subGroupName);
        }
      } else {
        groupedWithSubgroups.push({ groupName, subGroups: [subGroupName] });
      }
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
        background-color: ${Colors.black10};
      `}
    />
  );

  const identityField = fields.find((field) => field.component === "identity");

  // If nested panel is opened within the sidebar, we need to force rerender fields, but keep the panel open for better UX
  // to do that we also add breakpointIndex to the key of the each nested field
  const breakpointIndex = panelContext
    ? editorContext.breakpointIndex
    : undefined;

  return (
    <FieldsGroup>
      {identityField !== undefined && (
        <React.Fragment>
          <FieldBuilder field={identityField} form={form} />
          {horizontalLine}
        </React.Fragment>
      )}
      {groupedWithSubgroups.map(({ groupName, subGroups }) => (
        <div key={groupName}>
          <FieldsGroupLabel>{groupName}</FieldsGroupLabel>
          {subGroups.map((subGroupName) => {
            const fieldsInSubGroup =
              subGroupName === ""
                ? fields.filter((field) => field.group === groupName)
                : fields.filter(
                    (field) => field.group === `${groupName}::${subGroupName}`
                  );
            return fieldsInSubGroup.map((field, index, fields) => (
              <>
                {subGroupName != "" && (
                  <FieldsSubgroupLabel>{subGroupName}</FieldsSubgroupLabel>
                )}
                <div
                  key={generateFieldKey(field, breakpointIndex)}
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
              </>
            ));
          })}
          {horizontalLine}
        </div>
      ))}
      {ungrouped.map((field, index, fields) => (
        <div
          key={generateFieldKey(field, breakpointIndex)}
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

function generateFieldKey(
  field: InternalField,
  breakpointIndex: string | undefined
) {
  const key = `${toArray(field.name).join("_")}_${field.schemaProp.type}${
    breakpointIndex ? `_${breakpointIndex}` : ""
  }`;
  return key;
}

const FieldsGroupLabel = styled.div`
  display: flex;
  align-items: center;

  padding: 20px 16px 5px 16px;

  ${Fonts.label};
  color: #000;
`;

const FieldsSubgroupLabel = styled.div`
  display: flex;
  align-items: center;

  padding: 10px 16px 5px 16px;

  ${Fonts.label2};
  color: #222222;
`;

const FieldsGroup = styled.div`
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: auto !important;
`;
