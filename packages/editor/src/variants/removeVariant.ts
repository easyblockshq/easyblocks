import { Form } from "@easyblocks/app-utils";
import { deepClone, dotNotationGet } from "@easyblocks/utils";
import { VariantsRepository } from "../types";

function removeVariant({
  form,
  path,
  id,
  groupId,
}: {
  form: Form;
  path: string;
  id: string;
  groupId: string;
}) {
  const repository = deepClone<VariantsRepository>(form.values._variants ?? {});

  const variants = repository[groupId] ?? [];

  const variantIndex = variants.findIndex((v) => v._id === id);

  if (variantIndex < 0) {
    return;
  }

  variants.splice(variantIndex, 1);

  if (variants.length === 0) {
    delete repository[groupId];
  }

  form.change("_variants", repository);

  const currentVariant = dotNotationGet(form.values, path);
  if (currentVariant._id === id) {
    if (variants.length > 0) {
      form.change(path, variants[Math.max(0, variantIndex - 1)]);
    } else {
      delete currentVariant._variantGroupId;
      delete currentVariant._audience;
      form.change(path, currentVariant);
    }
  }
}

export { removeVariant };
