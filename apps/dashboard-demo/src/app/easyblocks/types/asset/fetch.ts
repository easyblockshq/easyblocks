import { RequestedExternalData, ExternalData } from "@easyblocks/core";

async function fetchAssets(externalData: RequestedExternalData) {
  const assetsExternals = Object.entries(externalData).filter(
    ([, externalReference]) => {
      return (
        externalReference.widgetId === "asset" && externalReference.id !== null
      );
    }
  );

  const assetsResponse = await fetch("http://localhost:3200/assets", {
    next: {
      revalidate: 0,
    },
  });
  const assets = await assetsResponse.json();

  const resultAssets: ExternalData = Object.fromEntries(
    assetsExternals.map(([referenceKey, externalReference]) => {
      const asset = assets.find(
        (asset: any) => asset.id === externalReference.id
      );

      if (!asset) {
        return [
          referenceKey,
          {
            error: new Error(`Asset with id ${externalReference.id} not found`),
          },
        ];
      }

      return [
        referenceKey,
        {
          type: "object",
          value: {
            self: {
              type: "asset",
              label: "Asset",
              value: asset,
            },

            name: {
              type: "text",
              label: "Name",
              value: asset.name,
            },

            mimeType: {
              type: "text",
              label: "MIME Type",
              value: asset.mimeType,
            },

            previewImage: {
              type: "image",
              value: asset.imageUrl,
            },

            nameProperty: {
              type: "propertyText",
              label: "Name",
              value: {
                label: "Name",
                id: "name",
                value: asset.name,
              },
            },

            mimeTypeProperty: {
              type: "propertyText",
              label: "MIME Type",
              value: {
                label: "MIME Type",
                id: "mimeType",
                value: asset.mimeType,
              },
            },

            isDisabledProperty: {
              type: "propertyBoolean",
              label: "Disabled",
              value: {
                label: "Disabled",
                id: "isDisabled",
                value: asset.isDisabled,
              },
            },

            updatedAtProperty: {
              type: "propertyDate",
              label: "Updated At",
              value: {
                label: "Updated At",
                value: new Date().toISOString(), // dynamic data
              },
            },

            editFormAction: {
              type: "formAction",
              value: { id: asset.id },
            },
          },
        },
      ];
    })
  );

  return resultAssets;
}

export { fetchAssets };
