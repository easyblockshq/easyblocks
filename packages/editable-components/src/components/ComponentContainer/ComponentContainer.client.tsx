/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function ComponentContainer(props: any) {
  const { Container, Component } = props.__fromEditor.components;

  return (
    <Container id={"__shopstory-container"}>
      <Component />
    </Container>
  );
}

export default ComponentContainer;
