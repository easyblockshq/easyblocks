import React, { ReactElement } from "react";

function TwoCards(props: Record<string, ReactElement>) {
  const { Card1, Card2, Card1Container, Card2Container, Root } = props;

  return (
    <Root.type {...Root.props}>
      <Card1Container.type {...Card1Container.props}>
        <Card1.type {...Card1.props} />
      </Card1Container.type>

      <Card2Container.type {...Card2Container.props}>
        <Card2.type {...Card2.props} />
      </Card2Container.type>
    </Root.type>
  );
}

export { TwoCards };
