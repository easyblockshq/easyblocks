"use client";
import type { ElementType, ReactNode } from "react";
import React, { ComponentPropsWithRef } from "react";
import styled, { css } from "styled-components";
import { Colors } from "./colors";
import { Fonts } from "./fonts";

type TypographyVariant = "body" | "body4" | "label" | "label2" | "label3";

type TypographyColor = keyof typeof Colors;

type TypographyAlignment = "left" | "center" | "right" | "justify";

interface TypographyProps {
  component?: ElementType;
  color?: TypographyColor;
  children: ReactNode | ReactNode[];
  variant?: TypographyVariant;
  // For now, `className` should be allowed for adding styles that aren't available to set from props.
  className?: string;
  align?: TypographyAlignment;
  isTruncated?: boolean;
}

interface TypographyComponent {
  <Component extends ElementType>(
    props: { component: Component } & TypographyProps &
      Omit<ComponentPropsWithRef<Component>, keyof TypographyProps>
  ): JSX.Element;
  (
    props: TypographyProps &
      Omit<ComponentPropsWithRef<"div">, keyof TypographyProps>
  ): JSX.Element;
}

const Typography: TypographyComponent = ({
  children,
  className,
  component: Component = "div",
  color,
  variant = "body",
  align = "left",
  isTruncated = false,
  ...restProps
}: TypographyProps) => {
  return (
    <TypographyRoot
      as={Component}
      className={className}
      variant={variant}
      // Don't forward `color` prop to host element since it's our custom prop, not native one.
      $color={color}
      align={align}
      $isTruncated={isTruncated}
      {...restProps}
    >
      {children}
    </TypographyRoot>
  );
};

type TypographyRootProps = Required<
  Pick<TypographyProps, "variant" | "align">
> & {
  $color: TypographyProps["color"];
  $isTruncated: NonNullable<TypographyProps["isTruncated"]>;
};

// Why use `div` as the default text tag?
// 1. We mostly stack up lines of text so it's natural for typography component to be block element
// 2. We can easily put other `Typography` components within. Why does it matter?
//    Imagine we want to only bold a fragment of text so we use `Typography` as the child of `Typography`.
//    If we would use `p` as the default, there are restricted tags that can be placed within
//    and maybe you would remember about that to change tag of outer `Typography` component
//    or maybe you would get warning from React about incorrect nesting of HTML elements.
//    By using the `div` as the default, you don't have to worry about it.
const TypographyRoot = styled.div<TypographyRootProps>`
  color: ${({ $color }) => ($color !== undefined ? Colors[$color] : "black")};
  ${({ variant }) => Fonts[variant]}
  text-align: ${({ align }) => align};

  ${({ $isTruncated }) =>
    $isTruncated &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
    `}
`;

export { Typography };
