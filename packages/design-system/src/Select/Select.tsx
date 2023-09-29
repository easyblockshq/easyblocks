import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as RadixSelect from "@radix-ui/react-select";
import React, { forwardRef, ReactNode } from "react";
import styled from "styled-components";
import { SSColors } from "../colors";
import { SSFonts } from "../fonts";

const SelectTrigger = styled(RadixSelect.Trigger)`
  all: unset;

  display: flex;
  align-items: center;

  ${SSFonts.body};
`;

function Select(props: {
  children: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <RadixSelect.Root value={props.value} onValueChange={props.onChange}>
      <SelectTrigger
        css={`
          display: flex;
          gap: 4px;

          box-sizing: border-box;
          height: 28px;
          padding: 0 2px 0 6px;
          border-radius: 2px;

          @media (hover: hover) {
            &:hover {
              box-shadow: 0 0 0 1px ${SSColors.black10};
            }
          }
        `}
      >
        <RadixSelect.Value
          placeholder={props.placeholder ?? "Select a value..."}
        />
        <RadixSelect.Icon>
          <ChevronDownIcon color={SSColors.black40} />
        </RadixSelect.Icon>
      </SelectTrigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          css={`
            min-width: 100px;
            max-height: 600px;
            padding: 4px 0;

            background: #fff;
            border: 1px solid ${SSColors.black10};
          `}
        >
          <RadixSelect.ScrollUpButton
            css={`
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <ChevronUpIcon />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport>{props.children}</RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton
            css={`
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <ChevronDownIcon />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

const SelectItemWrapper = styled(RadixSelect.Item)`
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  min-height: 28px;
  padding: 0 6px;

  ${SSFonts.body};
  color: #000;

  background: #fff;
  outline: none;

  &[data-state="unchecked"] {
    // If item is unchecked, we have to move to the right to recompense space of the missing checkmark icon
    padding-left: calc(6px + 15px + 6px);
  }

  &[data-highlighted] {
    background: #daeafd;
  }

  @media (hover: hover) {
    cursor: pointer;
  }
`;

const SelectItem = forwardRef<
  HTMLDivElement,
  { children: ReactNode; value: string; isDisabled?: boolean }
>((props, ref) => {
  return (
    <SelectItemWrapper
      value={props.value}
      disabled={props.isDisabled ?? false}
      ref={ref}
    >
      <RadixSelect.ItemIndicator>
        <CheckIcon color="#202123" />
      </RadixSelect.ItemIndicator>
      <RadixSelect.ItemText>{props.children}</RadixSelect.ItemText>
    </SelectItemWrapper>
  );
});

function SelectSeparator() {
  return (
    <RadixSelect.Separator
      css={`
        height: 1px;
        margin: 4px;

        background: ${SSColors.black100};
      `}
    />
  );
}

export { Select, SelectItem, SelectSeparator };
