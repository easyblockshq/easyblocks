/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { ComponentType, ReactNode } from "react";

interface RichTextProps {
  __fromEditor: {
    components: {
      elements: Array<ComponentType>;
      Root: ComponentType<{ children: ReactNode }>;
    };
  };
}

function RichText(props: RichTextProps) {
  const { elements: Elements, Root } = props.__fromEditor.components;

  return (
    <Root>
      {Elements.map((Element, index) => {
        return <Element key={index} />;
      })}
    </Root>
  );
}

export default RichText;
