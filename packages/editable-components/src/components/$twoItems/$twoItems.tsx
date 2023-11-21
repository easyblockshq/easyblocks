import React, { ReactElement } from "react";

function TwoItems(props: {
  Container: ReactElement;
  Items: Array<ReactElement>;
  outerWrappers: Array<ReactElement>;
  innerWrappers: Array<ReactElement>;
}) {
  const { Container, Items, outerWrappers, innerWrappers } = props;

  return (
    <Container.type {...Container.props}>
      {Items.map((Item, index) => {
        const OuterWrapper = outerWrappers[index];
        const InnerWrapper = innerWrappers[index];

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
