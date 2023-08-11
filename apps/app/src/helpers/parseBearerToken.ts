function parseBearerToken(token: string) {
  const [type, value] = token.split(" ");

  if (type !== "Bearer") {
    throw new Error("Invalid token type");
  }

  return value;
}

export { parseBearerToken };
