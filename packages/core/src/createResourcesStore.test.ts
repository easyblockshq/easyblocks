import { createResourcesStore } from "./createResourcesStore";

test("saves resources", () => {
  const store = createResourcesStore();

  // At first set the store is empty
  store.set("resource1", {
    error: null,
    id: "resource1",
    status: "success",
    type: "test",
    values: { default: "test value!" },
  });

  expect(store.get("resource1", "test")).toEqual({
    error: null,
    id: "resource1",
    status: "success",
    type: "test",
    values: { default: "test value!" },
  });

  // At second save store already has another resource of this kind
  store.set("resource2", {
    error: null,
    id: "resource2",
    status: "success",
    type: "test",
    values: { default: "another value!" },
  });

  expect(store.get("resource2", "test")).toEqual({
    error: null,
    id: "resource2",
    status: "success",
    type: "test",
    values: { default: "another value!" },
  });
});

test("notifies on store changes after subscribing and stops after unsubscribing", () => {
  const mockSubscriber1 = jest.fn();
  const mockSubscriber2 = jest.fn();

  const store = createResourcesStore();
  const unsubscribe1 = store.subscribe(mockSubscriber1);
  const unsubscribe2 = store.subscribe(mockSubscriber2);

  store.set("resource1", {
    error: null,
    id: "resource1",
    status: "success",
    type: "test",
    values: { default: "test value!" },
  });

  expect(mockSubscriber1).toHaveBeenCalledTimes(1);
  expect(mockSubscriber2).toHaveBeenCalledTimes(1);

  unsubscribe1();

  store.set("resource2", {
    error: null,
    id: "resource2",
    status: "success",
    type: "test",
    values: { default: "another value!" },
  });

  expect(mockSubscriber1).toHaveBeenCalledTimes(1);
  expect(mockSubscriber2).toHaveBeenCalledTimes(2);

  unsubscribe2();
});

test("suppress notifying subscribers while in batch", () => {
  const mockSubscriber1 = jest.fn();
  const mockSubscriber2 = jest.fn();

  const store = createResourcesStore();
  const unsubscribe1 = store.subscribe(mockSubscriber1);
  const unsubscribe2 = store.subscribe(mockSubscriber2);

  store.batch(() => {
    store.set("resource1", {
      error: null,
      id: "resource1",
      status: "success",
      type: "test",
      values: { default: "test value!" },
    });

    expect(mockSubscriber1).toHaveBeenCalledTimes(0);
    expect(mockSubscriber2).toHaveBeenCalledTimes(0);
  });

  expect(mockSubscriber1).toHaveBeenCalledTimes(1);
  expect(mockSubscriber2).toHaveBeenCalledTimes(1);

  unsubscribe1();
  unsubscribe2();
});
