import React from "react";
import styled from "styled-components";
import { SSColors } from "./colors";
import { SSIcons } from "./icons";

import {
  ControlContainer,
  getControlPadding,
  ControlProps,
} from "./ControlContainer";

export type SSSelectProps = React.InputHTMLAttributes<HTMLSelectElement> &
  ControlProps;

const ArrowIconContainer = styled.div`
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${SSColors.black40};
`;

const StyledSelect = styled.select<SSSelectProps>`
  all: unset;
  box-sizing: border-box;
  display: block;
  appearance: none;
  border: none;
  ${getControlPadding()}
  padding-right: 20px;
  height: 100%;
  width: 100%;
  text-align: right;
  line-height: 28px;
  select:-moz-focusring,
  select::-moz-focus-inner {
    color: transparent;
    text-shadow: 0 0 0 #000;
  }
`;

export const SSSelect: React.FC<SSSelectProps> = ({
  onChange,
  id,
  className,
  ...restProps
}) => {
  return (
    <ControlContainer className={className} {...restProps}>
      <StyledSelect {...restProps} id={id} onChange={onChange} />
      <ArrowIconContainer className={"ss-arrow"}>
        <SSIcons.Dropdown />
      </ArrowIconContainer>
    </ControlContainer>
  );
};
