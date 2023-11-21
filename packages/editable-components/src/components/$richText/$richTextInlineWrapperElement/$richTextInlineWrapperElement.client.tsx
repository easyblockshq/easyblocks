import React, { ReactElement } from "react";

type RichTextActionElementProps = {
  elements: Array<ReactElement>;
  action?: ReactElement;
  Link: ReactElement;
};

export default function RichTextActionElement(
  props: RichTextActionElementProps
) {
  const { elements: Elements, Link, action: Action } = props;

  const triggerElement = (
    <Link.type {...Link.props}>
      {Elements.map((Element, index) => (
        <Element.type {...Element.props} key={index} />
      ))}
    </Link.type>
  );

  if (Action) {
    return <Action.type {...Action.props} trigger={triggerElement} />;
  }
  return triggerElement;
}
