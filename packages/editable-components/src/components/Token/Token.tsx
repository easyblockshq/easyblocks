/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import type { ComponentType, ReactNode } from "react";

function Token(props: {
  __fromEditor: {
    components: {
      Container: ComponentType<{ children: ReactNode }>;
      InnerContainer: ComponentType<{ children: ReactNode }>;
      Component: ComponentType;
    };
  };
}) {
  const { Container, InnerContainer, Component } =
    props.__fromEditor.components;

  return (
    <Container>
      <InnerContainer>
        <Component />
      </InnerContainer>
    </Container>
  );
}

export default Token;
