import { Form } from "@easyblocks/app-utils";
import { deepClone } from "@easyblocks/utils";
import { VariantsRepository } from "../types";

function reorderVariant(
  form: Form,
  groupId: string,
  sourceIndex: number,
  destinationIndex?: number
) {
  if (destinationIndex === undefined) {
    return;
  }

  if (destinationIndex === sourceIndex) {
    return;
  }

  const repository = deepClone<VariantsRepository>(form.values._variants ?? {});

  const group = repository[groupId] ?? [];

  const [temp] = group.splice(sourceIndex, 1);
  group.splice(destinationIndex, 0, temp);

  form.change("_variants", repository);
}

export { reorderVariant };
