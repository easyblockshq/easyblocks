import {
  getDevicesWidths,
  isTrulyResponsiveValue,
  responsiveValueGetDefinedValue,
} from "@easyblocks/app-utils";
import {
  Field,
  RefValue,
  ResponsiveValue,
  ThemeRefValue,
} from "@easyblocks/core";
import { SSInput, SSSelect } from "@easyblocks/design-system";
import { toArray } from "@easyblocks/utils";
import React, { useRef, useState } from "react";
import { FieldRenderProps } from "react-final-form";
import styled from "styled-components";
import { useEditorContext } from "../../../../EditorContext";
import { FieldMixedValue } from "../../../../types";
import { MIXED_VALUE } from "../../components/constants";
import { isMixedFieldValue } from "../../components/isMixedFieldValue";
import { wrapFieldsWithMeta } from "../wrapFieldWithMeta";

interface TokenField<TokenValue = unknown> extends Field {
  tokens: { [key: string]: ThemeRefValue<TokenValue> };
  normalizeCustomValue?: (value: string) => any;
  allowCustom?: boolean;
  extraValues?: string[];
}

interface TokenFieldProps<TokenValue>
  extends FieldRenderProps<
    RefValue<ResponsiveValue<string>> | FieldMixedValue,
    HTMLSelectElement
  > {
  field: TokenField<TokenValue>;
}

const CUSTOM_OPTION_VALUE = "__custom__";

function TokenFieldComponent<TokenValue>({
  input,
  field,
}: TokenFieldProps<TokenValue>) {
  const editorContext = useEditorContext();
  const normalizeCustomValue = field.normalizeCustomValue || ((x: string) => x);
  const allowCustom =
    field.allowCustom === undefined ? false : field.allowCustom;

  const [inputValue, setInputValue] = useState(
    isMixedFieldValue(input.value) ? "" : input.value?.value.toString() ?? ""
  );

  const customValueTextFieldRef = useRef<HTMLInputElement | null>(null);

  const options = Object.entries(field.tokens).map(([tokenId, tokenValue]) => ({
    id: tokenId,
    label: tokenValue.label ?? tokenId,
  }));

  const extraValues = field.extraValues || [];

  // Extra values are displayed in select
  if (extraValues) {
    extraValues.forEach((extraValue) => {
      options.push({
        id: extraValue,
        label: extraValue,
      });
    });
  }

  // If ref exist but is removed from a theme -> let's add special option for this
  if (
    !isMixedFieldValue(input.value) &&
    typeof input.value.ref === "string" &&
    !field.tokens[input.value.ref]
  ) {
    options.unshift({
      id: input.value.ref,
      label: `(removed) ${input.value.ref}`,
    });
  }

  const isExtraValueSelected =
    !isMixedFieldValue(input.value) &&
    !input.value.ref &&
    extraValues.includes(
      isTrulyResponsiveValue(input.value.value)
        ? (responsiveValueGetDefinedValue(
            // not sure about usage of responsiveValueGet without widths here
            input.value.value,
            editorContext.breakpointIndex,
            editorContext.devices,
            getDevicesWidths(
              editorContext.devices
            ) /** FOR NOW TOKENS ARE RELATIVE TO SCREEN **/
          ) as string)
        : input.value.value
    );

  const shouldShowInput =
    !isMixedFieldValue(input.value) &&
    !(input.value.ref || isExtraValueSelected);

  const selectValue = isMixedFieldValue(input.value)
    ? MIXED_VALUE
    : input.value.ref ||
      (isExtraValueSelected
        ? (input.value.value as string)
        : CUSTOM_OPTION_VALUE);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === CUSTOM_OPTION_VALUE) {
      if (isMixedFieldValue(input.value)) {
        input.onChange({
          value: "",
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
      });
      setInputValue(value);

      queueMicrotask(() => {
        customValueTextFieldRef.current?.focus();
      });
    } else if (extraValues.includes(selectedValue)) {
      input.onChange({
        value: selectedValue,
      });
    } else {
      input.onChange({
        ref: selectedValue,
        value: field.tokens[selectedValue].value,
      });
    }
  };

  return (
    <Root>
      <SSSelect
        value={selectValue}
        onChange={onSelectChange}
        controlSize="full-width"
        id={toArray(field.name).join(",")}
      >
        {isMixedFieldValue(input.value) && (
          <>
            <option value={MIXED_VALUE} disabled>
              Mixed
            </option>
            <option disabled key="divider" aria-hidden="true">
              ----------
            </option>
          </>
        )}
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
        {allowCustom && (
          <>
            <option disabled key="divider" aria-hidden="true">
              ----------
            </option>
            <option value={CUSTOM_OPTION_VALUE}>Custom</option>
          </>
        )}
      </SSSelect>

      {shouldShowInput && (
        <div>
          <div style={{ height: 4 }} />
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
        </div>
      )}
    </Root>
  );
}

const Root = styled.div`
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
