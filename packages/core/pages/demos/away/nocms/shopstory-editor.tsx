import { Canvas } from "../../../../src/editor/Canvas";
import { ShopstoryProvider } from "../../../../src/Shopstory";

import { noCMSEditorPageProvider } from "../../../../src/demos/away/nocms/nextPages/editor/noCMSEditorPageProvider";
import { noCMSEditorPageServerSidePropsProvider } from "../../../../src/demos/away/nocms/nextPages/editor/noCMSEditorPageServerSidePropsProvider";

export default noCMSEditorPageProvider(Canvas, ShopstoryProvider);

export const getServerSideProps = noCMSEditorPageServerSidePropsProvider;
