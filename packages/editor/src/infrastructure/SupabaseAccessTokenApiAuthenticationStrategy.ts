import type { ApiAuthenticationStrategy } from "@easyblocks/core";
import { supabaseClient } from "./supabaseClient";

class SupabaseAccessTokenApiAuthenticationStrategy
  implements ApiAuthenticationStrategy
{
  readonly headerName: string;

  constructor() {
    this.headerName = "Authorization";
  }

  async getAccessToken(): Promise<string> {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) {
      throw new Error("No session found");
    }

    return `Bearer ${session.access_token}`;
  }
}

export { SupabaseAccessTokenApiAuthenticationStrategy };
