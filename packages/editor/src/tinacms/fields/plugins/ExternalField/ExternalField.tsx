import { isResolvedCompoundExternalDataValue } from "@easyblocks/app-utils";
import {
  AnyField,
  FetchCompoundResourceResultValues,
  Field,
  getResourceId,
  ResourceSchemaProp,
  TextResourceSchemaProp,
  UnresolvedResource,
} from "@easyblocks/core";
import { SSSelect } from "@easyblocks/design-system";
import { dotNotationGet, toArray } from "@easyblocks/utils";
import React, { ComponentType, Fragment, useContext } from "react";
import { css } from "styled-components";
import { ExternalDataContext } from "../../../../Editor";
import { useEditorContext } from "../../../../EditorContext";
import {
  FieldMixedValue,
  InternalWidgetComponentProps,
} from "../../../../types";
import { FieldRenderProps } from "../../../form-builder";
import { isMixedFieldValue } from "../../components/isMixedFieldValue";
import { ExternalValueWidgetsMenu } from "../ResponsiveField/ExternalValueWidgetsMenu";
import { FieldMetaWrapper } from "../wrapFieldWithMeta";

interface ExternalField
  extends Field<AnyField, Exclude<ResourceSchemaProp, TextResourceSchemaProp>> {
  externalField: ComponentType<InternalWidgetComponentProps>;
}

interface ExternalFieldProps
  extends FieldRenderProps<UnresolvedResource | FieldMixedValue, any> {
  field: ExternalField;
}

export const ExternalFieldComponent = (props: ExternalFieldProps) => {
  const {
    tinaForm,
    field,
    input,
    input: { value },
  } = props;
  const editorContext = useEditorContext();
  const externalData = useContext(ExternalDataContext);

  const fieldNames = toArray(field.name);
  const ExternalField = field.externalField;
  const isCustomResourceProp = field.schemaProp.type === "resource";
  const externalDataId = Object.keys(externalData).find((externalDataId) => {
    const path = fieldNames[0].split(".").slice(0, -1).join(".");
    const configId = dotNotationGet(editorContext.form.values, path)._id;

    return (
      externalDataId ===
      getResourceId(
        configId,
        field.schemaProp.prop,
        field.schemaProp.resourceType === "image" ||
          field.schemaProp.resourceType === "video"
          ? editorContext.breakpointIndex
          : undefined
      )
    );
  });
  const resource = externalDataId ? externalData[externalDataId] : undefined;

  const isCompoundResourceValueSelectVisible =
    !isMixedFieldValue(value) &&
    value.id !== null &&
    !value.id.startsWith("$.") &&
    externalDataId !== undefined &&
    resource !== undefined &&
    isResolvedCompoundExternalDataValue(resource);

  return (
    // @ts-expect-error
    <FieldMetaWrapper
      {...props}
      form={tinaForm}
      layout="column"
      renderDecoration={
        !isMixedFieldValue(value) && isCustomResourceProp
          ? () => {
              const widgets =
                editorContext.resourceTypes[field.schemaProp.resourceType]
                  .widgets;

              if (widgets.length === 1) {
                return null;
              }

              return (
                <ExternalValueWidgetsMenu
                  widgets={widgets}
                  selectedWidgetId={value.widgetId ?? widgets[0].id}
                  onChange={(widgetId) => {
                    editorContext.actions.runChange(() => {
                      fieldNames.forEach((fieldName) => {
                        const newFieldValue: UnresolvedResource = {
                          id: null,
                          widgetId,
                        };

                        editorContext.form.change(fieldName, newFieldValue);
                      });
                    });
                  }}
                />
              );
            }
          : undefined
      }
    >
      <div
        css={`
          width: 100%;
        `}
      >
        {isMixedFieldValue(value) ? (
          "Mixed"
        ) : (
          <Fragment>
            <ExternalField
              id={value.id}
              resourceKey={"key" in value ? value.key : undefined}
              onChange={(newId, newKey) => {
                const newValue: UnresolvedResource = {
                  id: newId,
                  widgetId: value.widgetId,
                };

                if (newKey) {
                  newValue.key = newKey;
                }

                input.onChange(newValue);
              }}
            />
            {isCompoundResourceValueSelectVisible && (
              <CompoundResourceValueSelect
                options={getBasicResourcesOfType(
                  resource.value,
                  field.schemaProp.resourceType
                ).map((r) => ({
                  id: externalDataId,
                  key: r.key,
                  label: r.label ?? r.key,
                }))}
                resource={{
                  id: externalDataId,
                  key: value.key,
                }}
                onResourceKeyChange={(_, key) => {
                  input.onChange({
                    ...value,
                    key,
                  });
                }}
              />
            )}
          </Fragment>
        )}
      </div>
    </FieldMetaWrapper>
  );
};

export const ExternalFieldPlugin = {
  name: "external",
  Component: ExternalFieldComponent,
};

export function getBasicResourcesOfType(
  compoundResourceValues: FetchCompoundResourceResultValues,
  type: string
) {
  return Object.entries(compoundResourceValues)
    .filter(([, r]) => r.type === type)
    .map(([key, r]) => {
      return {
        key,
        ...r,
      };
    });
}

export function CompoundResourceValueSelect(props: {
  options: Array<{ id: string; key: string; label: string }>;
  resource:
    | { id: null; key: undefined }
    | { id: string; key: string | undefined };
  onResourceKeyChange: (id: string, key: string) => void;
}) {
  return (
    <SSSelect
      onChange={(event) => {
        const selectedOption = JSON.parse(event.target.value);
        props.onResourceKeyChange(selectedOption.id, selectedOption.key);
      }}
      value={
        props.resource.id !== null
          ? JSON.stringify({ id: props.resource.id, key: props.resource.key })
          : ""
      }
      css={css`
        margin-top: 8px;
        margin-left: 0;

        & > select {
          text-align: left;
        }
      `}
    >
      {!props.resource.key && <option value="">--Select source--</option>}
      {props.options.map((r) => {
        return (
          <option
            key={`${r.id}.${r.key}`}
            value={JSON.stringify({ id: r.id, key: r.key })}
          >
            {r.label}
          </option>
        );
      })}
    </SSSelect>
  );
}
