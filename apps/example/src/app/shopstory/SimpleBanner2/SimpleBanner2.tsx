import React from "react";

export function SimpleBanner2(props: any) {
  const {
    Root,
    Stack,
    CoverContainer,
    Cover,
    TitleContainer,
    DescriptionContainer,
    Title,
  } = props.__fromEditor.components;

  return (
    <Root.type {...Root.props}>
      <CoverContainer.type {...CoverContainer.props}>
        <Cover.type {...Cover.props} />
      </CoverContainer.type>
      <Stack.type {...Stack.props}>
        <TitleContainer.type {...TitleContainer.props}>
          <Title.type {...Title.props} />
        </TitleContainer.type>
        <DescriptionContainer.type {...DescriptionContainer.props}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </DescriptionContainer.type>
      </Stack.type>
    </Root.type>
  );
}
