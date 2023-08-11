function raiseError(errorMessage: string): never {
  throw new Error(errorMessage);
}

export { raiseError };
