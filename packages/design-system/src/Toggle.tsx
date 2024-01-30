import React, { ChangeEvent, InputHTMLAttributes, useState } from "react";
import styled from "styled-components";
import { Colors } from "./colors";

export type ToggleProps = InputHTMLAttributes<HTMLInputElement>;

export const Toggle: React.FC<ToggleProps> = (props) => {
  const [internalChecked, setInternalChecked] = useState<boolean>(
    props.checked ?? false
  );
  const checked = props.checked === undefined ? internalChecked : props.checked;

  const { ...inputProps } = props;
  const name = inputProps.name;

  return (
    <ToggleWrap>
      <ToggleElement>
        <ToggleInput
          id={name}
          type="checkbox"
          {...inputProps}
          checked={checked}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setInternalChecked(e.target.checked);
            props.onChange?.(e);
          }}
        />
        <ToggleLabel htmlFor={name} role="switch" disabled={!!props.disabled}>
          <ToggleSwitch checked={checked} disabled={!!props.disabled}>
            <span></span>
          </ToggleSwitch>
        </ToggleLabel>
      </ToggleElement>
    </ToggleWrap>
  );
};

const ToggleWrap = styled.div`
  display: flex;
  align-items: center;

  > span {
    color: ${Colors.black10};
  }
`;

const ToggleElement = styled.div<{ hasToggleLabels?: boolean }>`
  position: relative;
  width: 32px;
  height: 18px;
  padding: 1px;
`;

const ToggleLabel = styled.label<{
  disabled?: boolean;
}>`
  background: none;
  color: inherit;
  padding: 0;
  opacity: ${(props) => (props.disabled ? "0.4" : "1")};
  outline: none;
  width: 30px;
  height: 16px;
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};
`;

const ToggleSwitch = styled.div<{ checked: boolean; disabled: boolean }>`
  position: relative;
  width: 30px;
  height: 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 0 1px
    ${(p) => (!p.checked || p.disabled ? Colors.black40 : "black")};

  transition: all 0.1s;
  pointer-events: none;
  span {
    position: absolute;
    border-radius: 8px;
    left: 2px;
    top: 50%;
    width: 10px;
    height: 10px;
    background: ${(p) => (!p.checked || p.disabled ? Colors.black40 : "black")};
    transform: translate3d(${(p) => (p.checked ? "16px" : "0")}, -50%, 0);
    transition: transform 150ms ease-out, opacity 0.1s;
  }
`;

const ToggleInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  width: 30px;
  height: 16px;
  opacity: 0;
  margin: 0;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  pointer-events: auto;

  /*
  &:focus {
    + ${ToggleLabel} ${ToggleSwitch} {
      box-shadow: 0 0 0 2px ${Colors.blue50};
    }
  }
  */

  ${(p) =>
    p.disabled
      ? ""
      : `
  &:hover {
    + ${ToggleLabel} ${ToggleSwitch} {
      box-shadow: 0 0 0 1px black;
    }
    
    + ${ToggleLabel} ${ToggleSwitch} span {
      background-color: black;
    }
  }
  `}
`;
