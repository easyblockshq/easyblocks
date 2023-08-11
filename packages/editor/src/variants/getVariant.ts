import { ConfigComponent } from "@easyblocks/core";
import curry from "lodash/curry";
import { VariantsRepository } from "../types";
import { getVariantsGroup } from "./getVariantsGroup";

function getVariant(
  repository: VariantsRepository,
  matcher: (variant: ConfigComponent) => boolean,
  originalConfig: ConfigComponent
): ConfigComponent {
  const variants = getVariantsGroup(
    repository,
    originalConfig?._variantGroupId ?? ""
  );
  return variants.find(matcher) ?? originalConfig;
}

const curried = curry(getVariant);

export { curried as getVariant };
