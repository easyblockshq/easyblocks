import type { CompiledShopstoryComponentConfig } from "./types";

export function isCompiledComponentConfig(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
