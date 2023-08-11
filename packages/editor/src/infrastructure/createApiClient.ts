import {
  ApiClient,
  ShopstoryAccessTokenApiAuthenticationStrategy,
} from "@easyblocks/core";
import { SupabaseAccessTokenApiAuthenticationStrategy } from "./SupabaseAccessTokenApiAuthenticationStrategy";

function createApiClient(accessToken: string | undefined) {
  if (accessToken) {
    return new ApiClient(
      new ShopstoryAccessTokenApiAuthenticationStrategy(accessToken)
    );
  }

  return new ApiClient(new SupabaseAccessTokenApiAuthenticationStrategy());
}

export { createApiClient };
