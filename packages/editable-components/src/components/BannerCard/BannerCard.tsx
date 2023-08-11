/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function BannerCard(props: any) {
  const {
    Container,
    SidePhotoContainer,
    ContentContainer,
    Background,
    BackgroundContainer,
    Stack,
    StackContainer,
    StackInnerContainer,
    SideImage,
    Link,
  } = props.__fromEditor.components;

  return (
    <Container>
      <Link />

      <SidePhotoContainer>
        <SideImage />
      </SidePhotoContainer>

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
    </Container>
  );
}

export default BannerCard;
