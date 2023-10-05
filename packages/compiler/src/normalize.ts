import { CompilationContextType } from "@easyblocks/app-utils";
import { ConfigComponent } from "@easyblocks/core";
import { buildFullTheme } from "./buildFullTheme";
import { normalizeComponent } from "./definitions";

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
