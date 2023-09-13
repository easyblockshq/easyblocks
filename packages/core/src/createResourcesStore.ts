import { Resource } from "./types";

type ResourceStoreSubscriber = () => void;

type ResourcesStore = {
  get(id: string): Resource | undefined;
  set(id: string, resource: Resource): void;
  remove(id: string): void;
  values(): Array<Resource>;
  subscribe(listener: ResourceStoreSubscriber): () => void;
  batch(callback: () => void): void;
  has(id: string): boolean;
};

function createResourcesStore(): ResourcesStore {
  const store = new Map<string, Resource>();
  const subscribers: Array<ResourceStoreSubscriber> = [];

  let isBatching = false;

  function notify() {
    subscribers.forEach((subscriber) => {
      subscriber();
    });
  }

  const resourcesStore: ResourcesStore = {
    get(id: string) {
      return store.get(id);
    },

    values() {
      return Array.from(store.values());
    },

    set(id: string, entry: Resource) {
      store.set(id, entry);

      if (!isBatching) {
        notify();
      }
    },

    remove(id) {
      store.delete(id);

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

    has(id) {
      return store.has(id);
    },
  };

  return resourcesStore;
}

export { createResourcesStore };
export type { ResourcesStore };
