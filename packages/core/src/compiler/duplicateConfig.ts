import { deepClone, uniqueId } from "@easyblocks/utils";
import { ConfigComponent } from "../types";
import { configTraverse } from "./configTraverse";
import { traverseComponents } from "./traverseComponents";
import { CompilationContextType } from "./types";

export function duplicateConfig<
  ConfigType extends ConfigComponent = ConfigComponent
>(inputConfig: ConfigType, compilationContext: CompilationContextType) {
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
