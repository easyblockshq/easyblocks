import { cleanString } from "@easyblocks/utils";
import React, { ReactElement } from "react";

type TextProps = {
  value?: string;
  Text: ReactElement;
};

function TextClient(props: TextProps) {
  const { value, Text } = props;

  // We need to transform new lines into <br />
  const lines = cleanString(value || "").split(/(?:\r\n|\r|\n)/g);

  const elements: React.ReactElement[] = [];

  lines.forEach((line, index) => {
    elements.push(<React.Fragment key={index}>{line}</React.Fragment>);
    if (index !== lines.length - 1) {
      elements.push(<br key={"br" + index} />);
    }
  });

  return <Text.type {...Text.props}>{elements}</Text.type>;
}

export default TextClient;
