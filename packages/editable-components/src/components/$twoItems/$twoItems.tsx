/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function TwoItems(props: any) {
  const { Container, Items, itemWrappers } = props.__fromEditor.components;

  return (
    <Container>
      {Items.map((Item: any, index: number) => {
        const OuterWrapper = itemWrappers[index].OuterWrapper;
        const InnerWrapper = itemWrappers[index].InnerWrapper;
        return (
          <OuterWrapper>
            <InnerWrapper>
              <Item />
            </InnerWrapper>
          </OuterWrapper>
        );
      })}
    </Container>
  );
}

export default TwoItems;
