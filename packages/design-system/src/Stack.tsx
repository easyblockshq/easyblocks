import React, { ComponentPropsWithoutRef } from "react";
import { ReactNode } from "react";
import styled from "styled-components";

const StackWrapper = styled.div<
  Pick<ComponentPropsWithoutRef<typeof Stack>, "gap" | "align">
>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.gap}px;
  align-items: ${(props) =>
    props.align === "start"
      ? "flex-start"
      : props.align === "end"
      ? "flex-end"
      : props.align === "stretch"
      ? "stretch"
      : "center"};
`;

function Stack(props: {
  align?: "start" | "center" | "end" | "stretch";
  gap: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <StackWrapper
      gap={props.gap}
      align={props.align ?? "stretch"}
      className={props.className}
    >
      {props.children}
    </StackWrapper>
  );
}

export { Stack };
