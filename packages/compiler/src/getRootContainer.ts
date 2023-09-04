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

  return options.rootContainer;
}

export { getRootContainer };
