import React from "react";
import Select, { ClearIndicatorProps } from "react-select";
import { Fonts } from "./fonts";
import { Colors } from "./colors";
import { Icons } from "./icons";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

function DropdownIndicator() {
  return (
    <div style={{ padding: "0px 3px" }}>
      <Icons.ChevronDown size={16} />
    </div>
  );
}

function ClearIndicator(props: ClearIndicatorProps) {
  return (
    <div {...props.innerProps} style={{ padding: "0px 6px" }}>
      <Icons.Close size={12} />
    </div>
  );
}

// export type MutliSelectProps = {
//   value: string,
//   options:
// }

export function MultiSelect() {
  return (
    <Select
      options={options}
      isMulti={true}
      styles={{
        // @ts-ignore
        container: (baseStyles, state) => ({
          ...baseStyles,
          ...Fonts.body,
        }),
        // @ts-ignore
        control: (baseStyles, state) => {
          return {
            ...baseStyles,
            borderWidth: 0,
            borderRadius: 2,
            boxShadow: state.isFocused
              ? `0 0 0 2px ${Colors.focus}`
              : `0 0 0 1px ${Colors.black10}`,
            "&:hover": {
              borderColor: Colors.black20,
            },
            minHeight: 28,
          };
        },
        // @ts-ignore
        clearIndicator: (baseStyles) => {
          {
            return {
              ...baseStyles,
              padding: 4,
            };
          }
        },
        // @ts-ignore
        dropdownIndicator: (baseStyles) => {
          console.log("dropdown", baseStyles);

          return {
            ...baseStyles,
            padding: 4,
          };
        },
        // @ts-ignore
        valueContainer: (baseStyles) => {
          {
            return {
              ...baseStyles,
              padding: "2px 6px",
            };
          }
        },
      }}
      components={{
        DropdownIndicator,
        // @ts-ignore
        ClearIndicator,
      }}
    />
  );
}
