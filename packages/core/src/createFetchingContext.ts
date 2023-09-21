import type { Config, ResourceDefinition } from "./types";

export type FetchingContext = {
  resourceTypes: {
    [key: string]: ResourceDefinition;
  };
  strict?: boolean;
};

function createFetchingContext(config: Config): FetchingContext {
  return {
    resourceTypes: config.resourceTypes ?? {},
    strict: config.strict,
  };
}

export { createFetchingContext };
