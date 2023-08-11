/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import type { ComponentType, ReactNode } from "react";

function TokenColor(props: {
  __fromEditor: {
    components: {
      Container: ComponentType<{ children: ReactNode }>;
      InnerContainer: ComponentType<{ children: ReactNode }>;
      ColorBox: ComponentType;
    };
  };
}) {
  const { Container, InnerContainer, ColorBox } = props.__fromEditor.components;

  return (
    <Container>
      <InnerContainer>
        <ColorBox />
      </InnerContainer>
    </Container>
  );
}

export default TokenColor;
