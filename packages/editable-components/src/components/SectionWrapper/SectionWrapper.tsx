import React, { ReactElement } from "react";

function SectionWrapper(
  props: { headerMode: string } & Record<string, ReactElement>
) {
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
    headerMode,
  } = props;

  return (
    <Root__.type {...Root__.props} id={props._id}>
      {Background__ && (
        <BackgroundContainer__.type {...BackgroundContainer__.props}>
          <Background__.type {...Background__.props} />
        </BackgroundContainer__.type>
      )}
      <Container__.type {...Container__.props}>
        {headerMode !== "none" && (
          <HeaderStackContainer__.type {...HeaderStackContainer__.props}>
            <HeaderStack.type {...HeaderStack.props} />
          </HeaderStackContainer__.type>
        )}

        {headerMode === "2-stacks" && (
          <SubheaderStackContainer__.type {...SubheaderStackContainer__.props}>
            <HeaderSecondaryStack.type {...HeaderSecondaryStack.props} />
          </SubheaderStackContainer__.type>
        )}

        <ContentContainer__.type {...ContentContainer__.props}>
          <Component.type {...Component.props} />
        </ContentContainer__.type>
      </Container__.type>
    </Root__.type>
  );
}

export default SectionWrapper;
