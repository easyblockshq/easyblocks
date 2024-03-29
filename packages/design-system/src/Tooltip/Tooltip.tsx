import * as RadixTooltip from "@radix-ui/react-tooltip";
import React, { ReactNode } from "react";
import { Colors } from "../colors";

function TooltipProvider(props: { children: ReactNode }) {
  return <RadixTooltip.Provider>{props.children}</RadixTooltip.Provider>;
}

function Tooltip(props: { children: ReactNode }) {
  return <RadixTooltip.Root>{props.children}</RadixTooltip.Root>;
}

function TooltipTrigger(props: { children: ReactNode }) {
  return <RadixTooltip.Trigger asChild>{props.children}</RadixTooltip.Trigger>;
}

function TooltipContent(props: { children: ReactNode }) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        css={`
          display: flex;
          padding: 6px 4px;
          justify-content: center;
          align-items: center;

          border-radius: 2px;
          background: ${Colors.black800};

          color: ${Colors.white};
        `}
      >
        <RadixTooltip.Arrow
          css={`
            fill: ${Colors.black800};
          `}
        />
        {props.children}
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  );
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
