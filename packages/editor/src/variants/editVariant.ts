import { Form } from "@easyblocks/app-utils";
import { deepClone } from "@easyblocks/utils";
import { VariantsRepository } from "../types";
import { getVariant } from "./getVariant";
import { byId, firstMatchingVariantFor } from "./matchers";

function editVariant({
  form,
  groupId,
  id,
  path,
  newAudience,
}: {
  form: Form;
  groupId: string;
  id: string;
  newAudience: string;
  path: string;
}) {
  const repository = deepClone<VariantsRepository>(form.values._variants ?? {});
  const variants = repository[groupId ?? ""] ?? [];
  const variant = variants.find(byId(id));
  if (!variant) {
    return;
  }
  variant._audience = newAudience;

  const updatedVariant = getVariant(
    repository,
    firstMatchingVariantFor([newAudience]),
    variant
  );

  form.change(path, updatedVariant);
  form.change(`_variants`, repository);
}

export { editVariant };
