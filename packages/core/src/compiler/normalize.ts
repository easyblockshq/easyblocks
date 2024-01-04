import { ComponentConfig } from "../types";
import { buildFullTheme } from "./buildFullTheme";
import { normalizeComponent } from "./definitions";
import { CompilationContextType } from "./types";

export function normalize(
  configComponent: Omit<ComponentConfig, "_id"> & { _id?: string },
  compilationContext: CompilationContextType
): ComponentConfig {
  const compilationContextWithFullTheme = {
    ...compilationContext,
    theme: buildFullTheme(compilationContext.theme),
  };

  return normalizeComponent(configComponent, compilationContextWithFullTheme);
}
