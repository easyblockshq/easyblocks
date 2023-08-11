import React from "react";
import { EditableComponentBuilderProps } from "./EditableComponentBuilder";

function EditableComponentBuilder(props: EditableComponentBuilderProps) {
  const { path, compiled, passedProps, meta } = props;

  const ComponentBuilder = meta.code.ComponentBuilder;

  return (
    <ComponentBuilder
      compiled={compiled}
      path={path}
      passedProps={passedProps}
      meta={meta}
    />
  );
}

export default EditableComponentBuilder;
