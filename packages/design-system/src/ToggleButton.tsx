import React, { ReactNode } from "react";
import styled from "styled-components";
import { Colors } from "./colors";
import {
  ControlContainer,
  ControlProps,
  getControlPadding,
} from "./ControlContainer";

/**
 * TODO: this toggle button doesn't make much sense from semantic perspective
 */

export type ToggleButtonProps = ControlProps & {
  value?: string;
  selected?: boolean;
  hideLabel?: boolean;
  onChange?: (val: boolean) => void;
};

const StyledButton = styled.button<ToggleButtonProps>`
  all: unset;
  box-sizing: border-box;

  width: 100%;
  height: 100%;

  outline: none;
  border: none;
  ${getControlPadding()}
  ${(p) => (p.hideLabel ? "padding-right: 0;" : "")}
  
  border-radius: 2px;
  background-color: ${(p) => (p.selected ? Colors.black10 : "transparent")};
`;

export const ToggleButton = (
  props: ToggleButtonProps & {
    children: string /* children must be a string */;
  }
) => {
  const { onChange, ...restProps } = props;

  return (
    <ControlContainer {...props} iconBlack={true} iconOnly={props.hideLabel}>
      <StyledButton
        {...restProps}
        aria-label={props.children}
        onClick={() => {
          props.onChange?.(!props.selected);
        }}
      >
        {props.hideLabel ? null : props.children}
      </StyledButton>
    </ControlContainer>
  );
};

export type SelectInlineProps = {
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

export const SelectInline: React.FC<SelectInlineProps> = (props) => {
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
