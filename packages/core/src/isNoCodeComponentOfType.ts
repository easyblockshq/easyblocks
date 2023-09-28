export function isNoCodeComponentOfType(
  definition: { type?: string | string[] },
  type: string
) {
  if (!definition.type) {
    return false;
  }

  if (typeof definition.type === "string") {
    return type === definition.type;
  }

  return definition.type.includes(type);
}
