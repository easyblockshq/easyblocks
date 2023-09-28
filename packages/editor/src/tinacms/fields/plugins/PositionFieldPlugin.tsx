import { InternalField } from "@easyblocks/app-utils";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import {
  Position,
  PositionPickerInput,
} from "../../../sidebar/PositionPickerInput";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";

function PositionField(
  props: FieldRenderProps<Position, HTMLInputElement> & { field: InternalField }
) {
  return (
    <PositionPickerInput
      position={props.input.value}
      onPositionChange={(position) => {
        props.input.onChange(position);
      }}
    />
  );
}

export const PositionFieldPlugin = {
  name: "position",
  Component: wrapFieldsWithMeta(PositionField),
};
