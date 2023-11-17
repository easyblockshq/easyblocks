import React, { ReactElement } from "react";

function BannerCard2(props: Record<string, ReactElement>) {
  const {
    Container,
    SidePhotoContainer,
    ContentContainer,
    // Link,
    Card1,
    Card2,
  } = props;

  return (
    <Container.type {...Container.props}>
      {/*<Link />*/}

      <SidePhotoContainer.type {...SidePhotoContainer.props}>
        <Card2.type {...Card2.props} />
      </SidePhotoContainer.type>

      <ContentContainer.type {...ContentContainer.props}>
        <Card1.type {...Card1.props} />
      </ContentContainer.type>
    </Container.type>
  );
}

export default BannerCard2;
