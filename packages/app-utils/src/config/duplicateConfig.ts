import { ConfigComponent } from "@easyblocks/core";
import { deepClone, uniqueId } from "@easyblocks/utils";
import { generateDefaultTraceId } from "../tracing/generateDefaultTraceId";
import { CompilationContextType } from "../types";
import { configTraverse } from "./configTraverse";
import { traverseComponents } from "./traverseComponents";

export function duplicateConfig<
  ConfigType extends ConfigComponent = ConfigComponent
>(inputConfig: ConfigType, compilationContext: CompilationContextType) {
  // deep copy first
  const config = deepClone(inputConfig);

  // refresh component ids and traceIds
  traverseComponents(config, compilationContext, ({ componentConfig }) => {
    componentConfig._id = uniqueId();
    componentConfig.traceId = generateDefaultTraceId(componentConfig);
  });

  // every text must get new local id
  configTraverse(config, compilationContext, ({ value, schemaProp }) => {
    if (schemaProp.type === "text") {
      value.id = "local." + uniqueId();
    }
  });

  return config;
}
