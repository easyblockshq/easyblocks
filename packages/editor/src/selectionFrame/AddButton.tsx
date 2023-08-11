import React from "react";
import styled, { css } from "styled-components";
import { IconButton, ICON_BUTTON_SIZE } from "../tinacms/styles";
import { AddIcon } from "../tinacms/icons";
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
        <AddIcon />
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
