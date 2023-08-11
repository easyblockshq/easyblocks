function cleanString(value: string): string {
  return value.replace(/\u2028/g, "");
}

export { cleanString };
