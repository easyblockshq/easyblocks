import type { ConfigComponent } from "@easyblocks/core";
import { VariantsRepository } from "../types";

const storeVariant = (
  repository: VariantsRepository,
  variant: ConfigComponent
): VariantsRepository => {
  const repoCopy: VariantsRepository = JSON.parse(
    JSON.stringify(repository ?? {})
  );

  if (!variant._variantGroupId) {
    return repoCopy;
  }

  if (!(variant._variantGroupId in repoCopy)) {
    repoCopy[variant._variantGroupId] = [];
  }

  const variants = repoCopy[variant._variantGroupId];

  const index = variants.findIndex((v) => v._id === variant._id);

  if (index === -1) {
    variants.push(variant);
  } else {
    variants.splice(index, 1, variant);
  }

  return repoCopy;
};

export { storeVariant };
