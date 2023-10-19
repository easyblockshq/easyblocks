import { ChangedExternalData, ExternalData, Widget } from "@easyblocks/core";

import { fetchProductsByIds } from "@/data/shopify";

import { PRODUCT_WIDGET_ID } from "./productShared";

async function fetchProductResources(
  externalData: ChangedExternalData
): Promise<ExternalData> {
  const allResources = Object.entries(externalData).filter(
    ([, resource]) => resource.widgetId === PRODUCT_WIDGET_ID
  );

  if (allResources.length === 0) {
    return {};
  }

  const deletedResources = allResources.filter(
    ([, resource]) => resource.externalId === null
  );
  const productResources = allResources.filter(
    ([, resource]) => resource.externalId !== null
  );

  const productIds = productResources.map(
    ([, resource]) => resource.externalId
  ) as string[];

  const result: any = {};

  deletedResources.forEach(([fieldId]) => {
    result[fieldId] = undefined;
  });

  try {
    const products = await fetchProductsByIds(productIds, {
      includeRelated: true,
    });

    productResources.forEach(([fieldId, { externalId }]) => {
      const product = products.find(
        (product) =>
          decodeObjectId(product.id) === decodeObjectId(externalId as string)
      );

      if (!product) {
        result[fieldId] = {
          error: `Couldn't fetch product with id: ${externalId}`,
        };
      } else {
        result[fieldId] = {
          type: "product",
          value: product,
        };
      }
    });
  } catch (e) {
    console.error(e);

    productResources.forEach(([fieldId]) => {
      result[fieldId] = {
        error: "Couldn't fetch product data from Shopify",
      };
    });
  }

  return result;
}

function decodeObjectId(id: string) {
  if (isGid(id)) return id;

  return typeof window === "undefined"
    ? Buffer.from(id, "base64").toString("utf-8")
    : window.atob(id);
}

function isGid(id: string) {
  return id.startsWith("gid://shopify/");
}

export { fetchProductResources };
