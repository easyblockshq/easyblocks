import type { ReactNode } from "react";
import React from "react";

interface RichTextPartProps {
  _id: string;
  _template: "$richTextPart";
  color: string;
  font: Record<string, any>;
  value: string;
  Text: React.ReactElement<{ children: ReactNode }>;
}

export default function RichTextPart(props: RichTextPartProps) {
  const { value, Text } = props;

  return <Text.type {...Text.props}>{value || "\uFEFF"}</Text.type>;
}

export type { RichTextPartProps };
