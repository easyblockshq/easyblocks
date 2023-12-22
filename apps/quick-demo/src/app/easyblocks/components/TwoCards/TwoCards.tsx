import React from "react";
import {
  SectionProps,
  SectionWrapper,
} from "@/app/easyblocks/components/utils/sectionWrapper/SectionWrapper";

function TwoCards(props: { _id: string } & Record<string, any> & SectionProps) {
  const { Card1, Card2, Card1Container, Card2Container, Root } = props;

  return (
    <SectionWrapper {...props}>
      <Root.type {...Root.props}>
        <Card1Container.type {...Card1Container.props}>
          <Card1.type {...Card1.props} />
        </Card1Container.type>

        <Card2Container.type {...Card2Container.props}>
          <Card2.type {...Card2.props} />
        </Card2Container.type>
      </Root.type>
    </SectionWrapper>
  );
}

export { TwoCards };
