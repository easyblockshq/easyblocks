import React from "react";
import styled, { css } from "styled-components";
import { IconButton, ICON_BUTTON_SIZE } from "../tinacms/styles";
import {
  AFTER_ADD_BUTTON_DISPLAY,
  AFTER_ADD_BUTTON_LEFT,
  AFTER_ADD_BUTTON_TOP,
  BEFORE_ADD_BUTTON_DISPLAY,
  BEFORE_ADD_BUTTON_LEFT,
  BEFORE_ADD_BUTTON_TOP,
} from "./cssVariables";

export interface AddBlockMenuProps {
  position: "before" | "after";
  index?: number;
  offset?: number | { x: number; y: number };
  onClick?: () => void;
}

function AddButton({ position, index, offset, onClick }: AddBlockMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const addBlockButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleOpenBlockMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    // Custom add action
    if (onClick) {
      onClick();
      return;
    }
  };

  React.useEffect(() => {
    const inactivateBlockMenu = () => setIsOpen(false);
    document.addEventListener("mouseup", inactivateBlockMenu, false);
    return () => document.removeEventListener("mouseup", inactivateBlockMenu);
  }, []);

  return (
    <AddButtonWrapper
      index={index}
      offset={offset}
      position={position}
      isOpen={isOpen}
    >
      <AddIconButton
        ref={addBlockButtonRef}
        onClick={handleOpenBlockMenu}
        isOpen={isOpen}
        primary
        small
      >
        {/*<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">*/}
        {/*  <line x1="8.5" y1="2.18552e-08" x2="8.5" y2="17" stroke="currentColor"/>*/}
        {/*  <line y1="8.5" x2="17" y2="8.5" stroke="currentColor"/>*/}
        {/*</svg>*/}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="23"
          viewBox="0 0 23 23"
          fill="none"
        >
          <line x1="11.5" y1="4" x2="11.5" y2="19" stroke="currentColor" />
          <line x1="4" y1="11.5" x2="19" y2="11.5" stroke="currentColor" />
        </svg>

        {/*<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>*/}
      </AddIconButton>
    </AddButtonWrapper>
  );
}

export { AddButton, ICON_BUTTON_SIZE as ADD_BUTTON_SIZE };

interface AddMenuProps {
  isOpen?: boolean;
  active?: boolean;
  openTop?: boolean;
}

export const AddIconButton = styled(IconButton)<AddMenuProps>`
  display: flex;
  align-items: center;

  &:focus {
    outline: none !important;
  }

  ${(props) =>
    props.isOpen &&
    css`
      pointer-events: none;
    `};
`;

interface AddButtonWrapperProps {
  index?: number;
  offset?: number | { x: number; y: number };
  position: "before" | "after";
  isOpen: boolean;
}

const AddButtonWrapper = styled.div<AddButtonWrapperProps>`
  position: absolute;
  top: var(
    ${({ position }) =>
      position === "before" ? BEFORE_ADD_BUTTON_TOP : AFTER_ADD_BUTTON_TOP}
  );
  left: var(
    ${({ position }) =>
      position === "before" ? BEFORE_ADD_BUTTON_LEFT : AFTER_ADD_BUTTON_LEFT}
  );

  display: var(
    ${({ position }) =>
      position === "before"
        ? BEFORE_ADD_BUTTON_DISPLAY
        : AFTER_ADD_BUTTON_DISPLAY},
    none
  );
  pointer-events: all;
`;
