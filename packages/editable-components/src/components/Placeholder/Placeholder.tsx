/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { ComponentType } from "react";

function Placeholder(props: {
  __fromEditor: {
    components: {
      Image: ComponentType;
      Title: ComponentType;
      Desc: ComponentType;
    };
  };
}) {
  const { Image, Title, Desc } = props.__fromEditor.components;

  return (
    <div>
      <Image />
      <Title />
      <Desc />
    </div>
  );
}

export default Placeholder;
