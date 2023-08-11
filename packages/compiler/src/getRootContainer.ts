import { CompilationContextType } from "@easyblocks/app-utils";
import {
  EditorLauncherProps,
  isDocument,
  ShopstoryClientAddOptions,
} from "@easyblocks/core";

function getRootContainer(
  content: unknown,
  options: ShopstoryClientAddOptions
): EditorLauncherProps["rootContainer"] {
  // If this is a document and `rootContainer` is defined, let's use it.
  if (isDocument(content) && content.rootContainer !== null) {
    return content.rootContainer;
  }

  // For backwards compatibility, use `mode` value if provided.
  if (options.mode) {
    return options.mode;
  }

  return "content";
}

export { getRootContainer };
