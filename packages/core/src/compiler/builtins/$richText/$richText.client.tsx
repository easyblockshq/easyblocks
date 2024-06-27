import React, { ReactElement, ReactNode } from "react";

interface RichTextProps {
  elements: Array<ReactElement>;
  Root: ReactElement<{ children: ReactNode }>;
}

function RichTextClient(props: RichTextProps) {
  const { elements: Elements, Root } = props;

  return (
    <div className={props.__fontAndColorClassNames}>
      {Elements.map((Element, index) => {
        return <Element.type {...Element.props} key={index} />;
      })}
    </div>
  );
}

export { RichTextClient };
