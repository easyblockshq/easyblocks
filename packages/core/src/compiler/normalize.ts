import { ConfigComponent } from "../types";
import { buildFullTheme } from "./buildFullTheme";
import { normalizeComponent } from "./definitions";
import { CompilationContextType } from "./types";

export function normalize(
  configComponent: Omit<ConfigComponent, "_id"> & { _id?: string },
  compilationContext: CompilationContextType
): ConfigComponent {
  const compilationContextWithFullTheme = {
    ...compilationContext,
    theme: buildFullTheme(compilationContext.theme),
  };

  return normalizeComponent(configComponent, compilationContextWithFullTheme);
}
