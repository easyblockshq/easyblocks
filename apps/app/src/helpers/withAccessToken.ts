import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createSupabaseClient } from "../createSupabaseClient";
import { parseBearerToken } from "./parseBearerToken";

const ACCESS_TOKEN_HEADER = "x-shopstory-access-token";

export type AuthenticatedNextApiHandler = (
  request: AuthenticatedNextApiRequest,
  response: NextApiResponse,
  accessToken: string
) => ReturnType<NextApiHandler>;

type AuthenticatedNextApiRequest = Omit<NextApiRequest, "headers"> & {
  headers: NextApiRequest["headers"] & {
    ["x-shopstory-access-token"]: string;
  };
};

const isShopstoryAccessTokenHeaderMissing = (request: NextApiRequest) =>
  request.headers?.[ACCESS_TOKEN_HEADER] === undefined ||
  request.headers?.[ACCESS_TOKEN_HEADER] === "undefined";

const isLegacyAuthenticatedRequest = (
  request: NextApiRequest
): request is AuthenticatedNextApiRequest =>
  typeof request.headers?.[ACCESS_TOKEN_HEADER] === "string";

const isAuthenticatedRequest = (
  request: NextApiRequest
): request is AuthenticatedNextApiRequest =>
  typeof request.headers?.["authorization"] === "string";

const withAccessToken =
  (authenticatedHandler: AuthenticatedNextApiHandler): NextApiHandler =>
  async (request, response) => {
    const isLegacyAuthenticationMethod =
      !isShopstoryAccessTokenHeaderMissing(request);

    if (isLegacyAuthenticationMethod) {
      if (!isLegacyAuthenticatedRequest(request)) {
        response.status(400).json({
          error: `Value of ${ACCESS_TOKEN_HEADER} must be a string`,
        });
        return;
      }

      return authenticatedHandler(
        request,
        response,
        request.headers[ACCESS_TOKEN_HEADER]
      );
    }

    if (!isAuthenticatedRequest(request)) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const accessToken = parseBearerToken(request.headers["authorization"]);
      const supabaseClient = createSupabaseClient(accessToken);

      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        response.status(401).json({ error: "Unauthorized" });
        return;
      }

      return authenticatedHandler(request, response, accessToken);
    } catch {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }
  };

export { withAccessToken, type AuthenticatedNextApiRequest };
