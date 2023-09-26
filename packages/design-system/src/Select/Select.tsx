import * as RadixSelect from "@radix-ui/react-select";
import React, { forwardRef, ReactNode } from "react";
import styled from "styled-components";
import { SSColors } from "../colors";
import { SSFonts } from "../fonts";
import { SSIcons } from "../icons";

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
}) {
  return (
    <RadixSelect.Root value={props.value} onValueChange={props.onChange}>
      <SelectTrigger
        css={`
          min-height: 28px;
        `}
      >
        <RadixSelect.Value placeholder="Select a value" />
        <RadixSelect.Icon>
          <SSIcons.ChevronDown />
        </RadixSelect.Icon>
      </SelectTrigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          css={`
            padding: 8px 0;
            background: #fff;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
              0 4px 6px -4px rgb(0 0 0 / 0.1);
          `}
        >
          <RadixSelect.Viewport>{props.children}</RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

const SelectItemWrapper = styled(RadixSelect.Item)`
  box-sizing: border-box;
  min-height: 28px;
  padding: 8px;

  ${SSFonts.body};

  background: #fff;
  outline: none;

  &[data-state="checked"] {
    background: ${SSColors.blue20};
  }

  &[data-highlighted] {
    background: #e2e2e2;
  }

  &[data-highlighted][data-state="checked"] {
    background: #dee6ee;
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
      <RadixSelect.ItemText>{props.children}</RadixSelect.ItemText>
    </SelectItemWrapper>
  );
});

const SelectSeparator = styled(RadixSelect.Separator)`
  height: 1px;
  background: ${SSColors.black20};
`;

export { Select, SelectItem, SelectSeparator };
