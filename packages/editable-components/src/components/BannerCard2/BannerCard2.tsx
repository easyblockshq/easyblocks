/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function BannerCard2(props: any) {
  const {
    Container,
    SidePhotoContainer,
    ContentContainer,
    Link,
    Card1,
    Card2,
  } = props.__fromEditor.components;

  return (
    <Container>
      <Link />

      <SidePhotoContainer>
        <Card2 />
      </SidePhotoContainer>

      <ContentContainer>
        <Card1 />
      </ContentContainer>
    </Container>
  );
}

export default BannerCard2;
