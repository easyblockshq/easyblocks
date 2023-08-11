/**
 *
 * @param collection Array of values
 * @param mapper Optional callback function that will be invoked for each item of given array to map it into comparable string
 */
function getUniqueValues<
  Collection extends Array<any>,
  Item extends Collection[number]
>(
  collection: Collection,
  mapper?: (item: Item, index: number) => string | undefined
): Array<Item> {
  if (mapper) {
    const uniqueValues = new Set<string | undefined>();
    const uniqueItems: Array<Item> = [];

    collection.forEach((item, index) => {
      const mappedItem = mapper(item, index);

      if (!uniqueValues.has(mappedItem)) {
        uniqueValues.add(mappedItem);
        uniqueItems.push(item);
      }
    });

    return uniqueItems;
  }

  return Array.from(new Set(collection));
}

export { getUniqueValues };
