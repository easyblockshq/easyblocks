import type { Config, CustomTypeDefinition } from "./types";

export type FetchingContext = {
  types: {
    [key: string]: CustomTypeDefinition;
  };
  strict?: boolean;
};

function createFetchingContext(config: Config): FetchingContext {
  return {
    types: config.types ?? {},
    strict: config.strict,
  };
}

export { createFetchingContext };
