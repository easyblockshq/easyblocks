import { isSchemaPropComponentOrComponentCollection } from "@easyblocks/app-utils";
import { ConfigComponent, SchemaProp } from "@easyblocks/core";
import curry from "lodash/curry";

function mapToVariant(
  variantGetter: (config: ConfigComponent) => ConfigComponent,
  {
    value,
    schemaProp,
  }: {
    value: any;
    schemaProp: SchemaProp;
  }
) {
  if (!isSchemaPropComponentOrComponentCollection(schemaProp)) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(variantGetter);
  }

  return variantGetter(value);
}

const curried = curry(mapToVariant);

export { curried as mapToVariant };
