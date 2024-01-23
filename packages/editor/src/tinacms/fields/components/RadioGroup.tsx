import { Option } from "@easyblocks/core";
import { InternalField } from "@easyblocks/core/_internals";
import { Icons, SelectInline, ToggleButton } from "@easyblocks/design-system";
import React from "react";
import { FieldMixedValue } from "../../../types";
import { FieldRenderProps } from "../../form-builder";
import { isMixedFieldValue } from "./isMixedFieldValue";

interface RadioGroupFieldProps extends InternalField {
  options: Option[];
  direction?: "horizontal" | "vertical";
  variant?: "radio" | "button";
}

export interface RadioGroupProps
  extends FieldRenderProps<string | FieldMixedValue> {
  name: string;
  field: RadioGroupFieldProps;
  disabled?: boolean;
  options?: (Option | string)[];
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  input,
  field,
  options,
}) => {
  const { value } = input;
  const radioOptions = options || field.options;
  const toggleButtonValue = isMixedFieldValue(value) ? undefined : value;

  const toProps = (option: Option | string): Exclude<Option, string> => {
    if (typeof option === "object") return option;
    return { value: option, label: option };
  };

  const radioOptionsMapped = radioOptions ? radioOptions.map(toProps) : [];

  return (
    radioOptionsMapped && (
      <SelectInline {...input} value={toggleButtonValue}>
        {radioOptionsMapped.map((option) => {
          let Icon: Exclude<Exclude<Option, string>["icon"], string> =
            undefined;

          if (typeof option.icon === "string" && option.icon in Icons) {
            Icon = Icons[option.icon as keyof typeof Icons];
          }

          if (typeof option.icon === "function") {
            Icon = option.icon;
          }

          return (
            <ToggleButton
              key={option.value}
              icon={Icon}
              value={option.value}
              hideLabel={option.hideLabel}
            >
              {option.label ?? option.value}
            </ToggleButton>
          );
        })}
      </SelectInline>
    )
  );
};
