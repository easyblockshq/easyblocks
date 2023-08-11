import React, { forwardRef } from "react";
import styled from "styled-components";
import { SSFonts } from "./fonts";

import {
  ControlContainer,
  getControlPadding,
  ControlProps,
} from "./ControlContainer";

export type SSInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  ControlProps & {
    placeholder?: string;
    type?: string;
    debounce?: boolean;
    align?: "left" | "right";
  };

const StyledInput = styled.input<SSInputProps & { isRaw?: boolean }>`
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

  ${SSFonts.body};

  text-align: ${(p) => (p.align === "right" ? "right" : "left")};
`;

const InputBase = forwardRef<
  HTMLInputElement,
  SSInputProps & { isRaw?: boolean }
>((props, ref) => {
  return <StyledInput {...props} ref={ref} />;
});

export const SSInput = forwardRef<HTMLInputElement, SSInputProps>(
  (props, ref) => {
    const { iconBlack, controlSize, iconOnly, ...inputProps } = props;

    return (
      <ControlContainer
        iconBlack={iconBlack}
        controlSize={controlSize}
        iconOnly={iconOnly}
        {...inputProps}
      >
        <InputBase {...inputProps} ref={ref} />
      </ControlContainer>
    );
  }
);

export const SSInputRaw = forwardRef<HTMLInputElement, SSInputProps>(
  (props, ref) => {
    return <InputBase {...props} ref={ref} isRaw={true} />;
  }
);
