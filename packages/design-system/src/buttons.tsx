import React, { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";

import { Colors } from "./colors";
import { Fonts } from "./fonts";
import { Icon } from "./icons";
import { Loader } from "./Loader";

type CustomButtonProps = {
  component?: React.ElementType;
  children?: ReactNode;
  className?: string;
  onClick?: any;
  hideLabel?: boolean;
  icon?: Icon;
  enhancer?: React.ReactElement;
  variant?: "standard" | "large" | "tiny";
  height?: string;
  isLoading?: boolean;
};

type ButtonPropsInternal = CustomButtonProps & {
  isGhost?: boolean;
  noPadding?: boolean;
  Button: any;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  CustomButtonProps;

const sharedCSS = (p: ButtonPropsInternal) => css`
  ${Fonts.body};
  border: none;
  outline: none;
  height: ${p.height !== undefined
    ? p.height
    : p.variant === "large"
    ? "36px"
    : p.variant === "tiny"
    ? "24px"
    : "28px"};

  ${p.hideLabel
    ? `
    width: ${
      p.variant === "large" ? "36px" : p.variant === "tiny" ? "24px" : "28px"
    };
  `
    : `
    padding-left: ${p.isGhost ? (p.noPadding ? "0px" : "6px") : "10px"};
    padding-right: ${p.isGhost ? (p.noPadding ? "0px" : "6px") : "10px"};
  `}
  border-radius: 6px;
  line-height: 1;
  transition: all 0.1s;

  display: flex;
  flex-direction: row;
  gap: 6px;
  justify-content: center;
  align-items: center;
`;

const PrimaryButton = styled.button<ButtonPropsInternal>`
  ${(p) => sharedCSS(p)}

  background-color: ${Colors.blue50};
  color: white;
  min-width: 60px;

  ${(p) =>
    p.disabled
      ? `
    opacity 0.7;
  `
      : `
    &:hover {
      background-color: ${Colors.blue60};
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 2px ${Colors.blue60};
    }
  
    &:active {
      background-color: ${Colors.blue70};
    }
    
  `}
`;

const DangerButton = styled.button<ButtonPropsInternal>`
  ${(p) => sharedCSS(p)}

  background-color: ${Colors.red};
  color: white;
  min-width: 60px;

  ${(p) =>
    p.disabled
      ? `
    opacity 0.7;
  `
      : `
    &:hover {
      opacity: 0.7
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 2px ${Colors.blue60};
    }
  
    &:active {
      background-color: ${Colors.blue70};
    }
    
  `}
`;

const SecondaryButton = styled.button<ButtonPropsInternal>`
  ${(p) => sharedCSS(p)}

  background-color: ${Colors.black5};
  color: black;
  min-width: 60px;

  ${(p) =>
    p.disabled
      ? `
    opacity 0.7;
  `
      : `
      &:hover {
        background-color: ${Colors.black10};
      }
    
      &:focus-visible {
        box-shadow: 0 0 0 2px ${Colors.blue50};
      }
    
      &:active {
        background-color: ${Colors.black40};
      }
    
  `}
`;

const GhostButton = styled.button<ButtonPropsInternal>`
  ${(p) => sharedCSS(p)}

  background-color: transparent;
  color: black;
  border: 1px solid transparent;
  border-radius: 2px;

  &:hover {
    border-color: #e5e5e5;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${Colors.blue50};
  }

  &:active {
    background-color: ${Colors.black20};
  }
`;

const GhostColorButton = styled.button<ButtonPropsInternal>`
  ${(p) => sharedCSS(p)}

  background-color: transparent;
  color: ${Colors.blue50};

  &:hover {
    background-color: ${Colors.blue10};
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${Colors.blue50};
  }

  &:active {
    background-color: ${Colors.black20};
  }
`;

const EnhancerContainer = styled.div<Pick<CustomButtonProps, "variant">>`
  position: relative;
  width: ${(p) => (p.variant === "large" ? "24px" : "16px")};
  height: ${(p) => (p.variant === "large" ? "24px" : "16px")};
  overflow: hidden;
  flex-shrink: 0;
`;

const Button = forwardRef<HTMLButtonElement, ButtonPropsInternal>(
  ({ component, Button, ...props }, ref) => {
    let enhancer: React.ReactElement | null = null;
    if (props.isLoading) {
      enhancer = <Loader />;
    } else if (props.enhancer) {
      enhancer = (
        <EnhancerContainer variant={props.variant}>
          {props.enhancer}
        </EnhancerContainer>
      );
    } else if (props.icon) {
      const Icon = props.icon;
      enhancer = <Icon />;
    }

    return (
      <Button as={component} {...props} ref={ref}>
        {enhancer}
        {!props.hideLabel && props.children}
      </Button>
    );
  }
);

export const ButtonPrimary: React.FC<ButtonProps> = (props) => (
  <Button {...props} Button={PrimaryButton} />
);

export const ButtonDanger: React.FC<ButtonProps> = (props) => (
  <Button {...props} Button={DangerButton} />
);

export const ButtonSecondary = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button {...props} Button={SecondaryButton} ref={ref} />
);

export type GhostButtonProps = ButtonProps & { noPadding?: boolean };

export const ButtonGhost = forwardRef<HTMLButtonElement, GhostButtonProps>(
  (props, ref) => (
    <Button
      {...props}
      Button={GhostButton}
      isGhost={true}
      noPadding={props.noPadding}
      ref={ref}
    />
  )
);
export const ButtonGhostColor: React.FC<GhostButtonProps> = (props) => (
  <Button
    {...props}
    Button={GhostColorButton}
    isGhost={true}
    noPadding={props.noPadding}
  />
);

const IconButtonPrimaryStyled = styled(Button)`
  min-width: 0;
  border-radius: 50%;
`;

export const IconButtonPrimary: React.FC<
  Omit<ButtonProps, "children" | "hideLabel">
> = (props) => (
  <IconButtonPrimaryStyled {...props} Button={PrimaryButton} hideLabel />
);
