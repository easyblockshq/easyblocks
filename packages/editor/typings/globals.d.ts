import type { EditorWindowAPI } from "./types";

declare global {
  interface Window {
    editorWindowAPI: EditorWindowAPI;
    isShopstoryEditor?: boolean;
  }
}
