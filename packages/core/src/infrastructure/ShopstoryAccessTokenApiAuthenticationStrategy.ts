import type { ApiAuthenticationStrategy } from "./apiClient";

class ShopstoryAccessTokenApiAuthenticationStrategy
  implements ApiAuthenticationStrategy
{
  readonly headerName: string;

  constructor(private readonly accessToken: string) {
    this.headerName = "x-shopstory-access-token";
    this.accessToken = accessToken;
  }

  async getAccessToken(): Promise<string> {
    return this.accessToken;
  }
}

export { ShopstoryAccessTokenApiAuthenticationStrategy };
