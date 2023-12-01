import { ResponsiveValue } from "../types";

export type UnwrapResponsiveValue<T> = T extends ResponsiveValue<infer Value>
  ? Value
  : never;
