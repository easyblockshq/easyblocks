import {
  ApiClient,
  ShopstoryAccessTokenApiAuthenticationStrategy,
} from "@easyblocks/core";

if (!process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN) {
  throw new Error("NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN is not set");
}

const accessToken = process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN;

function createApiClient() {
  return new ApiClient(
    new ShopstoryAccessTokenApiAuthenticationStrategy(accessToken)
  );
}

export { createApiClient, accessToken };
