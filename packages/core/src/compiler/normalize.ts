import { SetOptional } from "type-fest";
import { NoCodeComponentEntry } from "../types";
import { normalizeComponent } from "./definitions";
import { CompilationContextType } from "./types";

export function normalize(
  configComponent: SetOptional<NoCodeComponentEntry, "_id">,
  compilationContext: CompilationContextType
): NoCodeComponentEntry {
  return normalizeComponent(configComponent, compilationContext);
}
