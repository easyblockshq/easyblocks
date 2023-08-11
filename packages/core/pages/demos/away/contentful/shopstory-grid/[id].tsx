import { GetServerSideProps } from "next";

import { ShopstoryGrid } from "../../../../../src/Shopstory";
import { contentfulGridPageGetServerSidePropsProvider } from "../../../../../src/demos/away/contentful/nextPages/grid/contentfulGridPageGetServerSidePropsProvider";
import { contentfulGridPageProvider } from "../../../../../src/demos/away/contentful/nextPages/grid/contentfulGridPageProvider";
import { ShopstoryProvider } from "../../../../../src/Shopstory";
import { contentfulPlugin } from "../../../../../src/cms/contentful";

export default contentfulGridPageProvider(ShopstoryGrid, ShopstoryProvider);

export const getServerSideProps: GetServerSideProps =
  contentfulGridPageGetServerSidePropsProvider(contentfulPlugin);
