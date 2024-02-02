export type ShopifyPrice = {
  amount: string;
  currencyCode: string;
};

export type ShopifyProductColor = {
  name: string;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice;
  media: MediaObject[];
  primaryImage?: MediaObject;
  secondaryImage?: MediaObject;
  relatedProducts?: ShopifyProduct[];
  tags?: string[];
  color?: ShopifyProductColor[];
};

export type ImageObject = {
  src: string;
  width: number;
  height: number;
  alt?: string;
  format?: string;
  id: string;
  from: "shopify";
};

export type MediaObject =
  | {
      mediaType: "image";
      mediaObject: ImageObject;
    }
  | {
      mediaType: "video";
      mediaObject: any;
    };
