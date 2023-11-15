import type { ReactElement, ReactNode } from "react";
import React from "react";

function TokenColor(props: {
  Container: ReactElement<{ children: ReactNode }>;
  InnerContainer: ReactElement<{ children: ReactNode }>;
  ColorBox: ReactElement;
}) {
  const { Container, InnerContainer, ColorBox } = props;

  return (
    <Container.type {...Container.props}>
      <InnerContainer.type {...InnerContainer.props}>
        <ColorBox.type {...ColorBox.props} />
      </InnerContainer.type>
    </Container.type>
  );
}

export default TokenColor;
