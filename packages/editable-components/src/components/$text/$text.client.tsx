/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { cleanString } from "@easyblocks/utils";
import React from "react";

type TextProps = {
  __fromEditor: {
    components: any;
    props: {
      value?: {
        value: string;
      };
    };
  };
};

const $text = (props: TextProps) => {
  const { Text } = props.__fromEditor.components;

  // We need to transform new lines into <br />

  const lines = cleanString(props.__fromEditor.props.value?.value || "").split(
    /(?:\r\n|\r|\n)/g
  );

  const elements: React.ReactElement[] = [];

  lines.forEach((line, index) => {
    elements.push(<React.Fragment key={index}>{line}</React.Fragment>);
    if (index !== lines.length - 1) {
      elements.push(<br key={"br" + index} />);
    }
  });

  return <Text>{elements}</Text>;
};

export default $text;
