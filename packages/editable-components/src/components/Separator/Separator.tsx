import type { ReactElement, ReactNode } from "react";
import React from "react";

function Separator(props: {
  Container: ReactElement<{ children: ReactNode }>;
  Separator: ReactElement;
}) {
  const { Container, Separator } = props;

  return (
    <Container.type {...Container.props}>
      <Separator.type {...Separator.props} />
    </Container.type>
  );
}

export default Separator;
