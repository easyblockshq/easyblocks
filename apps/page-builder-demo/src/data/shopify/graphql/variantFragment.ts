import { gql } from "graphql-request";

export const VariantFragment = gql`
  fragment VariantFragment on ProductVariant {
    availableForSale
    id
    title
    quantityAvailable
    currentlyNotInStock
    selectedOptions {
      name
      value
    }
    priceV2 {
      amount
      currencyCode
    }
    compareAtPriceV2 {
      amount
      currencyCode
    }
    product {
      id
    }
    sku
  }
`;
