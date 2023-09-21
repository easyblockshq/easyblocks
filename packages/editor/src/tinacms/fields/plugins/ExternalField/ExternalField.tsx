import { isResolvedCompoundExternalDataValue } from "@easyblocks/app-utils";
import {
  AnyField,
  AnyTinaField,
  ExternalFieldCustom,
  ExternalFieldType,
  FetchCompoundResourceResultValues,
  Field,
  getResourceId,
  ResourceSchemaProp,
  TextResourceSchemaProp,
  UnresolvedResource,
} from "@easyblocks/core";
import { SSSelect, useToaster } from "@easyblocks/design-system";
import { dotNotationGet, toArray } from "@easyblocks/utils";
import React, { useContext, useEffect, useRef } from "react";
import { css } from "styled-components";
import { ExternalDataContext } from "../../../../Editor";
import { useEditorContext } from "../../../../EditorContext";
import { useApiClient } from "../../../../infrastructure/ApiClientProvider";
import { FieldMixedValue } from "../../../../types";
import { FieldBuilder, FieldRenderProps } from "../../../form-builder";
import { isMixedFieldValue } from "../../components/isMixedFieldValue";
import { ExternalValueWidgetsMenu } from "../ResponsiveField/ExternalValueWidgetsMenu";
import { FieldMetaWrapper } from "../wrapFieldWithMeta";

/**
 * Custom field launcher is just a "function call".
 *
 * The field function (component) is surely not bundled together with Editor's React.
 * So if devs want to write it in React, they need to use separate ReactDOM.render.
 */
function CustomFieldLauncher(props: {
  field: {
    externalField: ExternalFieldCustom;
  };
  input: {
    value: UnresolvedResource;
    onChange: (value: UnresolvedResource) => void;
  };
}) {
  const apiClient = useApiClient();
  const editorContext = useEditorContext();
  const toaster = useToaster();

  const rootNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const maybeCleanup = props.field.externalField.component({
      root: rootNodeRef.current!,
      value: props.input.value,
      onChange: (value) => {
        if (value.id === null) {
          props.input.onChange({
            id: null,
            widgetId: props.input.value.widgetId,
          });
          return;
        }

        props.input.onChange({
          id: value.id,
          key: value.key,
          widgetId: props.input.value.widgetId!,
        });
      },
      apiClient,
      projectId: editorContext.project.id,
      notify: {
        error: (message) => {
          toaster.error(message);
        },
      },
    });

    return () => {
      if (maybeCleanup) {
        maybeCleanup();
      }
    };
  });

  return (
    <div
      ref={rootNodeRef}
      css={css`
        width: 100%;
      `}
    ></div>
  );
}

interface ExternalField
  extends Field<AnyField, Exclude<ResourceSchemaProp, TextResourceSchemaProp>> {
  externalField: ExternalFieldType;
}

interface ExternalFieldProps
  extends FieldRenderProps<UnresolvedResource | FieldMixedValue, any> {
  field: ExternalField;
}

export const ExternalFieldComponent = (props: ExternalFieldProps) => {
  const { tinaForm, field, input } = props;
  const editorContext = useEditorContext();
  const fieldNames = toArray(field.name);
  const externalData = useContext(ExternalDataContext);

  const originalFormat = field.format ? field.format : (x: any) => x;
  const originalParse = field.parse ? field.parse : (x: any) => x;

  const externalField = props.field.externalField;

  let component: AnyTinaField["component"];
  const extraParams: Record<string, any> = {};

  // So far, we have 2 kinds of external fields, item-picker and custom
  if (externalField.type === "custom") {
    component = CustomFieldLauncher;
  } else if (externalField.type === "item-picker") {
    // this is legacy, but item-picker used to be "product picker". It turns out it's much more generic but old names stayed. To refactor.
    component = "product";
    extraParams.api = {
      products: externalField.getItems,
      product: externalField.getItemById,
      placeholder: externalField.placeholder,
    };
  } else {
    throw new Error("unknown type");
  }

  const { value } = input;

  const content = (
    <FieldBuilder
      form={tinaForm}
      field={{
        ...field,
        component,
        ...extraParams,
        format: (x: any, name) => {
          return originalFormat(x, name, field);
        },
        parse: (value: UnresolvedResource, name) => {
          return originalParse(value, name, field);
        },
      }}
      noWrap={props.noWrap}
      {...(!isMixedFieldValue(value) && {
        key: value.widgetId,
      })}
    />
  );

  const { schemaProp } = field;
  const isCustomResourceProp = schemaProp.type === "resource";
  const externalDataId = Object.keys(externalData).find((externalDataId) => {
    const path = fieldNames[0].split(".").slice(0, -1).join(".");
    const configId = dotNotationGet(editorContext.form.values, path)._id;

    return (
      externalDataId ===
      getResourceId(
        configId,
        schemaProp.prop,
        schemaProp.resourceType === "image" ||
          schemaProp.resourceType === "video"
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
                editorContext.resourceTypes[schemaProp.resourceType].widgets;

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
      {content}
      {isCompoundResourceValueSelectVisible && (
        <CompoundResourceValueSelect
          options={getBasicResourcesOfType(
            resource.value,
            schemaProp.resourceType
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
            props.input.onChange({
              ...input.value,
              key,
            });
          }}
        />
      )}
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
