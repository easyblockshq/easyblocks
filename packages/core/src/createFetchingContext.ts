import type { Config, ExternalDefinition } from "./types";

export type FetchingContext = {
  types: {
    [key: string]: ExternalDefinition;
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
