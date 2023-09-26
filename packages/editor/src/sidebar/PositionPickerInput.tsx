import {
  Position,
  PositionHorizontal,
  PositionVertical,
} from "@easyblocks/core";
import { SSColors } from "@easyblocks/design-system";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import React from "react";
import styled from "styled-components";

const positions: ReadonlyArray<{ label: string; value: Position }> = [
  { label: "Top Left", value: "top-left" },
  { label: "Top Center", value: "top-center" },
  { label: "Top Right", value: "top-right" },
  { label: "Center Left", value: "center-left" },
  { label: "Center Center", value: "center-center" },
  { label: "Center Right", value: "center-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Center", value: "bottom-center" },
  { label: "Bottom Right", value: "bottom-right" },
];

function horizontalPositionToFlexJustifyContentValue(
  position: "left" | "center" | "right"
) {
  switch (position) {
    case "left":
      return "flex-start";
    case "center":
      return "center";
    case "right":
      return "flex-end";
  }
}

function verticalPositionToFlexAlignItemsValue(
  position: "top" | "center" | "bottom"
) {
  switch (position) {
    case "top":
      return "flex-start";
    case "center":
      return "center";
    case "bottom":
      return "flex-end";
  }
}
function PositionPickerInput({
  position,
  onPositionChange,
}: {
  position: Position;
  onPositionChange: (position: Position) => void;
}) {
  return (
    <RadixRadioGroup.Root
      value={position}
      onValueChange={(newPosition) => {
        onPositionChange(newPosition as Position);
      }}
      css={`
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(3, 1fr);
        gap: 0;
        border-radius: 2px;
        border: 1px solid ${SSColors.black10};
      `}
    >
      {positions.map((p) => {
        const [vertical, horizontal] = p.value.split("-") as [
          PositionVertical,
          PositionHorizontal
        ];

        return (
          <RadixRadioGroup.Item
            value={p.value}
            key={p.value}
            aria-label={p.label}
            css={`
              all: unset;
              position: relative;
              display: flex;
              justify-content: ${horizontalPositionToFlexJustifyContentValue(
                horizontal
              )};
              align-items: ${verticalPositionToFlexAlignItemsValue(vertical)};
              box-sizing: border-box;
              width: 20px;
              height: 20px;
              padding: 8px;

              &:hover > div {
                opacity: ${p.value === position ? 1 : 0.5}};
              }
            `}
          >
            <div
              css={`
                width: 2px;
                height: 2px;
                background-color: #d9d9d9;
              `}
            ></div>
            <div
              css={`
                position: absolute;
                top: 2px;
                left: 2px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: ${horizontalPositionToFlexJustifyContentValue(
                  horizontal
                )};
                gap: 2px;
                width: 16px;
                height: 16px;
                opacity: ${p.value === position ? 1 : 0};
              `}
            >
              <PositionIndicator
                $size={vertical === "top" ? "full" : "normal"}
              />
              <PositionIndicator
                $size={vertical === "center" ? "full" : "normal"}
              />
              <PositionIndicator
                $size={vertical === "bottom" ? "full" : "normal"}
              />
            </div>
          </RadixRadioGroup.Item>
        );
      })}
    </RadixRadioGroup.Root>
  );
}

export { PositionPickerInput };
export type { Position };

const PositionIndicator = styled.div<{ $size?: "normal" | "full" }>`
  width: ${(p) => (p.$size === "full" ? "100%" : "75%")};
  height: 4px;
  background-color: #202123;
`;

// {/* <div
//   css={`
//     position: absolute;
//     top: 0;
//     bottom: ${vertical === "bottom" ? "0" : "auto"};
//     /* display: flex;
//     flex-direction: column;
//     gap: 1px; */
//     width: 12px;
//     height: 20px;

//     opacity: ${p.value === position ? 1 : 0}};
//     transform: translateY(${vertical === "center" ? "-50%" : "0"});
//   `}
// >
//   <PositionIndicator />
//   <PositionIndicator $size="full" />
//   <PositionIndicator />
// </div> */}
