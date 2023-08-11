const isTracingSchemaProp = (prop?: string) =>
  prop === "traceId" || prop === "traceClicks" || prop === "traceImpressions";

export { isTracingSchemaProp };
