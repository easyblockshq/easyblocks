import { gql } from "graphql-request";
import { PRODUCTS_FRAGMENT } from "./productFragment";

export const COLLECTION_FRAGMENT = gql`
  ${PRODUCTS_FRAGMENT}
  fragment CollectionFragment on Collection {
    title
    id
    handle
    descriptionHtml
    products(first: 250, after: $lastProductCursor) {
      ...ProductsFragment
    }
  }
`;

export const fetchCollectionByHandleQuery = gql`
  ${COLLECTION_FRAGMENT}
  query collectionByHandle($handle: String!, $lastProductCursor: String) {
    collectionByHandle(handle: $handle) {
      ...CollectionFragment
    }
  }
`;
