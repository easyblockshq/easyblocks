import React, { ReactElement } from "react";
import type { RichTextBlockElementType } from "../$richTextBlockElement/$richTextBlockElement";
import { liStyles, paragraphStyles } from "../styles";
type RichTextLineElementProps = {
  blockType: RichTextBlockElementType;
  elements: Array<React.ReactElement>;
  ListItem: ReactElement;
  TextLine: ReactElement;
};

export function RichTextLineElementClient(props: RichTextLineElementProps) {
  const { blockType, elements: Elements, ListItem, TextLine } = props;
  const elements = Elements.map((Element, index) => (
    <Element.type {...Element.props} key={index} />
  ));

  if (blockType === "paragraph") {
    return <div style={paragraphStyles}>{elements}</div>;
    // return <TextLine.type {...TextLine.props}>{elements}</TextLine.type>;
  }

  if (blockType === "bulleted-list" || blockType === "numbered-list") {
    return (
      <li style={liStyles}>
        <span>{elements}</span>
      </li>
    );

    // return (
    //   <ListItem.type {...ListItem.props}>
    //     <span>{elements}</span>
    //   </ListItem.type>
    // );
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(
      `Unknown @easyblocks/rich-text-line-element blockType "${blockType}"`
    );
  }

  return <div>{elements}</div>;
}
