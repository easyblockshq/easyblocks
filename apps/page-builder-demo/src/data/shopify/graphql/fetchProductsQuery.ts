import { gql } from "graphql-request";
import { PRODUCTS_FRAGMENT } from "./productFragment";

export const fetchProductsQuery = gql`
  ${PRODUCTS_FRAGMENT}
  query products(
    $cursor: String
    $query: String!
    $sortKey: ProductSortKeys!
    $reverse: Boolean!
    $first: Int!
  ) {
    products(
      first: $first
      after: $cursor
      query: $query
      sortKey: $sortKey
      reverse: $reverse
    ) {
      ...ProductsFragment
    }
  }
`;
