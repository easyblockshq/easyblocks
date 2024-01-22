import { ComponentConfig } from "../types";
import { normalizeComponent } from "./definitions";
import { CompilationContextType } from "./types";

export function normalize(
  configComponent: Omit<ComponentConfig, "_id"> & { _id?: string },
  compilationContext: CompilationContextType
): ComponentConfig {
  return normalizeComponent(configComponent, compilationContext);
}
