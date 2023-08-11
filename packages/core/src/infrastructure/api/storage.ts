import { ConfigComponentIdentifier, ConfigModel } from "../../types";
import { ConfigOrConfigArray, Storage } from "../Storage";
import { createClient } from "./client";
import { getAppUrlRoot } from "@easyblocks/utils";

const configuration = {
  url: getAppUrlRoot(),
};

function createApiStorage({
  accessToken = "",
  headers,
}: {
  accessToken?: string;
  headers?: Record<string, string>;
}): Storage & { setHeader: (key: string, value: string) => void } {
  let apiClient = createClient(configuration.url, accessToken, headers);

  const getConfig = async <
    T extends ConfigComponentIdentifier | ConfigComponentIdentifier[]
  >(
    input: T
  ): Promise<ConfigOrConfigArray<T, ConfigModel> | null> => {
    if ((Array.isArray(input) && input.length === 0) || !input) {
      return null;
    }

    const body = JSON.stringify(input);

    const { data, error } = await apiClient.call<
      ConfigOrConfigArray<T, ConfigModel>
    >("get-config", body);

    if (error) {
      throw new Error(
        `[API -> getConfig] (configuration:${JSON.stringify(
          configuration
        )}, body:${body}) : ${error.message}`
      );
    }

    if (data === null) {
      return null;
    }

    return (data as ConfigOrConfigArray<T, ConfigModel>) ?? null;
  };

  const getConfigForLocale = async <
    T extends ConfigComponentIdentifier | ConfigComponentIdentifier[]
  >(
    id: T,
    locale: string | string[]
  ): Promise<ConfigOrConfigArray<T, ConfigModel> | null> => {
    if ((Array.isArray(id) && id.length === 0) || !id) {
      return null;
    }

    const body = JSON.stringify({
      id: Array.isArray(id) ? id.map(({ id }) => id) : [id.id],
      locale,
    });

    const { data, error } = await apiClient.call<
      ConfigOrConfigArray<T, ConfigModel>
    >("get-config-localized", body);

    if (error) {
      throw new Error(
        `[API -> getConfig] (configuration:${JSON.stringify(
          configuration
        )}, body:${body}) : ${error.message}`
      );
    }

    if (data === null) {
      return null;
    }

    return (data as ConfigOrConfigArray<T, ConfigModel>) ?? null;
  };

  return {
    getConfig,
    getConfigForLocale,
    async saveConfig(config) {
      const { data, error } = await apiClient.call<ConfigModel>(
        "save-config",
        JSON.stringify(config)
      );

      if (error) {
        throw new Error(`[API -> saveConfig]: ${error.message}`);
      }

      if (data === null) {
        throw new Error(`[API -> saveConfig]: Save config failed`);
      }

      return { id: data.id };
    },
    setHeader: (key, value) => {
      apiClient = createClient(configuration.url, accessToken, {
        ...headers,
        [key]: value,
      });
    },
  };
}

export { createApiStorage };
