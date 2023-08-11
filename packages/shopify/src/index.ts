// FIXME: this is duplication from ss-design system. This is required no tto load entire @easyblocks/design-system here. It made compilation of Contentful package go wrong.
import { GraphQLClient, gql } from "graphql-request";
import { ExternalFieldItemPicker } from "@easyblocks/core";

const productFields = `
                    id,
                    handle,
                    title,
                    priceRange {
                        minVariantPrice {
                            amount
                        }
                        maxVariantPrice {
                            amount
                        }
                    }
                     images(first: 1) {
            				edges {
                      node {
                        id,
                        transformedSrc(maxWidth: 400, maxHeight: 400)
                        
                        
                      }
                    }
                  }
                    `;
const productsQuery = gql`
    query getProducts($query: String) {
        products(first: 100, query: $query) {
            edges {
                node {
                    ${productFields}
                }
            }
        }
    }
`;

const productByIdQuery = gql`
query getProduct($id: ID!) {
  node(id: $id) {
    ...on Product {
        ${productFields}
    }
  }
}
`;

const productByHandleQuery = gql`
query getProduct($id: String!) {
  productByHandle(handle: $id) {
    ${productFields}
  }
}
`;

/**
 * @public
 */
export type ShopifyAPISettings = {
  store: string;
  storefrontAccessToken: string;
  useHandleAsId?: boolean;
};

/**
 * @public
 */
export const shopifyProductPickerField = (
  options: ShopifyAPISettings
): ExternalFieldItemPicker => {
  const storeName: string = options.store;
  const storefrontAccessToken: string = options.storefrontAccessToken;

  const client = new GraphQLClient(
    `https://${storeName}.myshopify.com/api/2020-07/graphql.json`
  );

  const useHandleAsId = !!options.useHandleAsId;

  return {
    type: "item-picker",
    getItems: (query) => {
      return new Promise((resolve, reject) => {
        client
          .request(
            productsQuery,
            { query },
            { "X-Shopify-Storefront-Access-Token": storefrontAccessToken }
          )
          .then((data) => {
            const products = data.products.edges.map((x: any) => ({
              id: useHandleAsId ? x.node.handle : x.node.id,
              title: x.node.title,
              thumbnail: x.node.images.edges[0]?.node.transformedSrc,
            }));

            resolve(products);
          })
          .catch((error) => {
            console.error("graphql error!!!", error);
            reject(error);
          });
      });
    },

    getItemById: (id) => {
      return new Promise((resolve, reject) => {
        client
          .request(
            useHandleAsId ? productByHandleQuery : productByIdQuery,
            { id },
            { "X-Shopify-Storefront-Access-Token": storefrontAccessToken }
          )
          .then((data) => {
            const product = useHandleAsId ? data.productByHandle : data.node;

            resolve({
              id: useHandleAsId ? product.handle : product.id,
              title: product.title,
              thumbnail: product.images.edges[0].node.transformedSrc,
            });
          })
          .catch((error) => {
            console.error("graphql error!!!", error);
            reject(error);
          });
      });
    },
  };
};
