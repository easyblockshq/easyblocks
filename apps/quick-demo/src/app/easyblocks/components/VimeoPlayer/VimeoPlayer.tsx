import React, { ReactElement } from "react";
import { VimeoPlayerInternal } from "./VimeoPlayerInternal";

export function VimeoPlayer(props: {
  AspectRatioMaker: ReactElement;
  ContentWrapper: ReactElement;
  Wrapper: ReactElement;
}) {
  const { AspectRatioMaker, ContentWrapper, Wrapper } = props;

  return (
    <Wrapper.type {...Wrapper.props}>
      <AspectRatioMaker.type {...AspectRatioMaker.props} />

      <ContentWrapper.type {...ContentWrapper.props}>
        <VimeoPlayerInternal {...props} />
      </ContentWrapper.type>
    </Wrapper.type>
  );
}
