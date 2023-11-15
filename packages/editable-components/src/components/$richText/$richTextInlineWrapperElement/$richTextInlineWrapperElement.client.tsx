/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { ReactElement } from "react";
import { CompiledNoCodeComponentProps } from "../../../types";
import {
  RichTextInlineWrapperElementCompiledComponentConfig,
  RichTextInlineWrapperElementEditableComponentConfig,
} from "./$richTextInlineWrapperElement";

type RichTextActionElementProps = CompiledNoCodeComponentProps<
  RichTextInlineWrapperElementEditableComponentConfig["_template"],
  Record<string, never>,
  Record<string, never>,
  RichTextInlineWrapperElementCompiledComponentConfig["styled"]
> & {
  elements: Array<ReactElement>;
  action?: React.ReactElement;
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
