import { gql } from "graphql-request";
import { PRODUCT_FRAGMENT_SLIM } from "./productFragment";

export const fetchProductsByIdsQuery = gql`
  ${PRODUCT_FRAGMENT_SLIM}
  query ($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        ...ProductFragmentSlim
      }
    }
  }
`;
