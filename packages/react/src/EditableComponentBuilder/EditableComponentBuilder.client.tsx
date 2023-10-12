import React from "react";
import ComponentBuilder from "../ComponentBuilder/ComponentBuilder";
import { EditableComponentBuilderProps } from "./EditableComponentBuilder.editor";

function EditableComponentBuilder(props: EditableComponentBuilderProps) {
  const { path, compiled, passedProps } = props;

  return (
    <ComponentBuilder
      compiled={compiled}
      path={path}
      passedProps={passedProps}
    />
  );
}

export default EditableComponentBuilder;
