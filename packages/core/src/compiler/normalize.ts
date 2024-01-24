import { NoCodeComponentEntry } from "../types";
import { normalizeComponent } from "./definitions";
import { CompilationContextType } from "./types";

export function normalize(
  configComponent: Omit<NoCodeComponentEntry, "_id"> & { _id?: string },
  compilationContext: CompilationContextType
): NoCodeComponentEntry {
  return normalizeComponent(configComponent, compilationContext);
}
