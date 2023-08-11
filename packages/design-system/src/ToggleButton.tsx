import React, { ReactNode } from "react";
import styled from "styled-components";
import { SSColors } from "./colors";
import {
  ControlContainer,
  ControlProps,
  getControlPadding,
} from "./ControlContainer";

/**
 * TODO: this toggle button doesn't make much sense from semantic perspective
 */

export type SSToggleButtonProps = ControlProps & {
  value?: string;
  selected?: boolean;
  hideLabel?: boolean;
  onChange?: (val: boolean) => void;
};

const StyledButton = styled.button<SSToggleButtonProps>`
  all: unset;
  box-sizing: border-box;

  width: 100%;
  height: 100%;

  outline: none;
  border: none;
  ${getControlPadding()}
  ${(p) => (p.hideLabel ? "padding-right: 0;" : "")}
  
  border-radius: 2px;
  background-color: ${(p) => (p.selected ? SSColors.black10 : "transparent")};
`;

export const SSToggleButton = (
  props: SSToggleButtonProps & {
    children: string /* children must be a string */;
  }
) => {
  const { onChange, ...restProps } = props;

  return (
    <ControlContainer {...props} iconBlack={true} iconOnly={props.hideLabel}>
      <StyledButton
        {...restProps}
        aria-label={props.children}
        onClick={(e) => {
          props.onChange?.(!props.selected);
        }}
      >
        {props.hideLabel ? null : props.children}
      </StyledButton>
    </ControlContainer>
  );
};

export type SSSelectInlineProps = {
  children: ReactNode;
  value: string | null | undefined;
  onChange: (value: string) => void;
};

const SelectInlineRoot = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  flex-wrap: nowrap;
`;

export const SSSelectInline: React.FC<SSSelectInlineProps> = (props) => {
  const buttons = React.Children.toArray(
    props.children
  ) as React.ReactElement[];

  return (
    <SelectInlineRoot>
      {buttons.map((button) => {
        return React.cloneElement(button, {
          selected: button.props.value === props.value,
          onChange: () => {
            props.onChange(button.props.value);
          },
        });
      })}
    </SelectInlineRoot>
  );
};
