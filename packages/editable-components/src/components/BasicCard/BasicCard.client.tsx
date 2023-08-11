/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function BasicCard(props: any) {
  const {
    ContentContainer,
    Background,
    BackgroundContainer,
    Stack,
    StackContainer,
    StackInnerContainer,
  } = props.__fromEditor.components;

  return (
    <ContentContainer>
      <BackgroundContainer>
        <Background />
      </BackgroundContainer>

      <StackContainer>
        <StackInnerContainer>
          <Stack />
        </StackInnerContainer>
      </StackContainer>
    </ContentContainer>
  );
}

export default BasicCard;
