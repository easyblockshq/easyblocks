import { mapProduct } from "./mapProduct";
import { removeEdges } from "./removeEdges";
import fetchShopify from "./fetchShopify";
import { fetchProductsQuery } from "./graphql/fetchProductsQuery";

const fetchProducts = async (query: string) => {
  const data: any = await fetchShopify(fetchProductsQuery, {
    query,
    sortKey: "CREATED_AT",
    sortIndex: 0,
    reverse: false,
    first: 250,
  });

  return removeEdges(data.products).map(mapProduct);
};

export { fetchProducts };
