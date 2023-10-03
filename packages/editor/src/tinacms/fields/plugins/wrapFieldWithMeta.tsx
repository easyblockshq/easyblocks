import {
  InternalField,
  isEmptyExternalDataConfigEntry,
  isIdReferenceToDocumentExternalData,
  isResourceSchemaProp,
  isTrulyResponsiveValue,
  responsiveValueFindDeviceWithDefinedValue,
  responsiveValueForceGet,
} from "@easyblocks/app-utils";
import {
  ExternalDataValue,
  getResourceId,
  LocalTextValue,
  ResourceDefinition,
  ResourceSchemaProp,
  TrulyResponsiveValue,
} from "@easyblocks/core";
import {
  Loader,
  Select,
  SelectItem,
  SSFonts,
  Typography,
} from "@easyblocks/design-system";
import { dotNotationGet, toArray } from "@easyblocks/utils";
import React, { ReactNode, useState } from "react";
import styled, { css } from "styled-components";
import { useConfigAfterAuto } from "../../../ConfigAfterAutoContext";
import { EditorContextType, useEditorContext } from "../../../EditorContext";
import { useEditorExternalData } from "../../../EditorExternalDataProvider";
import { COMPONENTS_SUPPORTING_MIXED_VALUES } from "../components/constants";
import { isMixedFieldValue } from "../components/isMixedFieldValue";
import { FieldProps } from "./fieldProps";
import type { ResponsiveFieldDefinition } from "./ResponsiveField/responsiveFieldController";
import { Tooltip, TooltipArrow, TooltipBody } from "./Tooltip";
import { useTooltip } from "./useTooltip";

type ExtraFieldMetaWrapperFields = {
  layout?: "column" | "row";
  noWrap?: boolean;
  isLabelHidden?: boolean;
};

type InputFieldType<ExtraFieldProps, InputProps> = Omit<
  FieldProps<InputProps>,
  "meta"
> &
  ExtraFieldProps &
  ExtraFieldMetaWrapperFields & {
    children: ReactNode;
    renderLabel?: (props: { label: string }) => ReactNode;
  };

// Wraps the Field component in labels describing the field's meta state
// Add any other fields that the Field component should expect onto the ExtraFieldProps generic type

export function FieldMetaWrapper<
  ExtraFieldProps = Record<string, unknown>,
  InputProps = Record<string, unknown>
>({
  children,
  field,
  input,
  noWrap,
  layout = "row",
  renderLabel,
  isLabelHidden,
}: InputFieldType<ExtraFieldProps, InputProps>) {
  const editorContext = useEditorContext();
  const configAfterAuto = useConfigAfterAuto();
  const externalData = useEditorExternalData();
  const {
    actions: { runChange },
    form,
    focussedField,
  } = editorContext;

  const { isOpen, tooltipProps, triggerProps, arrowProps } = useTooltip({
    isDisabled: field.description === undefined,
  });

  const isMixedValueSupported = isMixedValueSupportedByComponent(
    isResponsiveField(field) ? field.subComponent : field.component
  );

  const isMixedValue = isMixedFieldValue(input.value);
  const fieldNames = toArray(field.name);

  function handleButtonMixedClick() {
    runChange(() => {
      fieldNames.forEach((fieldName, _, names) => {
        const firstFieldValue = dotNotationGet(form.values, names[0]);
        form.change(fieldName, firstFieldValue);
      });
    });
  }

  const content = (
    <div
      css={css`
        width: 100%;
        display: flex;
        align-items: ${layout === "row" ? "flex-end" : "flex-start"};
        flex-direction: column;
      `}
    >
      {!isMixedValue || (isMixedValue && isMixedValueSupported) ? (
        children
      ) : (
        <TextButton
          component="button"
          variant="label"
          color="black40"
          onClick={handleButtonMixedClick}
        >
          Mixed
        </TextButton>
      )}
    </div>
  );

  if (noWrap) {
    return content;
  }

  const label = field.label || input.name;
  const { schemaProp } = field;
  const isResource = isResourceSchemaProp(schemaProp);
  const isExternalData =
    schemaProp.type === "resource" ||
    (schemaProp.type === "text" && !input.value.id?.startsWith("local."));
  const configPath = fieldNames[0].split(".").slice(0, -1).join(".");
  const fieldValue = dotNotationGet(configAfterAuto, fieldNames[0]);
  const config = dotNotationGet(configAfterAuto, configPath);
  const externalDataValue = isExternalData
    ? externalData[
        getResourceId(
          focussedField.length === 0 ? "$" : config._id,
          schemaProp.prop,
          isTrulyResponsiveValue(input.value)
            ? responsiveValueFindDeviceWithDefinedValue(
                input.value,
                editorContext.breakpointIndex,
                editorContext.devices
              )?.id
            : undefined
        )
      ]
    : undefined;

  const currentBreakpointFieldValue = responsiveValueForceGet(
    fieldValue,
    editorContext.breakpointIndex
  );

  const isLoadingExternalData =
    isExternalData &&
    !externalDataValue &&
    !isEmptyExternalDataConfigEntry(currentBreakpointFieldValue) &&
    !isIdReferenceToDocumentExternalData(currentBreakpointFieldValue.id);

  return (
    <FieldWrapper margin={false} layout={layout}>
      {!isLabelHidden && (
        <FieldLabelWrapper isFullWidth={layout === "column"}>
          {renderLabel?.({ label }) ?? (
            <FieldLabel
              htmlFor={toArray(field.name).join(",")}
              isError={
                externalDataValue !== undefined && "error" in externalDataValue
              }
              {...triggerProps}
            >
              <span
                css={`
                  line-height: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                `}
              >
                {label}
              </span>
              {isOpen && (
                <Tooltip {...tooltipProps}>
                  <TooltipArrow {...arrowProps} />
                  <TooltipBody>{field.description}</TooltipBody>
                </Tooltip>
              )}
            </FieldLabel>
          )}

          {isLoadingExternalData && (
            <Loader
              css={`
                margin-left: 6px;
              `}
            />
          )}

          {layout === "column" && isResource && !isMixedValue && (
            <WidgetsSelect
              schemaProp={schemaProp}
              value={currentBreakpointFieldValue}
              onChange={(widgetId) => {
                if (isTrulyResponsiveValue(input.value)) {
                  const newFieldValue: TrulyResponsiveValue<ExternalDataValue> =
                    {
                      ...input.value,
                      [editorContext.breakpointIndex]: {
                        id: null,
                        widgetId,
                      },
                    };

                  input.onChange(newFieldValue);
                } else {
                  const newFieldValue: ExternalDataValue = {
                    id: null,
                    widgetId,
                  };

                  input.onChange(newFieldValue);
                }
              }}
            />
          )}
        </FieldLabelWrapper>
      )}
      <FieldInputWrapper layout={layout}>{content}</FieldInputWrapper>
      {externalDataValue && "error" in externalDataValue && (
        <FieldError>{externalDataValue.error.message}</FieldError>
      )}
    </FieldWrapper>
  );
}

function WidgetsSelect({
  value,
  onChange,
  schemaProp,
}: {
  value: LocalTextValue | ExternalDataValue;
  onChange: (widgetId: string) => void;
  schemaProp: ResourceSchemaProp;
}) {
  const editorContext = useEditorContext();

  const [selectedWidgetId, setSelectedWidgetId] = useState<string | undefined>(
    () =>
      "widgetId" in value
        ? value.widgetId
        : getDefaultWidgetIdForResource(schemaProp, editorContext)
  );

  const availableWidgets = [
    ...(editorContext.resourceTypes[
      schemaProp.type === "resource" ? schemaProp.resourceType : schemaProp.type
    ]?.widgets ?? []),
  ];

  if (schemaProp.type === "text") {
    availableWidgets.unshift({
      id: "@easyblocks/local-text",
      label: "Local text",
      component: () => {
        return null;
      },
    });
  }

  if (availableWidgets.length === 1) {
    return null;
  }

  const selectedWidget = availableWidgets.find((w) =>
    "widgetId" in value ? w.id === value.widgetId : true
  );

  if (!selectedWidget) {
    return null;
  }

  return (
    <ExternalValueWidgetSelect
      widgets={availableWidgets}
      onChange={(widgetId) => {
        setSelectedWidgetId(widgetId);
        onChange(widgetId);
      }}
      selectedWidgetId={selectedWidgetId}
    />
  );
}

function ExternalValueWidgetSelect({
  selectedWidgetId,
  widgets,
  onChange,
}: {
  selectedWidgetId: string | undefined;
  widgets: Array<ResourceDefinition["widgets"][number]>;
  onChange: (widgetId: string) => void;
  icon?: string;
}) {
  const [internalSelectedWidgetId, setInternalSelectedWidgetId] = useState<
    string | undefined
  >(() => {
    if (selectedWidgetId !== undefined) {
      return selectedWidgetId;
    }

    return widgets[0]?.id;
  });

  const isControlled = selectedWidgetId !== undefined;

  const widgetId = isControlled ? selectedWidgetId : internalSelectedWidgetId;

  function handleWidgetIdChange(widgetId: string) {
    if (isControlled) {
      setInternalSelectedWidgetId(widgetId);
    }

    onChange(widgetId);
  }

  const selectedWidget = widgets.find((v) => v.id === widgetId);

  return (
    <FieldLabelIconWrapper>
      <Select
        value={selectedWidget?.id ?? ""}
        onChange={(widgetId) => {
          handleWidgetIdChange(widgetId);
        }}
        placeholder="Select widget..."
      >
        {widgets.map((widget) => {
          return (
            <SelectItem value={widget.id} key={widget.id}>
              {widget.label ?? widget.id}
            </SelectItem>
          );
        })}
      </Select>
    </FieldLabelIconWrapper>
  );
}

function getDefaultWidgetIdForResource(
  schemaProp: ResourceSchemaProp,
  editorContext: EditorContextType
): string | undefined {
  return editorContext.resourceTypes[schemaProp.resourceType]?.widgets[0]?.id;
}

function isResponsiveField(
  field: InternalField
): field is ResponsiveFieldDefinition {
  return (
    typeof field.component === "string" && field.component === "responsive2"
  );
}

function isMixedValueSupportedByComponent(
  component: InternalField["component"]
): boolean {
  if (typeof component === "string") {
    return COMPONENTS_SUPPORTING_MIXED_VALUES.includes(component);
  }

  return false;
}

const TextButton = styled(Typography)`
  padding: 0;
  margin: 0;
  background: transparent;
  border: 0;
  font-weight: 500;

  &:hover {
    color: black;
    cursor: pointer;
    text-decoration: underline;
  }
`;

export function wrapFieldsWithMeta<
  ExtraFieldProps = Record<string, any>,
  InputProps = Record<string, any>
>(
  Field: React.ComponentType<InputFieldType<ExtraFieldProps, InputProps>>,
  extraProps?: ExtraFieldMetaWrapperFields
) {
  return (props: InputFieldType<ExtraFieldProps, InputProps>) => {
    return (
      <FieldMetaWrapper {...props} {...extraProps}>
        <Field {...props} />
      </FieldMetaWrapper>
    );
  };
}

interface FieldWrapperProps {
  margin: boolean;
  layout: "column" | "row";
}

export const FieldWrapper = styled.div<FieldWrapperProps>`
  display: flex;
  flex-direction: ${({ layout }) => layout};
  gap: ${({ layout }) => (layout === "row" ? "10px" : "4px")};
  justify-content: space-between;
  align-items: flex-start;
  ${({ layout }) =>
    layout === "column" &&
    css`
      flex-grow: 1;
    `}
  position: relative;
  padding: 4px 16px;
`;

export const FieldLabelWrapper = styled.div<{ isFullWidth: boolean }>`
  all: unset;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ isFullWidth }) => isFullWidth && { width: "100%" }}
  min-height: 28px;
`;

type FieldLabelProps = {
  isError: boolean;
};

export const FieldLabel = styled.label<FieldLabelProps>`
  all: unset;
  ${SSFonts.body};
  color: ${({ isError }) => (isError ? "red" : "#000")};
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: default;
`;

export const FieldLabelIconWrapper = styled.span`
  display: flex;
  font-size: 14px;
  line-height: 1;
  margin-left: auto;
  padding-left: 8px;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

export const FieldDescription = styled.span`
  all: unset;
  display: block;
  font-family: "Inter", sans-serif;
  font-size: var(--tina-font-size-0);
  font-style: italic;
  font-weight: lighter;
  color: var(--tina-color-grey-6);
  padding-top: 4px;
  white-space: normal;
  margin: 0;
`;

const FieldError = styled.span`
  display: block;
  color: red;
  font-size: var(--tina-font-size-1);
  margin-top: 8px;
  font-weight: var(--tina-font-weight-regular);
`;

interface FieldInputWrapper {
  layout: "row" | "column";
}

const FieldInputWrapper = styled.div<FieldInputWrapper>`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  ${({ layout }) =>
    layout === "row"
      ? css`
          flex-grow: 1;
        `
      : css`
          width: 100%;
        `};
  min-height: 28px;
`;
