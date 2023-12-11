import { isDocument } from "../checkers";
import { ContextParams } from "../types";

function getRootContainer(content: unknown, options: ContextParams): string {
  // If this is a document and `rootContainer` is defined, let's use it.
  if (isDocument(content) && content.rootContainer !== null) {
    return content.rootContainer;
  }

  return options.rootContainer;
}

export { getRootContainer };
