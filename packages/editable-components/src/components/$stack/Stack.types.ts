import { Spacing } from "@easyblocks/core";

export type StackCompiledValues = {
  Items: Array<{
    _template: string;
    width: string;
    marginBottom: Spacing;
    align: string;
  }>;
  paddingLeft?: Spacing;
  paddingRight?: Spacing;
  paddingTop?: Spacing;
  paddingBottom?: Spacing;
  passedAlign?: string;
};
