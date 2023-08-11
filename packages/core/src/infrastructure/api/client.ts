export const createClient = (
  url: string,
  accessToken: string | undefined,
  headers: Record<string, string> = {}
) => {
  const HEADERS: HeadersInit = {
    "content-type": "application/json",
    ...headers,
  };

  if (accessToken) {
    HEADERS["x-shopstory-access-token"] = accessToken;
  }

  return {
    async call<TOut>(
      name: string,
      body: string
    ): Promise<{ data: TOut; error: null } | { data: null; error: Error }> {
      try {
        const response = await fetch(`${url}/api/${name}`, {
          method: "POST",
          headers: HEADERS,
          body,
        });

        const data: TOut | { error: Error } = await response.json();

        if ("error" in data) {
          return { data: null, error: data.error };
        }

        return { data, error: null };
      } catch (error: any) {
        return {
          data: null,
          error,
        };
      }
    },
  };
};

export type ApiClient = ReturnType<typeof createClient>;
