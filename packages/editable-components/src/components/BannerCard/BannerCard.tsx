import React, { ReactElement } from "react";

function BannerCard(props: Record<string, ReactElement>) {
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
    // Link,
  } = props;

  return (
    <Container.type {...Container.props}>
      {/*<Link />*/}

      <SidePhotoContainer.type {...SidePhotoContainer.props}>
        <SideImage.type {...SideImage.props} />
      </SidePhotoContainer.type>

      <ContentContainer.type {...ContentContainer.props}>
        <BackgroundContainer.type {...BackgroundContainer.props}>
          <Background.type {...Background.props} />
        </BackgroundContainer.type>

        <StackContainer.type {...StackContainer.props}>
          <StackInnerContainer.type {...StackInnerContainer.props}>
            <Stack.type {...Stack.props} />
          </StackInnerContainer.type>
        </StackContainer.type>
      </ContentContainer.type>
    </Container.type>
  );
}

export default BannerCard;
