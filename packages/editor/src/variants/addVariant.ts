import {
  CompilationContextType,
  duplicateConfig,
  Form,
} from "@easyblocks/app-utils";
import { ConfigComponent } from "@easyblocks/core";
import { uniqueId } from "@easyblocks/utils";
import { storeVariant } from "./storeVariant";

export const addVariant = ({
  form,
  context,
  audience,
  variant,
  path,
}: {
  form: Form;
  context: CompilationContextType;
  variant: ConfigComponent;
  audience: string;
  path: string;
}) => {
  const newVariant = duplicateConfig(variant, context);

  newVariant._variantGroupId = variant._variantGroupId ?? uniqueId();
  newVariant._audience = audience;

  const repository = storeVariant(form.values._variants, newVariant);

  form.change(`_variants`, repository);
  form.change(path, newVariant);
};
