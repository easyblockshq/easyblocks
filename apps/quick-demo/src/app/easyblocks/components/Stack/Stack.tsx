import React, { ReactElement } from "react";

function Stack(props: {
  StackContainer: ReactElement;
  Items: Array<ReactElement>;
  outerItemWrappers: Array<ReactElement>;
  innerItemWrappers: Array<ReactElement>;
}) {
  const { StackContainer, Items, outerItemWrappers, innerItemWrappers } = props;

  return (
    <StackContainer.type {...StackContainer.props}>
      {Items.map((Item, index) => {
        const StackItemOuter = outerItemWrappers[index];
        const StackItemInner = innerItemWrappers[index];

        return (
          <StackItemOuter.type {...StackItemOuter.props} key={index}>
            <StackItemInner.type {...StackItemInner.props}>
              <Item.type {...Item.props} />
            </StackItemInner.type>
          </StackItemOuter.type>
        );
      })}
    </StackContainer.type>
  );
}

export { Stack };
