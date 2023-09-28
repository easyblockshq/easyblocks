import { mapProduct } from "./mapProduct";
import fetchShopify from "./fetchShopify";
import { fetchProductsByIdsQuery } from "./graphql/fetchProductsByIds";
import { ShopifyProduct } from "./types";
import { fetchProducts } from "./fetchProducts";

export const fetchProductsByIds = async (
  ids: string[],
  options: { includeRelated: boolean } = { includeRelated: false }
): Promise<ShopifyProduct[]> => {
  const data: any = await fetchShopify(fetchProductsByIdsQuery, {
    ids,
  });

  const products: ShopifyProduct[] = data.nodes
    .map(mapProduct)
    .filter((product: any) => !!product);

  if (options.includeRelated) {
    await Promise.all(
      products.map(async (product) => {
        const relatedTag = product.tags?.find((tag: any) =>
          tag.startsWith("related")
        );
        const relatedProducts = await fetchProducts("tag:" + relatedTag);
        product.relatedProducts = relatedProducts;
      })
    );
  }

  return products;
};
