import { InternalField } from "@easyblocks/core/_internals";
import { Select, SelectItem, SelectSeparator } from "@easyblocks/design-system";
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
}

export interface SelectFieldComponentProps
  extends FieldRenderProps<string | FieldMixedValue> {
  name: Array<string> | string;
  field: SelectFieldProps;
  disabled?: boolean;
  options?: (Option | string)[];
}

export const SelectFieldComponent: React.FC<SelectFieldComponentProps> = ({
  input,
  field,
  options,
}) => {
  const { value, onChange } = input;
  const isMixedValue = isMixedFieldValue(value);

  const selectOptions = options || field.options;
  const normalizedSelectOptions = selectOptions.map(toProps);

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

  const inputValue = isMixedValue ? MIXED_VALUE : value;

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <Select value={inputValue} onChange={handleChange}>
      {normalizedSelectOptions.map(toComponent)}
    </Select>
  );
};

function toProps(option: Option | string): Option {
  if (typeof option === "object") return option;
  return { value: option, label: option };
}

function toComponent(option: Option) {
  if ("isDivider" in option) {
    return <SelectSeparator key="divider" />;
  }

  return (
    <SelectItem
      key={option.value}
      value={option.value}
      isDisabled={option.value === MIXED_VALUE}
    >
      {option.label}
    </SelectItem>
  );
}
