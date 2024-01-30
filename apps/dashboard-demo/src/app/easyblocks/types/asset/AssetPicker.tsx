"use client";

import { WidgetComponentProps } from "@easyblocks/core";
import { SimplePicker } from "@easyblocks/design-system";

function AssetPicker(props: WidgetComponentProps<string>) {
  return (
    <SimplePicker
      value={props.id}
      onChange={props.onChange}
      getItems={async (query) => {
        const assetsResponse = await fetch("http://localhost:3200/assets");
        const assets = await assetsResponse.json();

        return assets
          .filter((asset: any) => {
            return (
              asset.name.toLowerCase().includes(query.toLowerCase()) ||
              asset.description.toLowerCase().includes(query.toLowerCase())
            );
          })
          .map((asset: any) => {
            return {
              id: asset.id,
              title: asset.name,
            };
          });
      }}
      getItemById={async (id) => {
        const assetResponse = await fetch("http://localhost:3200/assets/" + id);
        const asset = await assetResponse.json();

        return {
          id: asset!.id,
          title: asset!.name,
        };
      }}
    />
  );
}

export { AssetPicker };
