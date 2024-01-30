import React, { forwardRef } from "react";
import styled from "styled-components";
import { Fonts } from "./fonts";

import {
  ControlContainer,
  getControlPadding,
  ControlProps,
} from "./ControlContainer";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  ControlProps & {
    placeholder?: string;
    type?: string;
    debounce?: boolean;
    align?: "left" | "right";
  };

const StyledInput = styled.input<InputProps & { isRaw?: boolean }>`
  all: unset;
  box-sizing: border-box;

  width: 100%;
  height: 100%;

  outline: none;
  border: none;

  ::-webkit-search-decoration,
  ::-webkit-search-cancel-button,
  ::-webkit-search-results-button,
  ::-webkit-search-results-decoration {
    display: none;
  }

  ${(p) => !p.isRaw && getControlPadding()}

  ${Fonts.body};

  text-align: ${(p) => (p.align === "right" ? "right" : "left")};
`;

const InputBase = forwardRef<
  HTMLInputElement,
  InputProps & { isRaw?: boolean }
>((props, ref) => {
  return <StyledInput {...props} ref={ref} />;
});

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { iconBlack, controlSize, iconOnly, onBlur, value, ...inputProps } =
    props;

  return (
    <ControlContainer
      iconBlack={iconBlack}
      controlSize={controlSize}
      iconOnly={iconOnly}
      {...inputProps}
    >
      <InputBase {...inputProps} value={value} onBlur={onBlur} ref={ref} />
    </ControlContainer>
  );
});

export const InputRaw = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <InputBase {...props} ref={ref} isRaw={true} />;
  }
);
