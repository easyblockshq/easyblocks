import { gql } from "graphql-request";
import { VariantFragment } from "./variantFragment";

export const PRODUCT_FRAGMENT = gql`
  ${VariantFragment}
  fragment ProductFragment on Product {
    id
    handle
    tags
    productType
    publishedAt
    descriptionHtml
    title
    vendor
    description
    collections(first: 5) {
      edges {
        node {
          title
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          ...VariantFragment
        }
      }
    }
    images(first: 20) {
      edges {
        node {
          originalSrc
          width
          height
          id
          altText
        }
      }
    }
    media(first: 20) {
      edges {
        node {
          mediaContentType
          alt
          ... on MediaImage {
            image {
              originalSrc
              width
              height
              id
              altText
            }
          }
          ... on Video {
            sources {
              url
              mimeType
              format
              height
              width
            }
          }
        }
      }
    }
  }
`;
export const PRODUCT_FRAGMENT_SLIM = gql`
  ${VariantFragment}
  fragment ProductFragmentSlim on Product {
    id
    handle
    tags
    productType
    publishedAt
    descriptionHtml
    title
    vendor
    collections(first: 5) {
      edges {
        node {
          title
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          ...VariantFragment
        }
      }
    }
    images(first: 2) {
      edges {
        node {
          originalSrc
          width
          height
          id
          altText
        }
      }
    }
  }
`;

export const PRODUCTS_FRAGMENT = gql`
  ${PRODUCT_FRAGMENT_SLIM}
  fragment ProductsFragment on ProductConnection {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        ...ProductFragmentSlim
      }
    }
  }
`;
