import { SSRangeSlider } from "@easyblocks/design-system";
import React from "react";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";

type SliderProps = {
  min: number;
  max: number;
  step?: number;
};

const Slider = wrapFieldsWithMeta<any, SliderProps>(({ input, field }) => {
  return (
    <SSRangeSlider
      {...input}
      max={field.max}
      min={field.min}
      step={field.step}
    />
  );
});

export const SliderFieldPlugin = {
  __type: "field",
  name: "slider",
  Component: Slider,
};
