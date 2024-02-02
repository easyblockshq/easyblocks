"use client";
import type { Widget, WidgetComponentProps } from "@easyblocks/core";

import { fetchProductById, fetchProducts } from "@/data/shopify";
import { SimplePicker } from "@easyblocks/design-system";

import { PRODUCT_WIDGET_ID } from "./productShared";

export const productWidget: Widget = {
  id: PRODUCT_WIDGET_ID,
  label: "Product",
};

export function ProductPicker({ id, onChange }: WidgetComponentProps<string>) {
  return (
    <SimplePicker
      value={id}
      onChange={onChange}
      getItems={async (query) => {
        const products = await fetchProducts(query);

        return products.map((product: any) => ({
          id: product.id,
          title: product.title,
          thumbnail: product.primaryImage?.mediaObject?.src,
        }));
      }}
      getItemById={async (id) => {
        const product = await fetchProductById(id);
        if (!product) {
          throw new Error("can't find product");
        }

        return {
          id: product.id,
          title: product.title,
          thumbnail: product.primaryImage?.mediaObject?.src,
        };
      }}
      placeholder="Pick a product"
    />
  );
}
