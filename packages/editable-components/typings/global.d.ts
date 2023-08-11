import type { EditorWindowAPI } from "@easyblocks/app-utils";

declare global {
  interface Window {
    editorWindowAPI: EditorWindowAPI;
    isShopstoryEditor?: boolean;
  }
}
