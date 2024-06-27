import type { ReactElement, ReactNode } from "react";
import React from "react";

type RichTextPartProps = {
  TextWrapper: React.ReactElement<{ trigger: React.ReactElement }> | undefined;
  // ReactElement when editing, string when not
  value: string | ReactElement;
  Text: React.ReactElement<{ children: ReactNode; style: Record<string, any> }>;
};

export function RichTextPartClient(props: RichTextPartProps) {
  const {
    value,
    Text,
    TextWrapper,
    textAttributes = {},
    __fontAndColorClassNames,
  } = props;
  const textValue = value || "\uFEFF";

  console.log("FONT AND COLOR", __fontAndColorClassNames);

  if (TextWrapper) {
    return (
      <span className={__fontAndColorClassNames} {...textAttributes}>
        <TextWrapper.type {...TextWrapper.props}>{textValue}</TextWrapper.type>
      </span>
    );
  }

  return (
    <span className={__fontAndColorClassNames} {...textAttributes}>
      {textValue}
    </span>
  );
  // return <Text.type {...Text.props}>{textValue}</Text.type>;
}
