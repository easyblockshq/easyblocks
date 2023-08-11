import { GetServerSideProps } from "next";

import {
  Shopstory,
  ShopstoryGrid,
  ShopstoryProvider,
} from "../../../../src/Shopstory";
import { noCMSRenderConfigGetServerSidePropsProvider } from "../../../../src/demos/away/nocms/nextPages/render-config/noCMSRenderConfigGetServerSidePropsProvider";
import { noCMSRenderConfigPageProvider } from "../../../../src/demos/away/nocms/nextPages/render-config/noCMSRenderConfigPageProvider";

export default noCMSRenderConfigPageProvider(
  Shopstory,
  ShopstoryGrid,
  ShopstoryProvider
);
export const getServerSideProps: GetServerSideProps =
  noCMSRenderConfigGetServerSidePropsProvider();
