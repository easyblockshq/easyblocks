import { GetServerSideProps } from "next";
import { Shopstory, ShopstoryProvider } from "../../../../../src/Shopstory";
import { contentfulLandingPageProvider } from "../../../../../src/demos/away/contentful/nextPages/shopstoryBlock/contentfulLandingPageProvider";
import { getServerSideProps as getServerSidePropsForLanding } from "../../../../../src/demos/away/contentful/nextPages/landing/getServerSideProps";
import { contentfulPlugin } from "../../../../../src/cms/contentful";

export default contentfulLandingPageProvider(Shopstory, ShopstoryProvider);
export const getServerSideProps: GetServerSideProps =
  getServerSidePropsForLanding(contentfulPlugin);
