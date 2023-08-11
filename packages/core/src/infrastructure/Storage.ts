import { ConfigComponentIdentifier, ConfigModel } from "../types";
export { createApiStorage } from "./api";

export type ConfigOrConfigArray<
  T extends unknown[] | unknown,
  O
> = T extends Array<unknown> ? O[] : O;

export interface Storage {
  getConfigForLocale<
    T extends ConfigComponentIdentifier | ConfigComponentIdentifier[]
  >(
    ids: T,
    locale: string | string[]
  ): Promise<ConfigOrConfigArray<T, ConfigModel> | null>;
  getConfig<T extends ConfigComponentIdentifier | ConfigComponentIdentifier[]>(
    params: T
  ): Promise<ConfigOrConfigArray<T, ConfigModel> | null>;
  saveConfig(configModel: Partial<ConfigModel>): Promise<{ id: string }>;
}
