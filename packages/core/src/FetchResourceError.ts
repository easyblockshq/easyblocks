class FetchResourceError extends Error {
  constructor(resourceId: string) {
    super(`Unable to fetch the resource for id "${resourceId}"`);
  }
}

export { FetchResourceError };
