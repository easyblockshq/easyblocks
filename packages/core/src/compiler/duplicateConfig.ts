import { deepClone, uniqueId } from "@easyblocks/utils";
import { NoCodeComponentEntry } from "../types";
import { configTraverse } from "./configTraverse";
import { traverseComponents } from "./traverseComponents";
import { AnyContextWithDefinitions } from "../types";

export function duplicateConfig<
  ConfigType extends NoCodeComponentEntry = NoCodeComponentEntry
>(inputConfig: ConfigType, compilationContext: AnyContextWithDefinitions) {
  // deep copy first
  const config = deepClone(inputConfig);

  // refresh component ids
  traverseComponents(config, compilationContext, ({ componentConfig }) => {
    componentConfig._id = uniqueId();
  });

  // every text must get new local id
  configTraverse(config, compilationContext, ({ value, schemaProp }) => {
    if (schemaProp.type === "text") {
      value.id = "local." + uniqueId();
    }
  });

  return config;
}
