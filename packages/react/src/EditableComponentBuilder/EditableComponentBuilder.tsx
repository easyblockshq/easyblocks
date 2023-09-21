import {
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentFixedSchemaProp,
  ComponentSchemaProp,
} from "@easyblocks/core";

import { ContextProps } from "@easyblocks/app-utils";

import React, { FC } from "react";
import { BlocksControls } from "./BlockControls";
import ComponentBuilder, {
  ComponentBuilderProps,
} from "../ComponentBuilder/ComponentBuilder";

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
  const { path, compiled, passedProps } = props;

  return (
    <BlocksControls path={path} disabled={compiled.__editing?.noInline}>
      <ComponentBuilder
        compiled={compiled}
        path={path}
        passedProps={passedProps}
      />
    </BlocksControls>
  );
}

export default EditableComponentBuilder;
export type {
  EditableComponentBuilderProps,
  EditableComponentBuilderComponent,
};
