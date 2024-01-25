import { ChangedExternalData } from "@easyblocks/core";
import { fetchAssets } from "./types/asset/fetch";

async function fetchExternalData(externalData: ChangedExternalData) {
  const assetsExternalData = await fetchAssets(externalData);

  return {
    ...assetsExternalData,
  };
}

export { fetchExternalData };
