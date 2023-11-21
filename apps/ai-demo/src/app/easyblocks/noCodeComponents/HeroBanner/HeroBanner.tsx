import React from "react";

export function HeroBanner(props: any) {
  const { Container } = props;

  return (
    <Container.type {...Container.props}>
      <h1>Hero Banner</h1>
    </Container.type>
  );
}
