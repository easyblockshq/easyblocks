import React, { ReactElement } from "react";

function ComponentContainer(props: {
  Container: ReactElement;
  Component: ReactElement;
}) {
  const { Container, Component } = props;

  return (
    <Container.type {...Container.props} id={"__shopstory-container"}>
      <Component.type {...Component.props} />
    </Container.type>
  );
}

export default ComponentContainer;
