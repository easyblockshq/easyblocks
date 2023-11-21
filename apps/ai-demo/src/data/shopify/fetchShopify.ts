import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(
  "https://shopstory-demo.myshopify.com/api/2022-01/graphql.json",
  {
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": "f8b32eaae0d2dc7996bfc02f2dc33b56",
    },
  }
);

async function fetchShopify(query: string, variables: any) {
  try {
    const data = await client.request(query, variables);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default fetchShopify;
