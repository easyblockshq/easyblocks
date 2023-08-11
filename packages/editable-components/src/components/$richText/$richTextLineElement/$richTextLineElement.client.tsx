/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { RichTextBlockElementType } from "../$richTextBlockElement/$richTextBlockElement";
import { CompiledShopstoryComponentProps } from "../../../types";
import {
  RichTextLineElementCompiledComponentConfig,
  RichTextLineElementComponentConfig,
} from "./$richTextLineElement";

type RichTextLineElementProps = CompiledShopstoryComponentProps<
  RichTextLineElementComponentConfig["_template"],
  Record<string, never>,
  { blockType: RichTextBlockElementType },
  RichTextLineElementCompiledComponentConfig["styled"]
> & {
  __fromEditor: {
    components: {
      elements: Array<React.ComponentType>;
    };
  };
};

export default function RichTextLineElement(props: RichTextLineElementProps) {
  const {
    elements: Elements,
    ListItem,
    TextLine,
  } = props.__fromEditor.components;
  const { blockType } = props.__fromEditor.props;
  const elements = Elements.map((Element, index) => <Element key={index} />);

  if (blockType === "paragraph") {
    return <TextLine>{elements}</TextLine>;
  }

  if (blockType === "bulleted-list" || blockType === "numbered-list") {
    return (
      <ListItem>
        <div>{elements}</div>
      </ListItem>
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(`Unknown $richTextLineElement blockType ${blockType}`);
  }

  return <div>{elements}</div>;
}
