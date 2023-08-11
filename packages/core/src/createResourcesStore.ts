import { Resource } from "./types";

type ResourceStoreSubscriber = () => void;

type ResourcesStore = {
  get(id: string, type: string): Resource | undefined;
  set(id: string, resource: Resource): void;
  values(): Array<Resource>;
  subscribe(listener: ResourceStoreSubscriber): () => void;
  batch(callback: () => void): void;
  has(id: string, type: string): boolean;
};

function createResourcesStore(): ResourcesStore {
  const store = new Map<string, Map<string, Resource>>();
  const subscribers: Array<ResourceStoreSubscriber> = [];

  let isBatching = false;

  function notify() {
    subscribers.forEach((subscriber) => {
      subscriber();
    });
  }

  const resourcesStore: ResourcesStore = {
    get(id: string, type: string) {
      return store.get(type)?.get(id);
    },

    values() {
      return Array.from(store.values()).flatMap((values) =>
        Array.from(values.values())
      );
    },

    set(id: string, entry: Resource) {
      const resourcesForType = store.get(entry.type);

      if (!resourcesForType) {
        store.set(entry.type, new Map<string, Resource>([[id, entry]]));
      } else {
        resourcesForType.set(id, entry);
        store.set(entry.type, resourcesForType);
      }

      if (!isBatching) {
        notify();
      }
    },

    subscribe(subscriber: ResourceStoreSubscriber) {
      subscribers.push(subscriber);

      return () => {
        subscribers.splice(subscribers.indexOf(subscriber), 1);
      };
    },

    batch(callback: () => void) {
      isBatching = true;
      callback();
      isBatching = false;
      notify();
    },

    has(id, type) {
      const resourcesForType = store.get(type);

      if (!resourcesForType) {
        return false;
      }

      return resourcesForType.has(id);
    },
  };

  return resourcesStore;
}

export { createResourcesStore };
export type { ResourcesStore };
