import { CompilationContextType, EditorContextType } from "../types";

function isContextEditorContext(
  context: CompilationContextType
): context is EditorContextType {
  return "form" in context;
}

export { isContextEditorContext };
