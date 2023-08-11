import { getAppUrlRoot } from "@easyblocks/utils";
import { ShopstoryClient } from "./ShopstoryClient";
import { Config, ContextParams } from "./types";

export async function buildPreview(
  configId: string,
  width: number | undefined,
  widthAuto: boolean | undefined,
  accessToken: string,
  config: Config,
  contextParams: ContextParams
) {
  const response = await fetch(`${getAppUrlRoot()}/api/configs/${configId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-shopstory-access-token": accessToken,
    },
  });

  const data = await response.json();

  const client = new ShopstoryClient({ ...config, accessToken }, contextParams);
  const renderableContent = client.add({
    _id: "root",
    _template: "$ComponentContainer",
    widthAuto: widthAuto ?? false,
    width: width ?? 5000,
    Component: [data.config],
  });
  const meta = await client.build();

  return { renderableContent, meta };
}
