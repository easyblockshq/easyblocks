import React from "react";

export function HeroBanner(props: any) {
  const {
    Container,
    Root,
    Stack,
    StackContainer,
    StackInnerContainer,
    CoverContainer,
    Cover,
    CoverAspectRatioMaker,
  } = props;

  return (
    <Root.type {...Root.props}>
      <Container.type {...Container.props}>
        <CoverContainer.type {...CoverContainer.props}>
          <Cover.type {...Cover.props}>
            <CoverAspectRatioMaker.type {...CoverAspectRatioMaker.props} />
          </Cover.type>
        </CoverContainer.type>
        <StackContainer.type {...StackContainer.props}>
          <StackInnerContainer.type {...StackInnerContainer.props}>
            <Stack.type {...Stack.props} />
          </StackInnerContainer.type>
        </StackContainer.type>
      </Container.type>
    </Root.type>
  );
}
