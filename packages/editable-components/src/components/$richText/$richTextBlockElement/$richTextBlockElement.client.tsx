import React, { ReactElement } from "react";
import type { CompiledNoCodeComponentProps } from "../../../types";
import type { RichTextBlockElementComponentConfig } from "./$richTextBlockElement";

type RichTextBlockElementProps = CompiledNoCodeComponentProps<
  RichTextBlockElementComponentConfig["_template"],
  Pick<RichTextBlockElementComponentConfig, "type">
> & {
  elements: Array<ReactElement>;
  Paragraph: ReactElement;
  BulletedList: ReactElement;
  NumberedList: ReactElement;
};

export default function RichTextBlockElement(props: RichTextBlockElementProps) {
  const {
    type,
    BulletedList,
    elements: Elements,
    NumberedList,
    Paragraph,
  } = props;

  const elements = Elements.map((Element, index) => (
    <Element.type {...Element.props} key={index} />
  ));

  if (type === "paragraph") {
    return <Paragraph.type {...Paragraph.props}>{elements}</Paragraph.type>;
  }

  if (type === "bulleted-list") {
    return (
      <BulletedList.type {...BulletedList.props}>{elements}</BulletedList.type>
    );
  }

  if (type === "numbered-list") {
    return (
      <NumberedList.type {...NumberedList.props}>{elements}</NumberedList.type>
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(`Unknown $richTextBlockElement type ${type}`);
  }

  return <div>{elements}</div>;
}
