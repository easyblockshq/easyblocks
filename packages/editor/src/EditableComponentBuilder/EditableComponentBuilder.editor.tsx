import {
  ComponentBuilder,
  ComponentBuilderProps,
} from "@easyblocks/core/_internals";
import React, { Ref, forwardRef } from "react";
import { BlocksControls } from "./BlockControls";

type EditableComponentBuilderProps = ComponentBuilderProps & {
  index: number;
  length: number;
};

const EditableComponentBuilder = forwardRef(function EditableComponentBuilder(
  props: EditableComponentBuilderProps,
  ref: Ref<unknown>
) {
  const { path, compiled, index, length, components, ...restPassedProps } =
    props;

  const content = (
    <BlocksControls
      path={path}
      id={compiled._id}
      templateId={compiled._component}
      disabled={compiled.__editing?.noInline}
      direction={compiled.__editing?.direction ?? "vertical"}
      compiled={compiled}
      index={index}
      length={length}
    >
      <ComponentBuilder
        compiled={compiled}
        path={path}
        passedProps={restPassedProps}
        components={components}
        ref={ref}
      />
    </BlocksControls>
  );

  return content;
});

export default EditableComponentBuilder;
