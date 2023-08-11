import {
  isResourceSchemaProp,
  isTrulyResponsiveValue,
  responsiveValueForceGet,
} from "@easyblocks/app-utils";
import {
  ResourceVariant,
  TrulyResponsiveValue,
  UnresolvedResource,
} from "@easyblocks/core";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  SSButtonGhost,
  SSColors,
  SSFonts,
  SSIcons,
  Typography,
} from "@easyblocks/design-system";
import { dotNotationGet, toArray } from "@easyblocks/utils";
import React, { useState } from "react";
import styled from "styled-components";
import { useConfigAfterAuto } from "../../../../ConfigAfterAutoContext";
import { EditorContextType, useEditorContext } from "../../../../EditorContext";
import { FieldBuilder } from "../../../form-builder";
import { MIXED_VALUE } from "../../components/constants";
import { getUniqueValues } from "../../components/getUniqueValues";
import { Tooltip, TooltipArrow, TooltipBody } from "../Tooltip";
import { useTooltip } from "../useTooltip";
import { FieldLabelIconWrapper, FieldMetaWrapper } from "../wrapFieldWithMeta";
import {
  responsiveFieldController,
  ResponsiveFieldDefinition,
} from "./responsiveFieldController";

type ResponsivePluginProps = {
  input: {
    value: any;
    onChange: (...values: Array<any>) => void;
  };
  field: ResponsiveFieldDefinition;
  tinaForm: any;
  form: any;
  meta: any;
};

export const ResponsiveField = (props: ResponsivePluginProps) => {
  const { tinaForm, field, input } = props;

  const editorContext = useEditorContext();
  const configAfterAuto = useConfigAfterAuto();
  const normalizedFieldName = toArray(field.name);

  const fieldValues = normalizedFieldName.map((fieldName) =>
    dotNotationGet(configAfterAuto, fieldName)
  );

  const scalarFieldValues = fieldValues.map((fieldValue) => {
    return responsiveValueForceGet(
      // value from auto, so it's safe
      fieldValue,
      editorContext.breakpointIndex
    );
  });

  const uniqueValues = getUniqueValues(scalarFieldValues, (value) =>
    typeof value === "object" ? JSON.stringify(value) : value
  );

  const isMixedValue = uniqueValues.length > 1;
  const value = isMixedValue ? MIXED_VALUE : uniqueValues[0];

  const [selectedVariantId, setSelectedVariantId] = useState<
    string | undefined
  >(() => (isResourceSchemaProp(field.schemaProp) ? value.variant : undefined));

  const controller = responsiveFieldController({
    field,
    onChange: (newValues) => {
      input.onChange(...newValues);
    },
    formValues: tinaForm.values,
    editorContext,
    valuesAfterAuto: configAfterAuto,
  });

  const isValueDifferentFromMainBreakpoint =
    controller.isSet &&
    editorContext.breakpointIndex !== editorContext.mainBreakpointIndex;

  const isFieldVisible =
    !controller.isResponsive ||
    controller.isSet ||
    editorContext.breakpointIndex === editorContext.mainBreakpointIndex;

  const uniqueFieldValues = getUniqueValues(scalarFieldValues);

  const autoLabelChildren =
    uniqueFieldValues.length > 1 && uniqueFieldValues.includes(undefined)
      ? "Mixed"
      : getAutoLabelButtonLabel(value);

  const isExternalField = field.subComponent === "external";

  const { isOpen, arrowProps, tooltipProps, triggerProps } = useTooltip({
    isDisabled: !isValueDifferentFromMainBreakpoint,
    onClick: () => {
      controller.reset();
    },
  });

  const isImageSchemaProp = field.schemaProp.type === "image";
  const mediaVariantsDisplay = isImageSchemaProp
    ? editorContext.imageVariantsDisplay
    : editorContext.videoVariantsDisplay;

  return (
    // @ts-expect-error
    <FieldMetaWrapper
      {...props}
      layout={isExternalField ? "column" : "row"}
      renderLabel={
        isValueDifferentFromMainBreakpoint
          ? ({ label }) => (
              <ResetButton aria-label="Revert to auto" {...triggerProps}>
                <SSIcons.Reset />
                <ResetButtonLabel>{label}</ResetButtonLabel>
                {isOpen && (
                  <Tooltip {...tooltipProps}>
                    <TooltipArrow {...arrowProps} />
                    <TooltipBody>Revert to auto</TooltipBody>
                  </Tooltip>
                )}
              </ResetButton>
            )
          : undefined
      }
      renderDecoration={
        !isMixedValue
          ? ({ launcherIcon, renderDefaultDecoration }) => {
              const resourceVariants = isResourceSchemaProp(field.schemaProp)
                ? getResourceVariantsForField(field, editorContext)
                : [];
              const mediaVariantsDisplay = isImageSchemaProp
                ? editorContext.imageVariantsDisplay
                : editorContext.videoVariantsDisplay;
              const defaultLauncherVariantId = editorContext.launcher
                ? `${editorContext.launcher.id}.default`
                : undefined;
              const sortedResourceVariants: Array<ResourceVariant> = [];

              for (const variantId of mediaVariantsDisplay) {
                const resourceVariant = resourceVariants.find(
                  (v) => v.id === variantId
                );

                if (resourceVariant) {
                  sortedResourceVariants.push(resourceVariant);
                }
              }

              if (sortedResourceVariants.length <= 1) {
                return renderDefaultDecoration();
              }

              const defaultVariant = resourceVariants.find((v) =>
                field.schemaProp.type === "image" ||
                field.schemaProp.type === "video"
                  ? v.id === mediaVariantsDisplay[0]
                  : false
              );

              return (
                <ResourceVariantsMenu
                  resourceVariants={sortedResourceVariants}
                  onChange={(sourceId) => {
                    setSelectedVariantId(sourceId);

                    editorContext.actions.runChange(() => {
                      normalizedFieldName.forEach((fieldName) => {
                        if (isTrulyResponsiveValue(input.value)) {
                          const newFieldValue: TrulyResponsiveValue<UnresolvedResource> =
                            {
                              ...input.value,
                              [editorContext.breakpointIndex]: {
                                id: null,
                                variant: sourceId,
                              },
                            };

                          editorContext.form.change(fieldName, newFieldValue);
                        } else {
                          const newFieldValue: UnresolvedResource = {
                            id: null,
                            variant: sourceId,
                          };

                          editorContext.form.change(fieldName, newFieldValue);
                        }
                      });
                    });
                  }}
                  selectedVariantId={selectedVariantId}
                  icon={
                    launcherIcon &&
                    ((selectedVariantId === undefined &&
                      defaultVariant &&
                      defaultVariant.id === defaultLauncherVariantId) ||
                      selectedVariantId === defaultLauncherVariantId)
                      ? launcherIcon
                      : undefined
                  }
                />
              );
            }
          : undefined
      }
    >
      <div style={{ width: "100%" }}>
        {isFieldVisible ? (
          <FieldBuilder
            form={tinaForm}
            field={{
              ...controller.field,
              parse(value, name, field) {
                if (isResourceSchemaProp(field.schemaProp) && !value.variant) {
                  const nextValue: UnresolvedResource = {
                    ...value,
                    variant: selectedVariantId ?? mediaVariantsDisplay[0],
                  };

                  return (
                    controller.field.parse?.(nextValue, name, field) ??
                    nextValue
                  );
                }

                return controller.field.parse?.(value, name, field) ?? value;
              },
            }}
            noWrap={true}
          />
        ) : (
          <AutoLabel
            onClick={() => {
              controller.toggleOffAuto();
            }}
          >
            {autoLabelChildren}
          </AutoLabel>
        )}
      </div>
    </FieldMetaWrapper>
  );
};

export const ResponsiveFieldPlugin = {
  name: "responsive2" as const,
  Component: ResponsiveField,
};

export default ResponsiveFieldPlugin;

const AutoLabel = styled.div`
  ${SSFonts.body};
  color: ${SSColors.black40};
  text-align: right;

  &:hover {
    color: black;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;

  background-color: transparent;
  border: 0;
  padding: 0;

  color: ${SSColors.purple};

  cursor: pointer;
`;

const ResetButtonLabel = styled.span`
  ${SSFonts.body};
  line-height: 16px;
`;

function getAutoLabelButtonLabel(value: any): string {
  if (value === MIXED_VALUE) {
    return "auto: Mixed";
  }

  /**
   * This piece of code is crap
   */
  if (typeof value === "object") {
    if (value.ref !== undefined && value.value !== undefined) {
      const refNameParts = value.ref.split(".");
      return `auto: ${refNameParts[refNameParts.length - 1]}`;
    } else if (value.value !== undefined && value.id === undefined) {
      // just value field -> token
      return `auto: ${
        typeof value.value === "number"
          ? Math.round(value.value * 100) / 100
          : value.value
      }`;
    }
    return "auto";
  }

  if (typeof value === "boolean") {
    return `auto: ${JSON.stringify(value)}`;
  }

  return `auto: ${value}`;
}

export function ResourceVariantsMenu({
  selectedVariantId,
  resourceVariants,
  onChange,
  icon,
}: {
  selectedVariantId: string | undefined;
  resourceVariants: Array<ResourceVariant>;
  onChange: (variant: string) => void;
  icon?: string;
}) {
  const [internalSelectedVariantId, setInternalSelectedVariantId] = useState<
    string | undefined
  >(() => {
    if (selectedVariantId !== undefined) {
      return selectedVariantId;
    }

    return resourceVariants[0]?.id;
  });

  const isControlled = selectedVariantId !== undefined;

  const variantId = isControlled
    ? selectedVariantId
    : internalSelectedVariantId;

  function handleVariantIdChange(variantId: string) {
    if (isControlled) {
      setInternalSelectedVariantId(variantId);
    }

    onChange(variantId);
  }

  const selectedVariant = resourceVariants.find((v) => v.id === variantId);

  return (
    <Menu>
      <FieldLabelIconWrapper>
        <MenuTrigger>
          <SSButtonGhost>
            {icon !== undefined && (
              <span
                css={`
                  display: flex;
                  margin-left: 8px;

                  svg {
                    width: 14px;
                    height: 14px;
                    flex-shrink: 0;
                  }
                `}
                dangerouslySetInnerHTML={{ __html: icon }}
              ></span>
            )}
            {selectedVariant
              ? selectedVariant.label ?? selectedVariant.id
              : "Select variant"}
            <SSIcons.ChevronDown size={16} />
          </SSButtonGhost>
        </MenuTrigger>
      </FieldLabelIconWrapper>
      <MenuContent>
        {resourceVariants.map((variant) => {
          return (
            <MenuItem
              key={variant.id}
              onClick={() => {
                if (variant.id === selectedVariantId) {
                  return;
                }

                handleVariantIdChange(variant.id);
              }}
            >
              <Typography
                color={
                  selectedVariant && selectedVariant.id === variant.id
                    ? "black20"
                    : "white"
                }
              >
                {variant.label ?? variant.id}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuContent>
    </Menu>
  );
}

function getResourceVariantsForField(
  field: ResponsiveFieldDefinition,
  editorContext: EditorContextType
) {
  return field.schemaProp.type === "image" || field.schemaProp.type === "video"
    ? editorContext[`${field.schemaProp.type}Variants`]
    : [];
}
