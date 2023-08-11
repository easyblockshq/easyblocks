import { InternalField } from "@easyblocks/app-utils";
import { SSSelect } from "@easyblocks/design-system";
import { toArray } from "@easyblocks/utils";
import React from "react";
import { FieldMixedValue } from "../../../types";
import { FieldRenderProps } from "../../form-builder";
import { MIXED_VALUE } from "./constants";
import { isMixedFieldValue } from "./isMixedFieldValue";

type Option =
  | {
      value: string;
      label: string;
    }
  | {
      isDivider: true;
    };

interface SelectFieldProps extends InternalField {
  options: (Option | string)[];
  icon?: any;
  nullLabel?: string;
}
export interface SelectProps
  extends FieldRenderProps<string | FieldMixedValue> {
  name: Array<string> | string;
  field: SelectFieldProps;
  disabled?: boolean;
  options?: (Option | string)[];
}

const NULL_VALUE = "__NULL__";

export const Select: React.FC<SelectProps> = ({ input, field, options }) => {
  const { value, onChange } = input;
  const isMixedValue = isMixedFieldValue(value);

  const selectOptions = options || field.options;
  let normalizedSelectOptions = selectOptions.map(toProps);

  if (isMixedValue) {
    normalizedSelectOptions.unshift(
      {
        label: "Mixed",
        value: MIXED_VALUE,
      },
      {
        isDivider: true,
      }
    );
  }

  let inputValue = isMixedValue ? MIXED_VALUE : value;

  if (field.nullLabel) {
    normalizedSelectOptions = [
      {
        value: NULL_VALUE,
        label: field.nullLabel,
      },
      ...normalizedSelectOptions,
    ];
    inputValue = inputValue || NULL_VALUE;
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.stopPropagation();
    const value = event.target.value;

    if (value === NULL_VALUE) {
      onChange(null);
    } else {
      onChange(event);
    }
  };

  return (
    <SSSelect
      {...input}
      id={toArray(field.name).join(",")}
      value={inputValue}
      icon={field.icon}
      onChange={handleChange}
      controlSize="full-width"
    >
      {normalizedSelectOptions ? (
        normalizedSelectOptions.map(toComponent)
      ) : (
        <option>{inputValue}</option>
      )}
    </SSSelect>
  );
};

function toProps(option: Option | string): Option {
  if (typeof option === "object") return option;
  return { value: option, label: option };
}

function toComponent(option: Option) {
  if ("isDivider" in option) {
    return (
      <option disabled key="divider" aria-hidden="true">
        ----------
      </option>
    );
  }

  return (
    <option
      key={option.value}
      value={option.value}
      disabled={option.value === MIXED_VALUE}
    >
      {option.label}
    </option>
  );
}
