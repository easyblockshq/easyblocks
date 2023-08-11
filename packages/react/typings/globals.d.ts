declare global {
  // eslint-disable-next-line no-var
  var __SHOPSTORY_REACT_SCOPE__: {
    React: typeof import("react");
    ReactDOM: typeof import("react-dom");
    createElement: typeof import("react").createElement;
  };

  interface Window {
    editorWindowAPI: any;
    isShopstoryEditor?: boolean;
  }
}

export {};
