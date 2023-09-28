import React, { ReactNode } from "react";
import * as RadixToggleGroup from "@radix-ui/react-toggle-group";
import { SSColors } from "../colors";

function ToggleGroup(props: {
  children: ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <RadixToggleGroup.Root
      type="single"
      value={props.value}
      onValueChange={props.onChange}
      css={`
        display: flex;
        gap: 4px;
        flex-wrap: nowrap;
      `}
    >
      {props.children}
    </RadixToggleGroup.Root>
  );
}

function ToggleGroupItem(props: { value: string; children: ReactNode }) {
  return (
    <RadixToggleGroup.Item
      value={props.value}
      css={`
        all: unset;
        box-sizing: border-box;
        height: 28px;
        width: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;

        &[data-state="on"] {
          background-color: ${SSColors.black10};
        }

        border-radius: 2px;

        @media (hover: hover) {
          cursor: pointer;

          &:hover {
            box-shadow: 0 0 0 1px ${SSColors.black10};
          }
        }

        & svg {
          flex-shrink: 0;
        }
      `}
    >
      {props.children}
    </RadixToggleGroup.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
