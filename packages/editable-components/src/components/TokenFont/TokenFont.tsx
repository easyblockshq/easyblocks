import type { ReactElement, ReactNode } from "react";
import React from "react";

function TokenFont(props: {
  Container: ReactElement<{ children: ReactNode }>;
  InnerContainer: ReactElement<{ children: ReactNode }>;
  Text: ReactElement<{ children: ReactNode }>;
  configProps: {
    exampleTextLength: "short" | "medium" | "long";
  };
}) {
  const { Container, InnerContainer, Text, configProps } = props;

  return (
    <Container.type {...Container.props}>
      <InnerContainer.type {...InnerContainer.props}>
        <Text.type {...Text.props}>
          {configProps.exampleTextLength === "short"
            ? "Lorem ipsum dolor sit amet"
            : configProps.exampleTextLength === "medium"
            ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
            : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
        </Text.type>
      </InnerContainer.type>
    </Container.type>
  );
}

export default TokenFont;
