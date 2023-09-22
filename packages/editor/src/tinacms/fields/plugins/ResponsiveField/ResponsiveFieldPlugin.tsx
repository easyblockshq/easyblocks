import {
  isResourceSchemaProp,
  isTrulyResponsiveValue,
  responsiveValueForceGet,
} from "@easyblocks/app-utils";
import {
  ResourceSchemaProp,
  TrulyResponsiveValue,
  UnresolvedResource,
} from "@easyblocks/core";
import { SSColors, SSFonts, SSIcons } from "@easyblocks/design-system";
import { dotNotationGet, toArray } from "@easyblocks/utils";
import React, { useState } from "react";
import styled from "styled-components";
import { useConfigAfterAuto } from "../../../../ConfigAfterAutoContext";
import { useEditorContext } from "../../../../EditorContext";
import { FieldBuilder } from "../../../form-builder";
import { MIXED_VALUE } from "../../components/constants";
import { getUniqueValues } from "../../components/getUniqueValues";
import { Tooltip, TooltipArrow, TooltipBody } from "../Tooltip";
import { useTooltip } from "../useTooltip";
import { FieldMetaWrapper } from "../wrapFieldWithMeta";
import { ExternalValueWidgetsMenu } from "./ExternalValueWidgetsMenu";
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

  const [selectedWidgetId, setSelectedWidgetId] = useState<string | undefined>(
    () =>
      isResourceSchemaProp(field.schemaProp)
        ? (value as UnresolvedResource).widgetId ??
          getDefaultWidgetIdForResource(field.schemaProp)
        : undefined
  );

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

  const schemaProp = field.schemaProp;

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
        !isMixedValue &&
        isResourceSchemaProp(schemaProp) &&
        schemaProp.type === "resource"
          ? ({ renderDefaultDecoration }) => {
              const availableWidgets =
                editorContext.resourceTypes[schemaProp.resourceType]?.widgets;

              if (!availableWidgets) {
                return null;
              }

              if (availableWidgets.length === 1) {
                return renderDefaultDecoration();
              }

              const selectedWidget = availableWidgets.find((w) =>
                value.widgetId ? w.id === value.widgetId : true
              );

              if (!selectedWidget) {
                return null;
              }

              return (
                <ExternalValueWidgetsMenu
                  widgets={availableWidgets}
                  onChange={(widgetId) => {
                    setSelectedWidgetId(widgetId);

                    editorContext.actions.runChange(() => {
                      if (isTrulyResponsiveValue(input.value)) {
                        const newFieldValue: TrulyResponsiveValue<UnresolvedResource> =
                          {
                            ...input.value,
                            [editorContext.breakpointIndex]: {
                              id: null,
                              widgetId,
                            },
                          };

                        input.onChange(newFieldValue);
                      } else {
                        const newFieldValue: UnresolvedResource = {
                          id: null,
                          widgetId,
                        };

                        input.onChange(newFieldValue);
                      }
                    });
                  }}
                  selectedWidgetId={selectedWidgetId}
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
            field={controller.field}
            noWrap={true}
          />
        ) : (
          <AutoLabel
            align={isExternalField ? "left" : "right"}
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

  function getDefaultWidgetIdForResource(
    schemaProp: ResourceSchemaProp
  ): string | undefined {
    return editorContext.resourceTypes[schemaProp.resourceType]?.widgets[0]?.id;
  }
};

export const ResponsiveFieldPlugin = {
  name: "responsive2" as const,
  Component: ResponsiveField,
};

export default ResponsiveFieldPlugin;

const AutoLabel = styled.div<{ align: "left" | "right" }>`
  ${SSFonts.body};
  color: ${SSColors.black40};
  text-align: ${(props) => props.align};

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
