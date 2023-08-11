/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import type { ComponentType, ReactNode } from "react";

function TokenFont(props: {
  __fromEditor: {
    components: {
      Container: ComponentType<{ children: ReactNode }>;
      InnerContainer: ComponentType<{ children: ReactNode }>;
      Text: ComponentType<{ children: ReactNode }>;
    };
  };
  configProps: {
    exampleTextLength: "short" | "medium" | "long";
  };
}) {
  const { Container, InnerContainer, Text } = props.__fromEditor.components;

  return (
    <Container>
      <InnerContainer>
        <Text>
          {props.configProps.exampleTextLength === "short"
            ? "Lorem ipsum dolor sit amet"
            : props.configProps.exampleTextLength === "medium"
            ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
            : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
        </Text>
      </InnerContainer>
    </Container>
  );
}

export default TokenFont;
