import { Canvas } from "../../../../src/editor/Canvas";
import { contentfulEditorPageProvider } from "../../../../src/demos/away/contentful/nextPages/editor/contentfulEditorPageProvider";
import { ShopstoryProvider } from "../../../../src/Shopstory";
import { contentfulPlugin } from "../../../../src/contentful";

export default contentfulEditorPageProvider(
  Canvas,
  ShopstoryProvider,
  contentfulPlugin
);
