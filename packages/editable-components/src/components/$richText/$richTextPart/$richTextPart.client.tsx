/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import type { ReactNode } from "react";

interface RichTextPartProps {
  __fromEditor: {
    _id: string;
    _template: "$richTextPart";
    props: { color: string; font: Record<string, any>; value: string };
    components: {
      Text: React.ComponentType<{ children: ReactNode }>;
    };
    styled: {
      Text: Record<string, any>;
    };
  };
}

export default function RichTextPart(props: RichTextPartProps) {
  const { __fromEditor } = props;
  const { value } = __fromEditor.props;
  const { Text } = __fromEditor.components;

  return <Text>{value || "\uFEFF"}</Text>;
}

export type { RichTextPartProps };
