import React, { ReactElement } from "react";

function SolidColor(props: {
  Wrapper: ReactElement;
  AspectRatioMaker: ReactElement;
  Background: ReactElement;
}) {
  const { Wrapper, AspectRatioMaker, Background } = props;

  return (
    <Wrapper.type {...Wrapper.props}>
      <AspectRatioMaker.type {...AspectRatioMaker.props} />
      <Background.type {...Background.props} />
    </Wrapper.type>
  );
}

export { SolidColor };
