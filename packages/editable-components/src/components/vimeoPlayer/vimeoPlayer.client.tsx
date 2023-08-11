/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { CompiledShopstoryComponentProps } from "../../types";
import { VimeoPlayerInternal } from "./VimeoPlayerInternal";

type VimeoPlayerProps = CompiledShopstoryComponentProps;

function VimeoPlayer(props: VimeoPlayerProps) {
  const { AspectRatioMaker, ContentWrapper, Wrapper } =
    props.__fromEditor.components;

  return (
    <Wrapper>
      <AspectRatioMaker />

      <ContentWrapper>
        <VimeoPlayerInternal {...props} />
      </ContentWrapper>
    </Wrapper>
  );
}

export default VimeoPlayer;
