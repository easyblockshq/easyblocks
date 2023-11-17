import React from "react";
import { CompiledNoCodeComponentProps } from "../../types";
import { VimeoPlayerInternal } from "./VimeoPlayerInternal";

function VimeoPlayer(props: CompiledNoCodeComponentProps) {
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

export default VimeoPlayer;
