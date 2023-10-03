import * as RadixTooltip from "@radix-ui/react-tooltip";
import React, { ReactNode } from "react";
import { SSColors } from "../colors";

function Tooltip(props: { children: ReactNode }) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>{props.children}</RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
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
          background: ${SSColors.black800};

          color: ${SSColors.white};
        `}
      >
        <RadixTooltip.Arrow
          css={`
            fill: ${SSColors.black800};
          `}
        />
        {props.children}
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };
