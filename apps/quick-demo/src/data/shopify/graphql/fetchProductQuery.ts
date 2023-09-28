import { gql } from "graphql-request";
import { PRODUCT_FRAGMENT, PRODUCT_FRAGMENT_SLIM } from "./productFragment";

export const fetchProductByIdQuery = gql`
  ${PRODUCT_FRAGMENT}
  query product($id: ID!) {
    node(id: $id) {
      ...ProductFragment
    }
  }
`;

export const fetchProductByHandleQuery = gql`
  ${PRODUCT_FRAGMENT}
  query productByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFragment
    }
  }
`;

export const fetchProductByHandleQuerySlim = gql`
  ${PRODUCT_FRAGMENT_SLIM}
  query productByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFragmentSlim
    }
  }
`;
