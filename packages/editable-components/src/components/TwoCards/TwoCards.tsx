/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function TwoCards(props: any) {
  const { Card1, Card2, Card1Container, Card2Container, Root } =
    props.__fromEditor.components;

  return (
    <Root>
      <Card1Container>
        <Card1 />
      </Card1Container>

      <Card2Container>
        <Card2 />
      </Card2Container>
    </Root>
  );
}

export default TwoCards;
