import {
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentSchemaProp,
} from "@easyblocks/core";
import {
  ComponentBuilder,
  ComponentBuilderProps,
  ContextProps,
} from "@easyblocks/core/_internals";
import React, { FC } from "react";
import { BlocksControls } from "./BlockControls";

type EditableComponentBuilderProps = ComponentBuilderProps & {
  schemaProp:
    | ComponentSchemaProp
    | ComponentCollectionSchemaProp
    | ComponentCollectionLocalisedSchemaProp;
  contextProps: ContextProps;
  index: number;
  length: number;
};

type EditableComponentBuilderComponent = FC<EditableComponentBuilderProps>;

function EditableComponentBuilder(props: EditableComponentBuilderProps) {
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
      />
    </BlocksControls>
  );

  return content;
}

export default EditableComponentBuilder;
export type {
  EditableComponentBuilderComponent,
  EditableComponentBuilderProps,
};
