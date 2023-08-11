/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function BackgroundColor(props: any) {
  const { Wrapper, AspectRatioMaker, Background } =
    props.__fromEditor.components;

  return (
    <Wrapper>
      <AspectRatioMaker />
      <Background />
    </Wrapper>
  );
}

export default BackgroundColor;
