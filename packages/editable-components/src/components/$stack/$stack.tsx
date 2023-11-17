import React, { ReactElement } from "react";

function Stack(props: {
  StackContainer: ReactElement;
  Items: Array<ReactElement>;
  itemWrappers: Array<{
    StackItemOuter: ReactElement;
    StackItemInner: ReactElement;
  }>;
}) {
  const { StackContainer, Items, itemWrappers } = props;

  return (
    <StackContainer.type {...StackContainer.props}>
      {Items.map((Item, index) => {
        const StackItemOuter = itemWrappers[index].StackItemOuter;
        const StackItemInner = itemWrappers[index].StackItemInner;

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

export default Stack;
