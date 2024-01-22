import {
  ExternalReference,
  ExternalSchemaProp,
  LocalTextReference,
  TextSchemaProp,
  TrulyResponsiveValue,
  getExternalReferenceLocationKey,
  isEmptyExternalReference,
  isIdReferenceToDocumentExternalValue,
  isTrulyResponsiveValue,
  responsiveValueFindDeviceWithDefinedValue,
  responsiveValueForceGet,
} from "@easyblocks/core";
import {
  InternalField,
  isExternalSchemaProp,
} from "@easyblocks/core/_internals";
import {
  Loader,
  SSFonts,
  Select,
  SelectItem,
  Typography,
} from "@easyblocks/design-system";
import { dotNotationGet, toArray, uniqueId } from "@easyblocks/utils";
import React, { ReactNode, useState } from "react";
import styled, { css } from "styled-components";
import { useConfigAfterAuto } from "../../../ConfigAfterAutoContext";
import {
  EditorExternalTypeDefinition,
  useEditorContext,
} from "../../../EditorContext";
import { useEditorExternalData } from "../../../EditorExternalDataProvider";
import { FieldRenderProps } from "../../form-builder";
import { COMPONENTS_SUPPORTING_MIXED_VALUES } from "../components/constants";
import { isMixedFieldValue } from "../components/isMixedFieldValue";
import type { ResponsiveFieldDefinition } from "./ResponsiveField/responsiveFieldController";
import { Tooltip, TooltipArrow, TooltipBody } from "./Tooltip";
import { useTooltip } from "./useTooltip";
import { Form } from "../../../form";

type ExtraFieldMetaWrapperFields = {
  layout?: "column" | "row";
  noWrap?: boolean;
  isLabelHidden?: boolean;
};

export interface FieldProps<InputProps extends Record<string, unknown>>
  extends FieldRenderProps<any, HTMLElement> {
  field: InternalField;
  form: Form;
}

type InputFieldType<
  ExtraFieldProps extends Record<string, unknown>,
  InputProps extends Record<string, unknown>
> = Omit<FieldProps<InputProps>, "meta"> &
  ExtraFieldProps &
  ExtraFieldMetaWrapperFields & {
    children: ReactNode;
    renderLabel?: (props: { label: string }) => ReactNode;
  };

// Wraps the Field component in labels describing the field's meta state
// Add any other fields that the Field component should expect onto the ExtraFieldProps generic type

export function FieldMetaWrapper<
  ExtraFieldProps extends Record<string, unknown> = Record<string, unknown>,
  InputProps extends Record<string, unknown> = Record<string, unknown>
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
  const { isOpen, tooltipProps, triggerProps, arrowProps } = useTooltip({
    isDisabled: field.description === undefined,
  });

  const {
    actions: { runChange },
    form,
    focussedField,
  } = editorContext;

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
  const isExternalField =
    isExternalSchemaProp(schemaProp, editorContext.types) ||
    (schemaProp.type === "text" && !input.value.id?.startsWith("local."));
  const componentPaths = fieldNames.map((fieldName) =>
    fieldName[0].split(".").slice(0, -1).join(".")
  );
  const fieldValues = fieldNames.map((f) => dotNotationGet(configAfterAuto, f));
  const configs = componentPaths.map((c) => dotNotationGet(configAfterAuto, c));
  const externalValues = isExternalField
    ? configs.map(
        (c) =>
          externalData[
            getExternalReferenceLocationKey(
              focussedField.length === 0 ? "$" : c._id,
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
      )
    : undefined;

  const currentBreakpointFieldValues = fieldValues.map((v) =>
    responsiveValueForceGet(v, editorContext.breakpointIndex)
  );

  const isLoadingExternalValue =
    isExternalField &&
    externalValues?.length === 0 &&
    currentBreakpointFieldValues.every(
      (v) =>
        !isEmptyExternalReference(v) &&
        !isIdReferenceToDocumentExternalValue(v.id)
    );

  return (
    <FieldWrapper margin={false} layout={layout}>
      {!isLabelHidden && (
        <FieldLabelWrapper isFullWidth={layout === "column"}>
          {renderLabel?.({ label }) ?? (
            <FieldLabel
              htmlFor={toArray(field.name).join(",")}
              isError={
                externalValues !== undefined && "error" in externalValues
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

          {isLoadingExternalValue && (
            <Loader
              css={`
                margin-left: 6px;
              `}
            />
          )}

          {layout === "column" &&
            (isExternalSchemaProp(schemaProp, editorContext.types) ||
              schemaProp.type === "text") &&
            !isMixedValue && (
              <WidgetsSelect
                schemaProp={schemaProp}
                value={currentBreakpointFieldValues[0]}
                onChange={(widgetId) => {
                  if (widgetId === "@easyblocks/local-text") {
                    const newFieldValue: LocalTextReference = {
                      id: `local.${uniqueId()}`,
                      value: {},
                      widgetId,
                    };

                    input.onChange(newFieldValue);
                    return;
                  }

                  if (isTrulyResponsiveValue(input.value)) {
                    const newFieldValue: TrulyResponsiveValue<ExternalReference> =
                      {
                        ...input.value,
                        [editorContext.breakpointIndex]: {
                          id: null,
                          widgetId,
                        },
                      };

                    input.onChange(newFieldValue);
                  } else {
                    const newFieldValue: ExternalReference = {
                      id: null,
                      widgetId,
                    };

                    input.onChange(newFieldValue);
                  }
                }}
                isRootComponent={fieldNames.some(
                  (f) => f.split(".").length === 1
                )}
              />
            )}
        </FieldLabelWrapper>
      )}

      <FieldInputWrapper layout={layout}>{content}</FieldInputWrapper>

      {!isMixedFieldValue &&
        isExternalField &&
        externalValues!.length > 0 &&
        "error" in externalValues![0] && (
          <FieldError>{externalValues![0].error.message}</FieldError>
        )}
    </FieldWrapper>
  );
}

function WidgetsSelect({
  value,
  onChange,
  schemaProp,
  isRootComponent,
}: {
  value: LocalTextReference | ExternalReference;
  onChange: (widgetId: string) => void;
  schemaProp: ExternalSchemaProp | TextSchemaProp;
  isRootComponent: boolean;
}) {
  const editorContext = useEditorContext();
  const [selectedWidgetId, setSelectedWidgetId] = useState(value.widgetId);

  const widgets = (
    editorContext.types[schemaProp.type] as EditorExternalTypeDefinition
  ).widgets;
  const availableWidgets = isRootComponent
    ? widgets.filter((w) => {
        return w.id !== "@easyblocks/document-data";
      })
    : [...widgets];

  if (schemaProp.type === "text") {
    availableWidgets.unshift({
      id: "@easyblocks/local-text",
      label: "Local text",
      component: () => {
        return null;
      },
    });
  }

  if (availableWidgets.length <= 1) {
    return null;
  }

  return (
    <FieldLabelIconWrapper>
      <Select
        value={selectedWidgetId}
        onChange={(widgetId) => {
          setSelectedWidgetId(widgetId);
          onChange(widgetId);
        }}
      >
        {availableWidgets.map((widget) => {
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
  ExtraFieldProps extends Record<string, any> = Record<string, any>,
  InputProps extends Record<string, any> = Record<string, any>
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
