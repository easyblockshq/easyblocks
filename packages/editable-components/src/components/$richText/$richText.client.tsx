import React, { ReactElement, ReactNode } from "react";

interface RichTextProps {
  elements: Array<ReactElement>;
  Root: ReactElement<{ children: ReactNode }>;
}

function RichText(props: RichTextProps) {
  const { elements: Elements, Root } = props;

  return (
    <Root.type {...Root.props}>
      {Elements.map((Element, index) => {
        return <Element.type {...Element.props} key={index} />;
      })}
    </Root.type>
  );
}

export default RichText;
