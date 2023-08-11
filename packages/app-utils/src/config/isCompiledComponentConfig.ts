import type { CompiledShopstoryComponentConfig } from "@easyblocks/core";

export function isCompiledComponentConfig(
  arg: any
): arg is CompiledShopstoryComponentConfig {
  return (
    typeof arg === "object" &&
    arg !== null &&
    typeof arg._template === "string" &&
    typeof arg._id === "string" &&
    typeof arg.actions === "object" &&
    typeof arg.components === "object"
  );
}
