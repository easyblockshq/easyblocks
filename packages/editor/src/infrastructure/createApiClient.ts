import {
  ApiClient,
  ShopstoryAccessTokenApiAuthenticationStrategy,
} from "@easyblocks/core";

function createApiClient(accessToken: string) {
  return new ApiClient(
    new ShopstoryAccessTokenApiAuthenticationStrategy(accessToken)
  );
}

export { createApiClient };
