import React from "react";

export function CoverCard(props: any) {
  const { Root, Background, Placeholder, Overlay, image } = props;

  return (
    <Root.type {...Root.props}>
      {!image && <Placeholder.type {...Placeholder.props} />}
      {image && <Image.type {...Image.props} src={image.url} alt={image.alt} />}
      <Overlay.type {...Overlay.props} />
    </Root.type>
  );
}
