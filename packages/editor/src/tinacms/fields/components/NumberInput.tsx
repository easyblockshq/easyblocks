import * as React from "react";
import { SSInput } from "@easyblocks/design-system";

export interface NumberProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  step?: string | number;
}

export const NumberInput: React.FC<NumberProps> = ({
  onChange,
  value,
  step,
  min,
  max,
}) => (
  <SSInput
    type="number"
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    step={step}
    value={value}
    onChange={onChange}
    min={min}
    max={max}
  />
);
