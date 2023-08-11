import {
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentFixedSchemaProp,
  ComponentSchemaProp,
} from "@easyblocks/core";

import { ContextProps } from "@easyblocks/app-utils";

import React, { FC } from "react";
import { BlocksControls } from "./BlockControls";
import { ComponentBuilderProps } from "../ComponentBuilder/ComponentBuilder";

type EditableComponentBuilderProps = ComponentBuilderProps & {
  schemaProp:
    | ComponentSchemaProp
    | ComponentFixedSchemaProp
    | ComponentCollectionSchemaProp
    | ComponentCollectionLocalisedSchemaProp;
  contextProps: ContextProps;
  index: number;
};

type EditableComponentBuilderComponent = FC<EditableComponentBuilderProps>;

function EditableComponentBuilder(props: EditableComponentBuilderProps) {
  const { path, compiled, passedProps, meta } = props;

  const ComponentBuilder = meta.code.ComponentBuilder;

  return (
    <BlocksControls
      path={path}
      disabled={compiled.__editing?.noInline}
      meta={meta}
    >
      <ComponentBuilder
        compiled={compiled}
        path={path}
        passedProps={passedProps}
        meta={meta}
      />
    </BlocksControls>
  );
}

export default EditableComponentBuilder;
export type {
  EditableComponentBuilderProps,
  EditableComponentBuilderComponent,
};
