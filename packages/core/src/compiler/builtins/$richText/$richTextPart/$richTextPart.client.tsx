import type { ReactElement, ReactNode } from "react";
import React from "react";

type RichTextPartProps = {
  TextWrapper: React.ReactElement<{ trigger: React.ReactElement }> | undefined;
  // ReactElement when editing, string when not
  value: string | ReactElement;
  Text: React.ReactElement<{ children: ReactNode; style: Record<string, any> }>;
};

export function RichTextPartClient(props: RichTextPartProps) {
  const { value, Text, TextWrapper } = props;
  const textValue = value || "\uFEFF";

  if (TextWrapper) {
    return (
      <Text.type {...Text.props}>
        <TextWrapper.type {...TextWrapper.props}>{textValue}</TextWrapper.type>
      </Text.type>
    );
  }

  return <Text.type {...Text.props}>{textValue}</Text.type>;
}
