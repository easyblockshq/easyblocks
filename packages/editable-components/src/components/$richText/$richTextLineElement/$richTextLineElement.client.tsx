import React, { ReactElement } from "react";
import type { RichTextBlockElementType } from "../$richTextBlockElement/$richTextBlockElement";

type RichTextLineElementProps = {
  blockType: RichTextBlockElementType;
  elements: Array<React.ReactElement>;
  ListItem: ReactElement;
  TextLine: ReactElement;
};

export default function RichTextLineElement(props: RichTextLineElementProps) {
  const { blockType, elements: Elements, ListItem, TextLine } = props;
  const elements = Elements.map((Element, index) => (
    <Element.type {...Element.props} key={index} />
  ));

  if (blockType === "paragraph") {
    return <TextLine.type {...TextLine.props}>{elements}</TextLine.type>;
  }

  if (blockType === "bulleted-list" || blockType === "numbered-list") {
    return (
      <ListItem.type {...ListItem.props}>
        <div>{elements}</div>
      </ListItem.type>
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(`Unknown $richTextLineElement blockType ${blockType}`);
  }

  return <div>{elements}</div>;
}
