import React, { ReactElement } from "react";
import type { CompiledNoCodeComponentProps } from "../../../types";
import type { RichTextBlockElementComponentConfig } from "./$richTextBlockElement";
import { olStyles, ulStyles } from "../styles";

type RichTextBlockElementProps = CompiledNoCodeComponentProps<
  RichTextBlockElementComponentConfig["_component"],
  Pick<RichTextBlockElementComponentConfig, "type">
> & {
  elements: Array<ReactElement>;
  Paragraph: ReactElement;
  BulletedList: ReactElement;
  NumberedList: ReactElement;
};

export function RichTextBlockElementClient(props: RichTextBlockElementProps) {
  const {
    type,
    BulletedList,
    elements: Elements,
    NumberedList,
    Paragraph,
    accessibilityRole,
  } = props;

  const elements = Elements.map((Element, index) => (
    <Element.type {...Element.props} key={index} />
  ));

  if (type === "paragraph") {
    return React.createElement(accessibilityRole, {}, elements);
    // return <Paragraph.type {...Paragraph.props}>{elements}</Paragraph.type>;
  }

  if (type === "bulleted-list") {
    return <ul style={ulStyles}>{elements}</ul>;
  }

  if (type === "numbered-list") {
    return <ol style={olStyles}>{elements}</ol>;
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(`Unknown @easyblocks/rich-text-block-element type "${type}"`);
  }

  return <span>{elements}</span>;
}
