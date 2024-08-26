import { EditorWindowAPI } from "@SweenyStudio/easyblocks-editor";

declare global {
  interface Window {
    editorWindowAPI: EditorWindowAPI;
    isShopstoryEditor?: boolean;
  }
}
