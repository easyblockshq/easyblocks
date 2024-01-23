import { Fonts } from "@easyblocks/design-system";
import React, { CSSProperties, forwardRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

interface TooltipProps {
  children: ReactNode;
  style?: CSSProperties;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, style = {}, ...rest }, ref) => {
    return createPortal(
      <div style={{ ...style, zIndex: 100100 }} ref={ref} {...rest}>
        {children}
      </div>,
      document.body
    );
  }
);

export { Tooltip, TooltipBody, TooltipArrow };

const TooltipBody = styled.div`
  position: relative;
  top: 6px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 6px 4px;

  background: #333333;
  border-radius: 2px;

  ${Fonts.body}
  color: #fff;
`;

const TooltipArrow = styled.div`
  width: 12px;
  height: 6px;
  margin: 0 auto;

  background: #333333;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
`;
