export function normalizeToStringArray(arg: string | string[] | undefined) {
  return typeof arg === "string" ? [arg] : Array.isArray(arg) ? arg : [];
}
