import { gql } from "graphql-request";

export const fetchProductsHandlesQuery = gql`
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
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          handle
        }
      }
    }
  }
`;
