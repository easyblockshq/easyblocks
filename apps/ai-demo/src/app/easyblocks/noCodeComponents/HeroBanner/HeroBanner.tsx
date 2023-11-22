import React from "react";

export function HeroBanner(props: any) {
  const {
    Container,
    Root,
    Stack,
    StackContainer,
    CoverContainer,
    Cover,
    CoverAspectRatioMaker,
  } = props;

  return (
    <Root.type {...Root.props}>
      <Container.type {...Container.props}>
        <StackContainer.type {...StackContainer.props}>
          <Stack.type {...Stack.props} />
        </StackContainer.type>
        <CoverContainer.type {...CoverContainer.props}>
          <Cover.type {...Cover.props}>
            <CoverAspectRatioMaker.type {...CoverAspectRatioMaker.props} />
          </Cover.type>
        </CoverContainer.type>
      </Container.type>
    </Root.type>
  );
}
