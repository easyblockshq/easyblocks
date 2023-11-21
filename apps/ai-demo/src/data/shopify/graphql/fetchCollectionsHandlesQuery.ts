import { gql } from "graphql-request";

export const fetchCollectionsHandlesQuery = gql`
  query collections {
    collections(first: 250) {
      edges {
        node {
          id
          handle
        }
      }
    }
  }
`;
