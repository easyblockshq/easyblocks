import styled, { css } from "styled-components";

export interface InputProps {
  error?: boolean;
  small?: boolean;
  placeholder?: string;
  step?: string | number;
}

const InputCss = css<InputProps>`
  box-sizing: border-box;
  padding: var(--tina-padding-small);
  border-radius: var(--tina-radius-small);
  background: var(--tina-color-grey-0);
  font-size: var(--tina-font-size-2);
  line-height: 1.35;
  position: relative;
  color: var(--tina-color-grey-10);
  background-color: var(--tina-color-grey-0);
  transition: all 85ms ease-out;
  border: 1px solid var(--tina-color-grey-2);
  width: 100%;
  margin: 0;
  outline: none;
  box-shadow: 0 0 0 2px
    ${(p) => (p.error ? "var(--tina-color-error)" : "transparent")};

  &:hover {
    box-shadow: 0 0 0 2px var(--tina-color-grey-3);
  }

  &:focus {
    box-shadow: 0 0 0 2px
      ${(p) =>
        p.error ? "var(--tina-color-error)" : "var(--tina-color-primary)"};
  }

  &::placeholder {
    font-size: var(--tina-font-size-2);
    color: var(--tina-color-grey-3);
  }

  ${(p) =>
    p.small &&
    css`
      font-size: var(--tina-font-size-1);
      padding: 8px var(--tina-padding-small);
    `};
`;

export const Input = styled.input<InputProps>`
  ${InputCss}
`;
