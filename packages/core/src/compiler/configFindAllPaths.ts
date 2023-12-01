import { ConfigComponent } from "../types";
import { traverseComponents } from "./traverseComponents";
import { CompilationContextType } from "./types";

function configFindAllPaths<T extends ConfigComponent>(
  config: ConfigComponent,
  editorContext: CompilationContextType,
  predicate: (
    config: ConfigComponent,
    editorContext: CompilationContextType
  ) => config is T
): Array<string> {
  const matchedConfigPaths: Array<string> = [];

  traverseComponents(config, editorContext, ({ path, componentConfig }) => {
    if (predicate(componentConfig, editorContext)) {
      matchedConfigPaths.push(path);
    }
  });

  return matchedConfigPaths;
}

export { configFindAllPaths };
