import type { ReactNode } from "react";
import React from "react";

type RichTextPartProps = {
  action: React.ReactElement<{ trigger: React.ReactElement }> | undefined;
  value: string;
  Text: React.ReactElement<{ children: ReactNode; style: Record<string, any> }>;
};

export function RichTextPartClient(props: RichTextPartProps) {
  const { value, Text, action: Action } = props;

  const textElement = (
    <Text.type {...Text.props}>{value || "\uFEFF"}</Text.type>
  );

  if (Action) {
    return <Action.type {...Action.props} trigger={textElement} />;
  }

  return textElement;
}

export type { RichTextPartProps };
