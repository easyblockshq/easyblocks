import products from "./products.json";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type Product = {
  id: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  imageSecondary?: string;
};

export const MockProductsService = {
  searchProducts: async (query: string): Promise<Product[]> => {
    await sleep(500);
    return products.filter((product) =>
      product.title.match(new RegExp(`${query}`, "i"))
    );
  },
  getProductById: async (id: string): Promise<Product | undefined> => {
    await sleep(500);
    return products.find((product) => product.id === id);
  },
  getProductsByIds: async (ids: string[]): Promise<Product[]> => {
    await sleep(500);
    return products.filter((product) => ids.includes(product.id));
  },
};
