import {
  Component$$$SchemaProp,
  InternalField,
  isResourceSchemaProp,
  responsiveValueGet,
  Variants$$$SchemaProp,
} from "@easyblocks/app-utils";
import {
  getResourceFetchParams,
  getResourceType,
  ResolvedResource,
  resourceByIdentity,
  SchemaProp,
} from "@easyblocks/core";
import { SSFonts, Typography } from "@easyblocks/design-system";
import { dotNotationGet, toArray } from "@easyblocks/utils";
import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { useConfigAfterAuto } from "../../../ConfigAfterAutoContext";
import { EditorContextType, useEditorContext } from "../../../EditorContext";
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

type InputFieldType<ExtraFieldProps, InputProps> = FieldProps<InputProps> &
  ExtraFieldProps &
  ExtraFieldMetaWrapperFields & {
    children: ReactNode;
    renderLabel?: (props: { label: string }) => ReactNode;
    renderDecoration?: (props: {
      launcherIcon?: string;
      renderDefaultDecoration: () => ReactNode;
    }) => ReactNode;
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
  meta,
  noWrap,
  layout = "row",
  renderLabel,
  renderDecoration,
  isLabelHidden,
}: InputFieldType<ExtraFieldProps, InputProps>) {
  const editorContext = useEditorContext();
  const configAfterAuto = useConfigAfterAuto();
  const {
    actions: { runChange },
    form,
    resources,
  } = editorContext;

  const { isOpen, tooltipProps, triggerProps, arrowProps } = useTooltip({
    isDisabled: field.description === undefined,
  });

  const isMixedValueSupported = isMixedValueSupportedByComponent(
    isResponsiveField(field) ? field.subComponent : field.component
  );

  const isMixedValue = isMixedFieldValue(input.value);

  function handleButtonMixedClick() {
    runChange(() => {
      toArray(field.name).forEach((fieldName, _, names) => {
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
        justify-content: ${layout === "row" ? "flex-end" : "flex-start"};
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
      {meta.error && <FieldError>{meta.error}</FieldError>}
    </div>
  );

  if (noWrap) {
    return content;
  }

  const label = field.label || input.name;
  const { schemaProp } = field;
  const isResource = isResourceSchemaProp(schemaProp);
  const resolvedResource = isResource
    ? resources.find(
        resourceByIdentity(
          input.value.id,
          getResourceType(schemaProp, editorContext, input.value),
          input.value.info,
          getResourceFetchParams(
            responsiveValueGet(input.value, editorContext.breakpointIndex),
            schemaProp,
            editorContext
          )
        )
      )
    : undefined;

  let icon: string | undefined;

  if (
    schemaProp.type === "image" ||
    schemaProp.type === "video" ||
    schemaProp.type === "resource"
  ) {
    const resourceFieldValue = dotNotationGet(
      configAfterAuto,
      toArray(field.name)[0]
    );

    const resourceValue = responsiveValueGet(
      resourceFieldValue,
      editorContext.breakpointIndex
    );

    const adjustedResourceValue = {
      ...resourceValue,
    };

    if (
      !adjustedResourceValue.variant &&
      (field.schemaProp.type === "image" || field.schemaProp.type === "video")
    ) {
      adjustedResourceValue.variant =
        editorContext[`${field.schemaProp.type}VariantsDisplay`][0];
    }

    icon = getLauncherIcon(adjustedResourceValue, schemaProp, editorContext);
  }

  const renderDefaultDecoration = () => {
    if (icon !== undefined && !isMixedValue) {
      return (
        <FieldLabelIconWrapper dangerouslySetInnerHTML={{ __html: icon }} />
      );
    }

    return null;
  };

  return (
    <FieldWrapper margin={false} layout={layout}>
      {!isLabelHidden && (
        <FieldLabelWrapper isFullWidth={layout === "column"}>
          {renderLabel?.({ label }) ?? (
            <FieldLabel
              htmlFor={toArray(field.name).join(",")}
              isError={
                resolvedResource !== undefined &&
                resolvedResource.status === "error"
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

          {(layout === "column" &&
            renderDecoration?.({
              launcherIcon: icon,
              renderDefaultDecoration,
            })) ??
            renderDefaultDecoration()}
        </FieldLabelWrapper>
      )}
      <FieldInputWrapper layout={layout}>{content}</FieldInputWrapper>
    </FieldWrapper>
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

export function getLauncherIcon(
  resource: ResolvedResource,
  schemaProp: SchemaProp | Component$$$SchemaProp | Variants$$$SchemaProp,
  editorContext: EditorContextType
) {
  if (!isResourceSchemaProp(schemaProp)) {
    return;
  }

  const resolvedType = getResourceType(schemaProp, editorContext, resource);

  return editorContext.launcher &&
    resolvedType.startsWith(editorContext.launcher.id) &&
    editorContext.launcher.icon !== undefined
    ? editorContext.launcher.icon
    : undefined;
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
