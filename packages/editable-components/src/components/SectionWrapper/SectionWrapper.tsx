/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function SectionWrapper(props: any) {
  // Underscores are for the namespace purpose - we don't want to clutter it with common names
  const {
    Container__,
    Root__,
    BackgroundContainer__,
    Background__,
    HeaderStack,
    HeaderSecondaryStack,
    HeaderStackContainer__,
    SubheaderStackContainer__,
    ContentContainer__,
    Component,
  } = props.__fromEditor.components;

  const headerMode = props.__fromEditor.props.headerMode;

  return (
    <Root__ id={props.__fromEditor._id}>
      {Background__ && (
        <BackgroundContainer__>
          <Background__ />
        </BackgroundContainer__>
      )}
      <Container__>
        {headerMode !== "none" && (
          <HeaderStackContainer__>
            <HeaderStack />
          </HeaderStackContainer__>
        )}

        {headerMode === "2-stacks" && (
          <SubheaderStackContainer__>
            <HeaderSecondaryStack />
          </SubheaderStackContainer__>
        )}

        <ContentContainer__>
          <Component />
        </ContentContainer__>
      </Container__>
    </Root__>
  );
}

export default SectionWrapper;
