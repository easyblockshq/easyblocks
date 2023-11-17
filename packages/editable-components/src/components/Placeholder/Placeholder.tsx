import React, { ReactElement } from "react";

function Placeholder(props: {
  Image: ReactElement;
  Title: ReactElement;
  Desc: ReactElement;
}) {
  const { Image, Title, Desc } = props;

  return (
    <div>
      <Image.type {...Image.props} />
      <Title.type {...Title.props} />
      <Desc.type {...Desc.props} />
    </div>
  );
}

export default Placeholder;
