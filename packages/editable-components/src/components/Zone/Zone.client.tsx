/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { Fragment } from "react";

const Zone = (props: any) => {
  const blocks = props.__fromEditor.components.blocks;

  return (
    <Fragment>
      {blocks.map((Block: any, index: number) => (
        <Block key={index} />
      ))}
    </Fragment>
  );
};

export default Zone;
