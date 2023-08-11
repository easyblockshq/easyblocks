import { Form } from "@easyblocks/app-utils";
import { dotNotationGet } from "@easyblocks/utils";
import { getVariant } from "./getVariant";
import { byId } from "./matchers";
import { storeVariant } from "./storeVariant";

const selectVariant = ({
  form,
  id,
  path,
}: {
  form: Form;
  id: string;
  path: string;
}) => {
  const currentVariant = dotNotationGet(form.values, path);
  const updatedRepository = storeVariant(form.values._variants, currentVariant);

  const resolvedVariant = getVariant(
    updatedRepository,
    byId(id),
    currentVariant
  );

  form.change(path, resolvedVariant);
  form.change("_variants", updatedRepository);
};

export { selectVariant };
