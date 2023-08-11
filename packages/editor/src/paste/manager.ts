import { ConfigComponent } from "@easyblocks/core";
import { Destination } from "./destinationResolver";

function pasteManager() {
  const inserts = new Map<string, number>();
  return (destinations: Destination[]) => (item: ConfigComponent) => {
    let i = 0;

    while (i < destinations.length) {
      const { index, name, insert } = destinations[i];

      const path = `${name}.${index}`;
      const latestDestinationInserts = inserts.get(path) ?? 0;

      const result = insert(name, index + latestDestinationInserts, item);

      if (result) {
        inserts.set(path, latestDestinationInserts + 1);
        return result;
      }

      i++;
    }

    return null;
  };
}

export type PasteCommand = ReturnType<typeof pasteManager>;

export { pasteManager };
