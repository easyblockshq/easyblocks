import { isDocument } from "../checkers";
import { ContextParams, EditorLauncherProps } from "../types";

function getRootContainer(
  content: unknown,
  options: ContextParams
): EditorLauncherProps["rootContainer"] {
  // If this is a document and `rootContainer` is defined, let's use it.
  if (isDocument(content) && content.rootContainer !== null) {
    return content.rootContainer;
  }

  return options.rootContainer;
}

export { getRootContainer };
