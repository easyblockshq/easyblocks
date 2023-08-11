/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import type { ComponentType, ReactNode } from "react";

function Separator(props: {
  __fromEditor: {
    components: {
      Container: ComponentType<{ children: ReactNode }>;
      Separator: ComponentType;
    };
  };
}) {
  const { Container, Separator } = props.__fromEditor.components;

  return (
    <Container>
      <Separator />
    </Container>
  );
}

export default Separator;
