import type { ReactNode } from "react";
import React from "react";

interface RichTextPartProps {
  _id: string;
  _template: "@easyblocks/rich-text-part";
  color: string;
  font: Record<string, any>;
  value: string;
  Text: React.ReactElement<{ children: ReactNode }>;
}

export function RichTextPartClient(props: RichTextPartProps) {
  const { value, Text } = props;

  return <Text.type {...Text.props}>{value || "\uFEFF"}</Text.type>;
}

export type { RichTextPartProps };
