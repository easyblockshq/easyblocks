import { NoCodeComponentEntry } from "../types";
import { traverseComponents } from "./traverseComponents";
import { CompilationContextType } from "./types";

function configFindAllPaths<T extends NoCodeComponentEntry>(
  config: NoCodeComponentEntry,
  editorContext: CompilationContextType,
  predicate: (
    config: NoCodeComponentEntry,
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
