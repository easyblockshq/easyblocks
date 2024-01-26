import {
  ExternalReference,
  FetchCompoundResourceResultValues,
  getExternalReferenceLocationKey,
  isEmptyExternalReference,
  isIdReferenceToDocumentExternalValue,
  isResolvedCompoundExternalDataValue,
} from "@easyblocks/core";
import { Select, SelectItem } from "@easyblocks/design-system";
import { dotNotationGet, toArray } from "@easyblocks/utils";
import React, { ComponentType, useLayoutEffect } from "react";
import {
  EditorContextType,
  EditorExternalTypeDefinition,
  useEditorContext,
} from "../../../../EditorContext";
import { useEditorExternalData } from "../../../../EditorExternalDataProvider";
import {
  FieldMixedValue,
  InternalWidgetComponentProps,
} from "../../../../types";
import { FieldRenderProps } from "../../../form-builder";
import { isMixedFieldValue } from "../../components/isMixedFieldValue";
import { MissingWidget } from "../MissingWidget";
import { FieldMetaWrapper } from "../wrapFieldWithMeta";

type ExternalFieldProps = FieldRenderProps<
  ExternalReference | FieldMixedValue,
  any
>;

const ExternalFieldComponent = (props: ExternalFieldProps) => {
  const {
    tinaForm,
    field,
    input,
    input: { value },
  } = props;
  const editorContext = useEditorContext();
  const externalData = useEditorExternalData();

  const fieldNames = toArray(field.name);

  const isSchemaPropRootParam = field.schemaProp.type.startsWith("param__");

  const ExternalField: ComponentType<InternalWidgetComponentProps> | undefined =
    !isMixedFieldValue(input.value)
      ? isSchemaPropRootParam
        ? getWidgetComponentForRootParam(input.value, editorContext)
        : getWidgetComponentByType(
            input.value,
            field.schemaProp.type,
            editorContext
          )
      : undefined;

  const path = fieldNames[0].split(".").slice(0, -1).join(".");
  const configId = dotNotationGet(editorContext.form.values, path)._id;
  const externalReferenceLocationKey = getExternalReferenceLocationKey(
    configId,
    field.schemaProp.prop,
    field.schemaProp.responsive ? editorContext.breakpointIndex : undefined
  );
  const externalValue = externalReferenceLocationKey
    ? externalData[externalReferenceLocationKey]
    : undefined;

  const isExternalValueResolvedCompoundExternalDataValue =
    !isMixedFieldValue(value) &&
    !isEmptyExternalReference(value) &&
    externalValue !== undefined &&
    isResolvedCompoundExternalDataValue(externalValue);

  const basicResources = isExternalValueResolvedCompoundExternalDataValue
    ? getBasicResourcesOfType(externalValue.value, field.schemaProp.type)
    : [];

  const isCompoundResourceValueSelectVisible =
    isExternalValueResolvedCompoundExternalDataValue &&
    !isIdReferenceToDocumentExternalValue(value.id) &&
    basicResources.length > 1;

  useLayoutEffect(() => {
    if (
      isExternalValueResolvedCompoundExternalDataValue &&
      basicResources.length === 1 &&
      !value.key
    ) {
      // We perform form change manually to avoid storing this change in editor's history
      editorContext.form.change(fieldNames[0], {
        ...value,
        key: basicResources[0].key,
      });
    }
  });

  return (
    <FieldMetaWrapper {...props} form={tinaForm} layout="column">
      <div
        css={`
          width: 100%;
        `}
      >
        {isMixedFieldValue(value) ? (
          "Mixed"
        ) : (
          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            `}
          >
            {ExternalField ? (
              <ExternalField
                id={value.id}
                resourceKey={"key" in value ? value.key : undefined}
                onChange={(newId, newKey) => {
                  const newValue: ExternalReference = {
                    id: newId,
                    widgetId: value.widgetId,
                  };

                  if (newKey && newValue.id !== null) {
                    newValue.key = newKey;
                  }

                  input.onChange(newValue);
                }}
                path={fieldNames[0]}
              />
            ) : (
              <MissingWidget type={field.schemaProp.type} />
            )}

            {isCompoundResourceValueSelectVisible && (
              <CompoundResourceValueSelect
                options={basicResources.map((r) => ({
                  id: externalReferenceLocationKey,
                  key: r.key,
                  label: r.label ?? r.key,
                }))}
                resource={{
                  id: externalReferenceLocationKey,
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
          </div>
        )}
      </div>
    </FieldMetaWrapper>
  );
};

export const ExternalFieldPlugin = {
  name: "external",
  Component: ExternalFieldComponent,
};

function getWidgetComponentByType(
  externalReference: ExternalReference,
  type: string,
  editorContext: EditorContextType
) {
  return (
    editorContext.types[type] as EditorExternalTypeDefinition
  ).widgets.find((w) => w.id === externalReference.widgetId)?.component;
}

function getWidgetComponentForRootParam(
  externalReference: ExternalReference,
  editorContext: EditorContextType
) {
  return Object.values(editorContext.types)
    .filter((t): t is EditorExternalTypeDefinition => t.type === "external")
    .flatMap((t) => t.widgets)
    .find((w) => w.id === externalReference.widgetId)?.component;
}

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
    <Select
      onChange={(value) => {
        const selectedOption = JSON.parse(value);
        props.onResourceKeyChange(selectedOption.id, selectedOption.key);
      }}
      value={
        props.resource.id !== null && props.resource.key !== undefined
          ? JSON.stringify({ id: props.resource.id, key: props.resource.key })
          : ""
      }
      placeholder="Select source..."
    >
      {props.options.map((r) => {
        return (
          <SelectItem
            key={`${r.id}.${r.key}`}
            value={JSON.stringify({ id: r.id, key: r.key })}
          >
            {r.label}
          </SelectItem>
        );
      })}
    </Select>
  );
}
