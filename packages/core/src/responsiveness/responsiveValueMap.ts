import { ResponsiveValue, TrulyResponsiveValue } from "../types";
import { UnwrapResponsiveValue } from "./types";
import { isTrulyResponsiveValue } from "./isTrulyResponsiveValue";
import { responsiveValueEntries } from "./responsiveValueEntries";

type InferReturnType<
  Type extends ResponsiveValue<unknown>,
  MappedType
> = Type extends TrulyResponsiveValue<unknown>
  ? TrulyResponsiveValue<MappedType>
  : MappedType;

export function responsiveValueMap<
  Input extends ResponsiveValue<unknown>,
  Output
>(
  resVal: Input,
  mapper: (
    val: UnwrapResponsiveValue<Input>,
    breakpointIndex?: string
  ) => Output
): InferReturnType<Input, Output> {
  if (!isTrulyResponsiveValue(resVal)) {
    return mapper(resVal as UnwrapResponsiveValue<Input>) as InferReturnType<
      Input,
      Output
    >;
  }

  const ret: TrulyResponsiveValue<Output> = { $res: true };

  responsiveValueEntries(resVal).forEach(([key, value]) => {
    ret[key] = mapper(value as UnwrapResponsiveValue<Input>, key);
  });

  return ret as InferReturnType<Input, Output>;
}
