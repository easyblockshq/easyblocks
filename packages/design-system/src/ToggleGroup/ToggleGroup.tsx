import React, { forwardRef, ReactNode, memo } from "react";
import * as RadixToggleGroup from "@radix-ui/react-toggle-group";

import { Colors } from "../colors";

interface ToggleGroupProps {
  children: ReactNode;
  value: string;
  onChange: (value: string) => void;
}

const ToggleGroup = memo<ToggleGroupProps>(
  ({ value, children, onChange }): JSX.Element => {
    return (
      <RadixToggleGroup.Root
        type="single"
        value={value}
        onValueChange={onChange}
        css={`
          display: flex;
          gap: 4px;
          flex-wrap: nowrap;
        `}
      >
        {children}
      </RadixToggleGroup.Root>
    );
  }
);

interface ToggleGroupItemProps {
  value: string;
  children: ReactNode;
}

const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  function ToggleGroupItem({ value, children, ...props }, forwardedRef) {
    return (
      <RadixToggleGroup.Item
        value={value}
        css={`
          all: unset;
          box-sizing: border-box;
          height: 28px;
          width: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;

          &[aria-checked="true"] {
            background-color: ${Colors.black10};
          }

          border-radius: 2px;

          @media (hover: hover) {
            cursor: pointer;

            &:hover {
              box-shadow: 0 0 0 1px ${Colors.black10};
            }
          }

          & svg {
            flex-shrink: 0;
          }
        `}
        ref={forwardedRef}
        {...props}
      >
        {children}
      </RadixToggleGroup.Item>
    );
  }
);

export { ToggleGroup, ToggleGroupItem };
