import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { SSColors } from "./colors";
import { SSFonts } from "./fonts";
import { SSIcon } from "./icons";

export type ControlProps = {
  icon?: SSIcon;
  iconBlack?: boolean;
  controlSize?: any;
  iconOnly?: boolean;
  error?: boolean;
  withBorder?: boolean;
  hasError?: boolean;
  disabled?: boolean;
};

function sizing(p: ControlProps) {
  const height = p.controlSize === "tiny" ? 24 : 28;
  const paddingHorizontal = p.controlSize === "tiny" ? 4 : 6;
  let paddingIcon = paddingHorizontal + (p.icon ? 20 : 0);

  if (p.iconOnly) {
    paddingIcon = 0;
  }

  return {
    height: height + "px",
    width:
      p.controlSize === "full-width"
        ? "100%"
        : p.iconOnly
        ? height + "px"
        : "auto",
    paddingHorizontal: paddingHorizontal + "px",
    paddingVertical: p.controlSize === "tiny" ? "4px" : "6px",
    paddingIcon: paddingIcon + "px",
  };
}

const Root = styled.div<ControlProps>`
  position: relative;
  height: ${(p) => sizing(p).height};
  width: ${(p) => sizing(p).width};
  color: black;

  ${(p) => {
    const outlineStyles = `
      box-shadow: 0 0 0 1px ${p.hasError ? "red" : SSColors.black10};
      .ss-arrow {
        color: black;
      }
    `;

    if (p.withBorder) {
      if (p.disabled) {
        return `
          ${outlineStyles}
          color: ${SSColors.black40};
        `;
      } else {
        return `
          ${outlineStyles}
        `;
      }
    } else {
      if (p.disabled) {
        return `
          color: ${SSColors.black40};
        `;
      } else {
        return `
          &:hover {
             ${outlineStyles}
          }
        `;
      }
    }
  }}

  &:focus-within {
    box-shadow: 0 0 0 2px ${(p) => (p.hasError ? SSColors.red : SSColors.focus)};
    .ss-arrow {
      color: black;
    }
  }

  transition: box-shadow 0.1s;
  border-radius: 2px;
  display: inline-block;

  ${SSFonts.body};
`;

const IconContainer = styled.div<ControlProps>`
  color: ${(p) => (p.iconBlack ? "black" : SSColors.black40)};
  position: absolute;
  left: ${(p) => sizing(p).paddingHorizontal};
  top: ${(p) => sizing(p).paddingVertical};
  pointer-events: none;
`;

export const ControlContainer: React.FC<
  ControlProps & { children: ReactNode }
> = (props) => {
  const Icon = props.icon;

  return (
    <Root {...props}>
      {Icon && (
        <IconContainer {...props}>
          <Icon />
        </IconContainer>
      )}
      {props.children}
    </Root>
  );
};

export function getControlPadding() {
  return css<ControlProps>`
    padding-left: ${(p) => sizing(p).paddingIcon};
    padding-right: ${(p) => sizing(p).paddingHorizontal};
  `;
}
