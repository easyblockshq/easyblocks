import React, { ReactElement } from "react";

function BasicCard(props: Record<string, ReactElement>) {
  const {
    ContentContainer,
    Background,
    BackgroundContainer,
    Stack,
    StackContainer,
    StackInnerContainer,
  } = props;

  return (
    <ContentContainer.type {...ContentContainer.props}>
      <BackgroundContainer.type {...BackgroundContainer.props}>
        <Background.type {...Background.props} />
      </BackgroundContainer.type>

      <StackContainer.type {...StackContainer.props}>
        <StackInnerContainer.type {...StackInnerContainer.props}>
          <Stack.type {...Stack.props} />
        </StackInnerContainer.type>
      </StackContainer.type>
    </ContentContainer.type>
  );
}

export default BasicCard;
