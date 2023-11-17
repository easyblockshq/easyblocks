import React from "react";
import { RichTextBlockElementType } from "../$richTextBlockElement/$richTextBlockElement";
import { CompiledNoCodeComponentProps } from "../../../types";
import {
  RichTextLineElementCompiledComponentConfig,
  RichTextLineElementComponentConfig,
} from "./$richTextLineElement";

type RichTextLineElementProps = CompiledNoCodeComponentProps<
  RichTextLineElementComponentConfig["_template"],
  Record<string, never>,
  { blockType: RichTextBlockElementType },
  RichTextLineElementCompiledComponentConfig["styled"]
> & {
  elements: Array<React.ReactElement>;
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
