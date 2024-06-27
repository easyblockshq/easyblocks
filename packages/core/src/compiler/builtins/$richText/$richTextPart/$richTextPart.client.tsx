import type { ReactElement, ReactNode } from "react";
import React from "react";

type RichTextPartProps = {
  TextWrapper: React.ReactElement<{ trigger: React.ReactElement }> | undefined;
  // ReactElement when editing, string when not
  value: string | ReactElement;
  // Text: React.ReactElement<{ children: ReactNode; style: Record<string, any> }>;
  __textPartClasses: string;
  textAttributes: Record<string, any>;
};

export function RichTextPartClient(props: RichTextPartProps) {
  const {
    value,
    // Text,
    TextWrapper,
    textAttributes = {},
    __textPartClasses,
  } = props;
  const textValue = value || "\uFEFF";

  if (TextWrapper) {
    return (
      <span className={__textPartClasses} {...textAttributes}>
        <TextWrapper.type {...TextWrapper.props}>{textValue}</TextWrapper.type>
      </span>
    );
  }

  return (
    <span className={__textPartClasses} {...textAttributes}>
      {textValue}
    </span>
  );
  // return <Text.type {...Text.props}>{textValue}</Text.type>;
}
