import { ComponentConfig } from "../types";
import { traverseComponents } from "./traverseComponents";
import { CompilationContextType } from "./types";

function configFindAllPaths<T extends ComponentConfig>(
  config: ComponentConfig,
  editorContext: CompilationContextType,
  predicate: (
    config: ComponentConfig,
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
