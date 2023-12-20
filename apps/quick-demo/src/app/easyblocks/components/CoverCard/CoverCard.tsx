import React from "react";

export function CoverCard(props: any) {
  const { Root, Background, Overlay } = props;

  return (
    <Root.type {...Root.props}>
      <Background.type {...Background.props} />
      <Overlay.type {...Overlay.props} />
    </Root.type>
  );
}
