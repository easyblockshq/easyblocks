import styled, { css } from "styled-components";

interface ButtonProps {
  primary?: boolean;
  small?: boolean;
  margin?: boolean;
  grow?: boolean;
  open?: boolean;
  busy?: boolean;
  disabled?: boolean;
}

const Button = styled.button<ButtonProps>`
  text-align: center;
  border: 0;
  border-radius: var(--tina-radius-big);
  box-shadow: var(--tina-shadow-small);
  background-color: var(--tina-color-grey-0);
  border: 1px solid var(--tina-color-grey-2);
  color: var(--tina-color-primary);
  fill: var(--tina-color-primary);
  font-weight: var(--tina-font-weight-regular);
  cursor: pointer;
  font-size: var(--tina-font-size-1);
  height: 40px;
  padding: 0 var(--tina-padding-big);
  transition: all 85ms ease-out;

  &:hover {
    background-color: var(--tina-color-grey-1);
  }
  &:active {
    background-color: var(--tina-color-grey-2);
    outline: none;
  }

  ${(p) =>
    p.disabled &&
    css`
      opacity: 0.3;
      pointer: not-allowed;
      pointer-events: none;
    `};

  ${(p) =>
    p.primary &&
    css`
      background-color: var(--tina-color-primary);
      color: var(--tina-color-grey-0);
      fill: var(--tina-color-grey-0);
      border: none;
      &:hover {
        background-color: var(--tina-color-primary-light);
      }
      &:active {
        background-color: var(--tina-color-primary-dark);
      }
    `};

  ${(p) =>
    p.small &&
    css`
      height: 32px;
      font-size: var(--tina-font-size-0);
      padding: 0 var(--tina-padding-big);
    `};

  ${(p) =>
    p.margin &&
    css`
      &:not(:first-child) {
        margin-left: 8px;
      }
    `};

  ${(p) =>
    p.grow &&
    css`
      flex-grow: 1;
    `};

  ${(p) =>
    p.busy &&
    css`
      cursor: wait;
    `};
`;

export const ICON_BUTTON_SIZE = 23;
const ICON_SIZE = 23;

export const IconButton = styled(Button)`
  padding: 0;
  width: ${ICON_BUTTON_SIZE}px;
  height: ${ICON_BUTTON_SIZE}px;
  margin: 0;
  position: relative;
  transform-origin: 50% 50%;
  transition: all 150ms ease-out;
  padding: 0;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;

  svg {
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
    transition: all 150ms ease-out;
  }

  ${(props) =>
    props.open &&
    css`
      background-color: var(--tina-color-grey-0);
      border-color: var(--tina-color-grey-2);
      outline: none;
      fill: var(--tina-color-primary);
      svg {
        transform: rotate(45deg);
      }
      &:hover {
        background-color: var(--tina-color-grey-1);
      }
      &:active {
        background-color: var(--tina-color-grey-2);
      }
    `};
`;
