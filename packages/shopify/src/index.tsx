import type { Widget, WidgetComponentProps } from "@easyblocks/core";
import { SimplePicker } from "@easyblocks/design-system";
import { gql, GraphQLClient } from "graphql-request";
import React from "react";

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
export const shopifyProductWidget: Widget = {
  id: "@easyblocks/shopify",
  label: "Shopify",
};

/**
 * @public
 */
export function createShopifyProductPicker(options: ShopifyAPISettings) {
  const storeName: string = options.store;
  const storefrontAccessToken: string = options.storefrontAccessToken;

  const client = new GraphQLClient(
    `https://${storeName}.myshopify.com/api/2020-07/graphql.json`
  );

  const useHandleAsId = !!options.useHandleAsId;

  return function ShopifyProductPicker(props: WidgetComponentProps<string>) {
    return (
      <SimplePicker
        getItemById={(id) => {
          return new Promise((resolve, reject) => {
            client
              .request(
                useHandleAsId ? productByHandleQuery : productByIdQuery,
                { id },
                { "X-Shopify-Storefront-Access-Token": storefrontAccessToken }
              )
              .then((data) => {
                const product = useHandleAsId
                  ? data.productByHandle
                  : data.node;

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
        }}
        getItems={(query) => {
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
        }}
        onChange={(id) => {
          props.onChange(id);
        }}
        value={props.id}
      />
    );
  };
}
