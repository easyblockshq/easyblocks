import { GetServerSideProps } from "next";
import { Shopstory, ShopstoryProvider } from "../../../../../src/Shopstory";
import { contentfulLandingPageProvider } from "../../../../../src/demos/away/contentful/nextPages/shopstoryBlock/contentfulLandingPageProvider";
import { contentfulLandingPageGetServerSidePropsProvider } from "../../../../../src/demos/away/contentful/nextPages/shopstoryBlock/contentfulLandingPageGetServerSidePropsProvider";
import { contentfulPlugin } from "../../../../../src/cms/contentful";

export default contentfulLandingPageProvider(Shopstory, ShopstoryProvider);

export const getServerSideProps: GetServerSideProps =
  contentfulLandingPageGetServerSidePropsProvider(contentfulPlugin);
