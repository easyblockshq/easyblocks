function buildQueryParam(init: {
  version?: string;
  locale?: string;
  path: string;
  gridVersion?: string;
  grid?: string;
}) {
  if (init.path === "") {
    throw new Error("path not specified");
  }

  const data = {
    version: "v0",
    locale: "en",
    ...init,
  };

  const searchParams = new URLSearchParams(data);

  return `?${searchParams}`;
}

export { buildQueryParam };
