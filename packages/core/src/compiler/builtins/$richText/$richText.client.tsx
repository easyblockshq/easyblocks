import React, { ReactElement, ReactNode } from "react";

interface RichTextProps {
  elements: Array<ReactElement>;
  Root: ReactElement<{ children: ReactNode }>;
  __textRootClasses: string;
}

function RichTextClient(props: RichTextProps) {
  const { elements: Elements, Root } = props;

  return (
    <div className={props.__textRootClasses}>
      {Elements.map((Element, index) => {
        return <Element.type {...Element.props} key={index} />;
      })}
    </div>
  );
}

export { RichTextClient };
