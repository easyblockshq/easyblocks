import { fetchProductsByIds } from "./fetchProductsByIds";

export async function fetchProductById(id: string) {
  return (await fetchProductsByIds([id]))[0];
}
