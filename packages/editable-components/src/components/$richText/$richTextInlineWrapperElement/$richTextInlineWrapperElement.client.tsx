/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { CompiledShopstoryComponentProps } from "../../../types";
import {
  RichTextInlineWrapperElementCompiledComponentConfig,
  RichTextInlineWrapperElementEditableComponentConfig,
} from "./$richTextInlineWrapperElement";

type RichTextActionElementProps = CompiledShopstoryComponentProps<
  RichTextInlineWrapperElementEditableComponentConfig["_template"],
  Record<string, never>,
  Record<string, never>,
  RichTextInlineWrapperElementCompiledComponentConfig["styled"]
> & {
  __fromEditor: {
    components: {
      elements: Array<React.ComponentType>;
      action?: React.ReactElement;
    };
  };
};

export default function RichTextActionElement(
  props: RichTextActionElementProps
) {
  const {
    elements: Elements,
    Link,
    action: Action,
  } = props.__fromEditor.components;

  const triggerElement = (
    <Link>
      {Elements.map((Element, index) => (
        <Element key={index} />
      ))}
    </Link>
  );

  if (Action) {
    return <Action.type {...Action.props} trigger={triggerElement} />;
  }
  return triggerElement;
}
