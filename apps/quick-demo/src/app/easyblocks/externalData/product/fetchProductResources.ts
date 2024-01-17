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
    ([, resource]) => resource.id === null
  );
  const productResources = allResources.filter(
    ([, resource]) => resource.id !== null
  );

  const productIds = productResources.map(
    ([, resource]) => resource.id
  ) as string[];

  const result: any = {};

  deletedResources.forEach(([fieldId]) => {
    result[fieldId] = undefined;
  });

  try {
    const products = await fetchProductsByIds(productIds, {
      includeRelated: true,
    });

    productResources.forEach(([fieldId, { id }]) => {
      const product = products.find(
        (product) => decodeObjectId(product.id) === decodeObjectId(id as string)
      );

      if (!product) {
        result[fieldId] = {
          error: `Couldn't fetch product with id: ${id}`,
        };
      } else {
        result[fieldId] = {
          type: "object",
          value: {
            self: {
              type: "product",
              value: product,
            },
            productTitle: {
              type: "text",
              value: product.title,
            },
            ...(product.primaryImage &&
              product.primaryImage.mediaType === "image" && {
                productPrimaryImage: {
                  type: "@easyblocks/image",
                  value: {
                    url: product.primaryImage.mediaObject.src,
                    alt: product.primaryImage.mediaObject.alt,
                    aspectRatio:
                      product.primaryImage.mediaObject.width /
                      product.primaryImage.mediaObject.height,
                    mimeType: product.primaryImage.mediaObject.format,
                    srcset: [
                      {
                        w: product.primaryImage.mediaObject.width,
                        h: product.primaryImage.mediaObject.height,
                        url: product.primaryImage.mediaObject.src,
                      },
                    ],
                  },
                },
              }),
          },
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
