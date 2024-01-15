import {
  TokenValue as CoreTokenValue,
  Field,
  NonNullish,
  ThemeFont,
  ThemeRefValue,
  TokenTypeWidgetComponentProps,
  getDevicesWidths,
  isTrulyResponsiveValue,
  responsiveValueFill,
  responsiveValueForceGet,
  responsiveValueGetDefinedValue,
} from "@easyblocks/core";
import {
  SSColors,
  SSInput,
  Select,
  SelectItem,
  SelectSeparator,
} from "@easyblocks/design-system";
import React, {
  ComponentType,
  Fragment,
  ReactNode,
  forwardRef,
  useRef,
  useState,
} from "react";
import { FieldRenderProps } from "react-final-form";
import styled from "styled-components";
import { EditorContextType, useEditorContext } from "../../../../EditorContext";
import { FieldMixedValue } from "../../../../types";
import { MIXED_VALUE } from "../../components/constants";
import { isMixedFieldValue } from "../../components/isMixedFieldValue";
import { wrapFieldsWithMeta } from "../wrapFieldWithMeta";

interface TokenField<TokenValue extends NonNullish = NonNullish> extends Field {
  tokens: { [key: string]: ThemeRefValue<TokenValue> };
  normalizeCustomValue?: (value: string) => any;
  allowCustom?: boolean;
  extraValues?: Array<string | { value: string; label: string }>;
}

interface TokenFieldProps<TokenValue extends NonNullish>
  extends FieldRenderProps<
    CoreTokenValue | FieldMixedValue,
    HTMLSelectElement
  > {
  field: TokenField<TokenValue>;
}

export const CUSTOM_OPTION_VALUE = "__custom__";

export function extraValuesIncludes(
  extraValues: Array<string | { value: string; label: string }>,
  value: string
) {
  for (let i = 0; i < extraValues.length; i++) {
    const extraValue = extraValues[i];
    if (typeof extraValue === "string") {
      if (extraValue === value) {
        return true;
      }
    } else {
      if (extraValue.value === value) {
        return true;
      }
    }
  }
  return false;
}

type TokenTypesResult = Record<
  string,
  Extract<EditorContextType["types"][string], { type: "token" }>
>;

function useTokenTypes(): TokenTypesResult {
  const editorContext = useEditorContext();

  const tokenTypes = Object.fromEntries(
    Object.entries(editorContext.types).filter<
      [string, TokenTypesResult[string]]
    >(
      (
        typeDefinitionEntry
      ): typeDefinitionEntry is [string, TokenTypesResult[string]] => {
        return typeDefinitionEntry[1].type === "token";
      }
    )
  );

  return tokenTypes;
}

function TokenFieldComponent<TokenValue extends NonNullish>({
  input,
  field,
}: TokenFieldProps<TokenValue>) {
  const editorContext = useEditorContext();
  const tokenTypes = useTokenTypes();
  const tokenTypeDefinition = tokenTypes[field.schemaProp.type];
  const normalizeCustomValue = field.normalizeCustomValue || ((x: string) => x);
  const allowCustom = field.allowCustom ?? false;
  const extraValues = field.extraValues ?? [];

  const [inputValue, setInputValue] = useState(
    isMixedFieldValue(input.value) ? "" : input.value?.value.toString() ?? ""
  );

  const customValueTextFieldRef = useRef<HTMLInputElement | null>(null);

  const options = Object.entries(field.tokens).map(([tokenId, tokenValue]) => {
    if (tokenTypeDefinition.token === "fonts") {
      const fontTokenLabel = getFontTokenLabel(
        tokenId,
        tokenValue,
        editorContext
      );

      return {
        id: tokenId,
        label: fontTokenLabel,
      };
    }

    return {
      id: tokenId,
      label: tokenValue.label ?? tokenId,
    };
  });

  // Extra values are displayed in select
  if (field.extraValues) {
    field.extraValues.forEach((extraValue) => {
      if (typeof extraValue === "string") {
        options.push({
          id: extraValue,
          label: extraValue,
        });
      } else {
        options.push({
          id: extraValue.value,
          label: extraValue.label,
        });
      }
    });
  }

  // If token exist but is removed from a theme -> let's add special option for this
  if (
    !isMixedFieldValue(input.value) &&
    typeof input.value.tokenId === "string" &&
    !field.tokens[input.value.tokenId]
  ) {
    options.unshift({
      id: input.value.tokenId,
      label: `(removed) ${input.value.tokenId}`,
    });
  }

  const isExtraValueSelected =
    !isMixedFieldValue(input.value) &&
    !input.value.tokenId &&
    extraValuesIncludes(
      extraValues,
      responsiveValueGetDefinedValue(
        input.value.value,
        editorContext.breakpointIndex,
        editorContext.devices,
        getDevicesWidths(
          editorContext.devices
        ) /** FOR NOW TOKENS ARE RELATIVE TO SCREEN **/
      ) as string
    );

  const shouldShowCustomValueInput =
    !isMixedFieldValue(input.value) &&
    !(input.value.tokenId || isExtraValueSelected);

  const selectValue = isMixedFieldValue(input.value)
    ? MIXED_VALUE
    : input.value.tokenId ??
      (isExtraValueSelected
        ? (input.value.value as string)
        : CUSTOM_OPTION_VALUE);

  const onSelectChange = (selectedValue: string) => {
    if (selectedValue === CUSTOM_OPTION_VALUE) {
      if (isMixedFieldValue(input.value)) {
        input.onChange({
          value: "",
          widgetId: tokenTypeDefinition.widget.id,
        });
        setInputValue("");
        return;
      }

      let value = input.value.value;

      // responsive token values are transformed into value from current breakpoint
      if (isTrulyResponsiveValue(value)) {
        value = responsiveValueGetDefinedValue(
          // Not sure about usage of responsiveValueGet without widths
          value,
          editorContext.breakpointIndex,
          editorContext.devices,
          getDevicesWidths(
            editorContext.devices
          ) /** FOR NOW TOKENS ARE RELATIVE TO SCREEN **/
        ) as string;
      }

      input.onChange({
        value,
        widgetId: input.value.widgetId,
      });
      setInputValue(value);

      queueMicrotask(() => {
        customValueTextFieldRef.current?.focus();
      });
    } else if (extraValuesIncludes(extraValues, selectedValue)) {
      input.onChange({
        value: selectedValue,
        widgetId: isMixedFieldValue(input.value)
          ? tokenTypeDefinition.widget.id
          : input.value.widgetId,
      });
    } else {
      input.onChange({
        tokenId: selectedValue,
        value: field.tokens[selectedValue].value,
        widgetId: isMixedFieldValue(input.value)
          ? tokenTypeDefinition.widget.id
          : input.value.widgetId,
      });
    }
  };

  const CustomInputWidgetComponent = tokenTypeDefinition?.widget?.component as
    | ComponentType<TokenTypeWidgetComponentProps<string>>
    | undefined;

  const customInputElement = shouldShowCustomValueInput ? (
    <div>
      <div style={{ height: 4 }} />
      {CustomInputWidgetComponent ? (
        <CustomInputWidgetComponent
          value={inputValue}
          onChange={(value) => {
            input.onChange({
              value,
              widgetId: isMixedFieldValue(input.value)
                ? tokenTypeDefinition.widget.id
                : input.value.widgetId,
            });
          }}
        />
      ) : (
        <SSInput
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
          }}
          onBlur={() => {
            const normalizedValue = normalizeCustomValue(inputValue);
            setInputValue(normalizedValue);
            input.onChange({
              value: normalizedValue,
            });
          }}
          ref={customValueTextFieldRef}
          align={"right"}
        />
      )}
    </div>
  ) : null;

  if (tokenTypeDefinition.token === "colors") {
    return (
      <Fragment>
        <Select value={selectValue} onChange={onSelectChange}>
          {isMixedFieldValue(input.value) && (
            <>
              <SelectColorTokenItem value={MIXED_VALUE} isDisabled>
                Mixed
              </SelectColorTokenItem>
              <SelectSeparator />
            </>
          )}
          {
            <Fragment>
              {options.map((o) => {
                return (
                  <SelectColorTokenItem
                    key={o.id}
                    value={o.id}
                    // Color tokens are always strings
                    previewColor={
                      (field.tokens[o.id]?.value as unknown as
                        | string
                        | undefined) ?? o.id
                    }
                  >
                    {o.label}
                  </SelectColorTokenItem>
                );
              })}
              {allowCustom && (
                <>
                  <SelectSeparator />
                  <SelectColorTokenItem
                    value={CUSTOM_OPTION_VALUE}
                    previewColor={
                      selectValue === CUSTOM_OPTION_VALUE
                        ? ((
                            input.value as Exclude<
                              (typeof input)["value"],
                              FieldMixedValue
                            >
                          ).value as string)
                        : undefined
                    }
                  >
                    Custom
                  </SelectColorTokenItem>
                </>
              )}
            </Fragment>
          }
        </Select>
        {customInputElement}
      </Fragment>
    );
  }

  return (
    <Root>
      <Select value={selectValue} onChange={onSelectChange}>
        {isMixedFieldValue(input.value) && (
          <>
            <SelectItem value={MIXED_VALUE} isDisabled>
              Mixed
            </SelectItem>
            <SelectSeparator />
          </>
        )}
        {
          <Fragment>
            {options.map((o) => {
              return (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                </SelectItem>
              );
            })}
            {allowCustom && (
              <>
                <SelectSeparator />
                <SelectItem value={CUSTOM_OPTION_VALUE}>Custom</SelectItem>
              </>
            )}
          </Fragment>
        }
      </Select>
      {customInputElement}
    </Root>
  );
}

function getFontTokenLabel(
  name: string,
  token: ThemeRefValue<ThemeFont>,
  editorContext: EditorContextType
) {
  const filledResponsiveFontValue = responsiveValueFill(
    token.value,
    editorContext.devices,
    getDevicesWidths(editorContext.devices)
  );

  const currentDeviceFontValue = responsiveValueForceGet(
    filledResponsiveFontValue,
    editorContext.breakpointIndex
  );

  if (isValidFontTokenValue(currentDeviceFontValue)) {
    return `${token.label ?? name} (${stripPxUnit(
      currentDeviceFontValue.fontSize
    )}/${stripPxUnit(currentDeviceFontValue.lineHeight)})`;
  }

  return token.label ?? name;
}

function stripPxUnit(value: number | string) {
  if (typeof value === "number") {
    return value;
  }

  return value.replace(new RegExp("px"), "");
}

function isValidFontTokenValue(value: unknown): value is {
  fontSize: number | string;
  lineHeight: number | string;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "fontSize" in value &&
    "lineHeight" in value
  );
}

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const TokenFieldPlugin = {
  name: "token",
  type: "token",
  Component: wrapFieldsWithMeta(TokenFieldComponent),
};

export { TokenFieldComponent };
export type { TokenField, TokenFieldProps };

export const SelectColorTokenItem = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    previewColor?: string;
    value: string;
    isDisabled?: boolean;
  }
>((props, ref) => {
  return (
    <SelectItem value={props.value} isDisabled={props.isDisabled} ref={ref}>
      <span
        css={`
          display: flex;
          align-items: center;
          gap: 6px;
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
        >
          <circle
            cx="7.28931"
            cy="8.00024"
            r="6.78931"
            fill={props.previewColor ?? "#fff"}
            stroke={SSColors.black100}
          />
        </svg>
        <span>{props.children}</span>
      </span>
    </SelectItem>
  );
});
