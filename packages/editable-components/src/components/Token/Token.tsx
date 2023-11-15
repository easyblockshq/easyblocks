import type { ReactElement, ReactNode } from "react";
import React from "react";

function Token(props: {
  Container: ReactElement<{ children: ReactNode }>;
  InnerContainer: ReactElement<{ children: ReactNode }>;
  Component: ReactElement;
}) {
  const { Container, InnerContainer, Component } = props;

  return (
    <Container.type {...Container.props}>
      <InnerContainer.type {...InnerContainer.props}>
        <Component.type {...Component.props} />
      </InnerContainer.type>
    </Container.type>
  );
}

export default Token;
