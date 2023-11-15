import React, { Fragment, ReactElement } from "react";

function RootSections(props: {
  data: Array<ReactElement>;
  ItemWrappers: Array<ReactElement>;
}) {
  const { data, ItemWrappers: itemWrappers } = props;

  return (
    <Fragment>
      {data.map((Item, index) => {
        const ItemWrapper = itemWrappers[index];

        return (
          <ItemWrapper.type {...ItemWrapper.props} key={index}>
            <Item.type {...Item.props} />
          </ItemWrapper.type>
        );
      })}
    </Fragment>
  );
}

export default RootSections;
