import React, { ReactElement } from "react";

function RootGrid(props: any) {
  const Data = props.data as ReactElement;
  return <Data.type {...Data.props} />;
}

export default RootGrid;
