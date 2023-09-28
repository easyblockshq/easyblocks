import { ShopifyProduct, ShopifyProductColor } from "./types";
import { removeEdges } from "./removeEdges";

export const mapProduct = (product: any) => {
  const mapMedia = (media: any) => {
    if (media.mediaContentType === "IMAGE") {
      return {
        mediaType: "image",
        mediaObject: {
          src: media.originalSrc,
          width: media.width,
          height: media.height,
          alt: media.altText,
          id: media.id,
          from: "shopify",
        },
      };
    } else if (media.mediaContentType === "VIDEO") {
      return {
        mediaType: "video",
        mediaObject: {
          from: "shopify",
          sources: media.sources,
        },
      };
    } else {
      return null;
    }
  };

  const productVariants = removeEdges(product.variants);
  const productMedia = product.media
    ? removeEdges(product.media).map((item) => mapMedia(item))
    : null;

  const productImages = removeEdges(product.images).map((item) =>
    mapMedia({ ...item, mediaContentType: "IMAGE" })
  );

  let primaryImage = productImages[0] ?? null;
  let secondaryImage = productImages[1] ?? null;

  let color: ShopifyProductColor[] = [];
  product.tags.map((tag: string) => {
    if (tag.includes("color-")) {
      color.push({
        name: tag.toLowerCase().replace("color-", ""),
      });
    }
  });

  const prices = productVariants.map((variant: any) => variant.priceV2);
  const compareAtPrices = productVariants.map(
    (variant: any) => variant.compareAtPriceV2
  );
  const price = prices[0];
  const compareAtPrice = compareAtPrices[0];

  const restProduct = {
    color,
    tags: product.tags,
    media:
      product.media && productMedia
        ? [
            ...productMedia.filter((e: any) => e.type === "VIDEO"),
            ...productImages,
          ]
        : productImages,
    primaryImage,
    secondaryImage,
    relatedProducts: [],
    price,
    compareAtPrice,
  };

  const ret: ShopifyProduct = {
    ...product,
    ...restProduct,
    variants: productVariants.map((variant: any) => ({
      title: variant.title,
      id: variant.id,
      quantityAvailable: variant.quantityAvailable,
      sku: variant.sku,
      available: variant.availableForSale,
      isLowStock: false,
      isFinalSale: false,
      color,
      productId: product.id,
      productHandle: product.handle,
    })),
  };

  return ret;
};
