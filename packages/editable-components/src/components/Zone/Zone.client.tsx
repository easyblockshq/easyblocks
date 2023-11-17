import React, { Fragment, ReactElement } from "react";

const Zone = (props: { blocks: Array<ReactElement> }) => {
  const blocks = props.blocks;

  return (
    <Fragment>
      {blocks.map((Block, index) => (
        <Block.type {...Block.props} key={index} />
      ))}
    </Fragment>
  );
};

export default Zone;
