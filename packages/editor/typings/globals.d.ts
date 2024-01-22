import { EditorWindowAPI } from "../src";

declare global {
  interface Window {
    editorWindowAPI: EditorWindowAPI;
    isShopstoryEditor?: boolean;
  }
}
