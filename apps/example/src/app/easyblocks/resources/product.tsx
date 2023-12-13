import type {
  ChangedExternalData,
  ExternalData,
  ExternalDataCompoundResourceResolvedResult,
  FetchOutputCompoundResources,
  ImageSrc,
  PickerItem,
  Widget,
} from "@easyblocks/core";
import { SimplePicker } from "@easyblocks/design-system";
import { MockProductsService } from "../../../data/MockData/MockProductsService";

const productWidget: Widget = {
  id: "product",
  label: "E-commerce",
  component: function ProductWidgetComponent({ id, onChange }) {
    return (
      <SimplePicker
        value={id}
        onChange={onChange}
        getItems={async (query) => {
          const items = await MockProductsService.searchProducts(query);

          return items.map<PickerItem>((item) => {
            return {
              id: item.id,
              title: item.title,
              thumbnail: item.image,
            };
          });
        }}
        getItemById={async (id) => {
          const item = await MockProductsService.getProductById(id);

          if (!item) {
            throw new Error("Unable to find product for id: " + id);
          }

          return {
            id: item.id,
            title: item.title,
            thumbnail: item.image,
          };
        }}
        placeholder="Pick a product"
      />
    );
  },
};

async function fetchProductResources(
  externalData: ChangedExternalData
): Promise<ExternalData> {
  const productResources = Object.entries(externalData).filter(
    ([, resource]) => resource.widgetId === productWidget.id
  );

  if (productResources.length === 0) {
    return {};
  }

  const productIds = productResources
    .map(([, resource]) => resource.id)
    .filter<string>((externalId): externalId is string => externalId !== null);

  const products = await MockProductsService.getProductsByIds(productIds);

  const result: FetchOutputCompoundResources = {};

  productResources.forEach(([id, inputResource]) => {
    const product = products.find((p) => p.id === inputResource.id);

    if (!product) {
      result[id] = {
        error: new Error(`Product with id "${inputResource.id}" not found`),
      };
      return;
    }

    if (product.title.indexOf("forced error") > -1) {
      result[id] = {
        error: new Error("Fetch error"),
      };
      return;
    }

    const productImage: ImageSrc = {
      alt: product.title,
      aspectRatio: 2000 / 1333,
      mimeType: "image/jpeg",
      url: product.image,
      srcset: [
        {
          h: 1333,
          url: product.image,
          w: 2000,
        },
      ],
    };

    const secondaryImage: ImageSrc = product.imageSecondary
      ? {
          alt: product.title,
          aspectRatio: 1581 / 2370,
          mimeType: "image/jpeg",
          url: product.imageSecondary,
          srcset: [
            {
              h: 2370,
              w: 1581,
              url: product.imageSecondary,
            },
          ],
        }
      : productImage;

    const compoundExternalDataValue: ExternalDataCompoundResourceResolvedResult =
      {
        type: "object",
        value: {
          mainImage: {
            type: "image",
            value: productImage,
            label: "Main image",
          },
          secondaryImage: {
            type: "image",
            value: secondaryImage,
            label: "Secondary image",
          },
          title: {
            type: "text",
            value: product.title,
            label: "Title",
          },
        },
      };

    if (product.description) {
      compoundExternalDataValue.value.description = {
        type: "text",
        value: product.description,
        label: "Description",
      };
    }

    result[id] = compoundExternalDataValue;
  });

  return result;
}

export { productWidget, fetchProductResources };
