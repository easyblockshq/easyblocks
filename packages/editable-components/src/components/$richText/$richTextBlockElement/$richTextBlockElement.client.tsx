/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { ReactNode } from "react";
import { CompiledNoCodeComponentProps } from "../../../types";
import {
  RichTextBlockElementCompiledComponentConfig,
  RichTextBlockElementComponentConfig,
} from "./$richTextBlockElement";

type RichTextBlockElementProps = CompiledNoCodeComponentProps<
  RichTextBlockElementComponentConfig["_template"],
  Pick<RichTextBlockElementComponentConfig, "type">
> & {
  [key in keyof RichTextBlockElementCompiledComponentConfig["styled"]]: key extends "elements"
    ? Array<React.ComponentType>
    : React.ComponentType<{ children: ReactNode }>;
};

export default function RichTextBlockElement(props: RichTextBlockElementProps) {
  const {
    type,
    BulletedList,
    elements: Elements,
    NumberedList,
    Paragraph,
  } = props;

  const elements = Elements.map((Element, index) => <Element key={index} />);

  if (type === "paragraph") {
    return <Paragraph>{elements}</Paragraph>;
  }

  if (type === "bulleted-list") {
    return <BulletedList>{elements}</BulletedList>;
  }

  if (type === "numbered-list") {
    return <NumberedList>{elements}</NumberedList>;
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(`Unknown $richTextBlockElement type ${type}`);
  }

  return <div>{elements}</div>;
}
