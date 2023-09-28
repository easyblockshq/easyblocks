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
import {
  Select,
  SelectItem,
  SelectSeparator,
  SSColors,
  SSInput,
} from "@easyblocks/design-system";
import React, {
  forwardRef,
  Fragment,
  ReactNode,
  useRef,
  useState,
} from "react";
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

  const onSelectChange = (selectedValue: string) => {
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

  const customInputElement = shouldShowInput ? (
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
  ) : null;

  if (field.schemaProp.type === "color") {
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
                    previewColor={(field.tokens[o.id]?.value as string) ?? o.id}
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

const SelectColorTokenItem = forwardRef<
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
