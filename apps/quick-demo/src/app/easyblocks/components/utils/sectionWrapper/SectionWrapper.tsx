import React, { ReactElement } from "react";

export type SectionProps = {
  Container__: ReactElement;
  Root__: ReactElement;
  BackgroundContainer__: ReactElement;
  Background__: ReactElement;
  HeaderStack: ReactElement;
  HeaderSecondaryStack: ReactElement;
  HeaderStackContainer__: ReactElement;
  SubheaderStackContainer__: ReactElement;
  ContentContainer__: ReactElement;
  headerMode: string;
};

export function SectionWrapper(
  props: {
    _id: string;
    children: any;
  } & SectionProps
) {
  const {
    BackgroundContainer__,
    Background__,
    Container__,
    ContentContainer__,
    HeaderSecondaryStack,
    HeaderStack,
    HeaderStackContainer__,
    Root__,
    SubheaderStackContainer__,
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
          {props.children}
        </ContentContainer__.type>
      </Container__.type>
    </Root__.type>
  );
}
