import React, { ReactElement } from "react";

function TwoItems(props: {
  Container: ReactElement;
  Items: Array<ReactElement>;
  itemWrappers: Array<{
    OuterWrapper: ReactElement;
    InnerWrapper: ReactElement;
  }>;
}) {
  const { Container, Items, itemWrappers } = props;

  return (
    <Container.type {...Container.props}>
      {Items.map((Item, index) => {
        const OuterWrapper = itemWrappers[index].OuterWrapper;
        const InnerWrapper = itemWrappers[index].InnerWrapper;

        return (
          <OuterWrapper.type {...OuterWrapper.props}>
            <InnerWrapper.type {...InnerWrapper.props}>
              <Item.type {...Item.props} />
            </InnerWrapper.type>
          </OuterWrapper.type>
        );
      })}
    </Container.type>
  );
}

export default TwoItems;
