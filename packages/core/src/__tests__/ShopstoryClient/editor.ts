import { mock, mockConsoleMethod } from "@easyblocks/test-utils";
import { ShopstoryClient } from "../../ShopstoryClient";
import {
  createTestConfig,
  rejectedResource,
  resolvedResource,
} from "../../testUtils";
import { ContextParams, FetchFunction } from "../../types";

jest.mock("../../loadScripts", () => {
  return {
    loadCompilerScript: async () =>
      jest.requireActual("../../../../../apps/app/public/compiler.cjs"),
    _esModule: true,
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

const contextParams: ContextParams = { locale: "en-US" };

test("marks resources as rejected when type misses custom fetch", async () => {
  const { mockedFn: consoleErrorMock, unmock } = mockConsoleMethod("error");

  const productFetch: FetchFunction = async (resources) => {
    return resources.map((resource) => {
      return {
        ...resource,
        value: {
          id: resource.id,
        },
      };
    });
  };

  const product1FetchMock = mock(productFetch);
  const product3FetchMock = mock(productFetch);

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      strict: false,
      resourceTypes: {
        product1: {
          fetch: product1FetchMock,
          widget: {},
        },
        product2: { widget: {} },
        product3: {
          fetch: product3FetchMock,
          widget: {},
        },
      },
      components: [
        {
          id: "TestComponent",
          type: "item",
          schema: [
            {
              prop: "product1",
              type: "resource",
              resourceType: "product1",
            },
            {
              prop: "product2",
              type: "resource",
              resourceType: "product2",
            },
            {
              prop: "product3",
              type: "resource",
              resourceType: "product3",
            },
          ],
        },
      ],
    }),
    contextParams
  );

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "xxx",
    product1: {
      id: "product1",
    },
    product2: {
      id: "product2",
    },
    product3: {
      id: "product3",
    },
  });

  const meta = await shopstoryClient.build();

  expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  expect(consoleErrorMock).toHaveBeenNthCalledWith(
    1,
    'Missing fetch function for type "product2". If this is custom resource type, make sure to provide fetch method for it within Shopstory config.'
  );
  expect(product1FetchMock).toHaveBeenCalledTimes(1);
  expect(product3FetchMock).toHaveBeenCalledTimes(1);
  expect(meta.resources).toHaveLength(3);
  expect(meta.resources).toEqual(
    expect.arrayContaining([
      resolvedResource({
        id: "product1",
        type: "product1",
        values: { default: { id: "product1" } },
      }),
      rejectedResource({
        id: "product2",
        type: "product2",
      }),
      resolvedResource({
        id: "product3",
        type: "product3",
        values: { default: { id: "product3" } },
      }),
    ])
  );

  unmock();
});

test("marks resources as rejected when custom fetch throws an error", async () => {
  const { mockedFn: consoleErrorMock, unmock } = mockConsoleMethod("error");

  const product2FetchMock = mock<FetchFunction>(async (resources) => {
    return resources.map((resource) => {
      return {
        ...resource,
        value: {
          id: resource.id,
          name: `Product2 ${resource.id}`,
        },
      };
    });
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      strict: false,
      resourceTypes: {
        product1: {
          fetch: async () => {
            throw new Error('Unhandled error during "product1" fetch');
          },
        },
        product2: {
          fetch: product2FetchMock,
        },
      },
      components: [
        {
          id: "TestComponent",
          schema: [
            {
              prop: "product1",
              type: "resource",
              resourceType: "product1",
            },
            {
              prop: "product2",
              type: "resource",
              resourceType: "product2",
            },
            {
              prop: "product3",
              type: "resource",
              resourceType: "product1",
            },
          ],
          type: "item",
        },
      ],
    }),
    contextParams
  );

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "xyz",
    product1: {
      id: "product1",
    },
    product2: {
      id: "product2",
    },
    product3: {
      id: "product3",
    },
  });

  const meta = await shopstoryClient.build();

  expect(product2FetchMock).toHaveBeenCalledTimes(1);
  expect(consoleErrorMock).toHaveBeenCalledTimes(2);
  expect(consoleErrorMock).toHaveBeenNthCalledWith(
    1,
    new Error('Unhandled error during "product1" fetch')
  );
  expect(consoleErrorMock.mock.calls[1][0]).toMatchInlineSnapshot(`
          "Fetch function for type \\"product1\\" finished with error above. This is not Shopstory error.

          Below is the input for which the resource fetch failed:
          [
            {
              \\"id\\": \\"product1\\",
              \\"type\\": \\"product1\\"
            },
            {
              \\"id\\": \\"product3\\",
              \\"type\\": \\"product1\\"
            }
          ]"
        `);
  expect(meta.resources).toHaveLength(3);
  expect(meta.resources).toEqual(
    expect.arrayContaining([
      rejectedResource({
        id: "product1",
        type: "product1",
      }),
      resolvedResource({
        id: "product2",
        type: "product2",
        values: { default: { id: "product2", name: "Product2 product2" } },
      }),
      rejectedResource({
        id: "product3",
        type: "product1",
      }),
    ])
  );

  unmock();
});

test("marks resources as rejected when custom fetcher doesn't return an array", async () => {
  const { mockedFn: consoleErrorMock, unmock } = mockConsoleMethod("error");

  // @ts-expect-error This is only for test purposes
  const productCustomFetchMock = mock<FetchFunction>(async () => {
    return "definitely not an array!";
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      strict: false,
      resourceTypes: {
        product1: {
          fetch: productCustomFetchMock,
        },
      },
      components: [
        {
          id: "TestComponent",
          type: "item",
          schema: [
            {
              prop: "product1",
              type: "resource",
              resourceType: "product1",
            },
            {
              prop: "product2",
              type: "resource",
              resourceType: "product1",
            },
          ],
        },
      ],
    }),
    contextParams
  );

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "xxx",
    product1: {
      id: "product1",
    },
    product2: {
      id: "product2",
    },
  });

  const meta = await shopstoryClient.build();

  expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  expect(consoleErrorMock).toHaveBeenNthCalledWith(
    1,
    'Result of fetch function for type "product1" is not an array, got ""definitely not an array!"" instead. Make sure to return an array of resources from your custom fetch.'
  );
  expect(meta.resources).toHaveLength(2);
  expect(meta.resources).toEqual(
    expect.arrayContaining([
      rejectedResource({ id: "product1", type: "product1" }),
      rejectedResource({ id: "product2", type: "product1" }),
    ])
  );

  unmock();
});

test("marks resources as rejected when custom fetcher returns array of not valid output", async () => {
  const { mockedFn: consoleErrorMock, unmock } = mockConsoleMethod("error");

  // @ts-expect-error This is only for test purposes
  const productCustomFetchMock = mock<FetchFunction>(async (resources) => {
    return resources.map(
      (resource) => "Invalid output for resource " + resource.id
    );
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      strict: false,
      resourceTypes: {
        product1: {
          fetch: productCustomFetchMock,
        },
      },
      components: [
        {
          id: "TestComponent",
          type: "item",
          schema: [
            {
              prop: "product1",
              type: "resource",
              resourceType: "product1",
            },
            {
              prop: "product2",
              type: "resource",
              resourceType: "product1",
            },
          ],
        },
      ],
    }),
    contextParams
  );

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "xxx",
    product1: {
      id: "product1",
    },
    product2: {
      id: "product2",
    },
  });

  const meta = await shopstoryClient.build();

  expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  expect(consoleErrorMock.mock.calls[0][0]).toMatchInlineSnapshot(`
        "Results of fetch function for type \\"product1\\" are invalid. Each result should be one of:
        • undefined
        • same as resource input
        • resolved resource with \\"value\\" or \\"error\\" property."
      `);
  expect(meta.resources).toHaveLength(2);
  expect(meta.resources).toEqual(
    expect.arrayContaining([
      rejectedResource({ id: "product1", type: "product1" }),
      rejectedResource({ id: "product2", type: "product1" }),
    ])
  );

  unmock();
});

test("marks resource as rejected when result of fetch function is data with circular references", async () => {
  const { mockedFn: consoleErrorMock, unmock } = mockConsoleMethod("error");

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      strict: false,
      resourceTypes: {
        product: {
          fetch: async (resources) => {
            return resources.map((resource) => {
              const a: Record<string, unknown> = {
                a: resource.id,
              };
              const b: Record<string, unknown> = {
                b: resource.id,
              };

              a.b = b;
              b.a = a;

              return {
                ...resource,
                value: {
                  id: resource.id,
                  a,
                  b,
                },
              };
            });
          },
        },
      },
      components: [
        {
          id: "TestComponent",
          schema: [
            {
              prop: "product1",
              type: "resource",
              resourceType: "product",
            },
          ],
          type: "item",
        },
      ],
    }),
    contextParams
  );

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "xyz",
    product1: {
      id: "product1",
    },
  });

  const meta = await shopstoryClient.build();

  expect(meta.resources).toHaveLength(1);
  expect(meta.resources).toEqual(
    expect.arrayContaining([
      rejectedResource({ id: "product1", type: "product" }),
    ])
  );
  expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  expect(
    'Resource of type "product" and id "product1" resolved to object with circular references. This is not Shopstory error.'
  );

  unmock();
});

test("marks only returned resource from custom fetcher as resolved and the rest as rejected when custom fetcher returns some unresolved resources", async () => {
  const productCustomFetchMock = mock<FetchFunction>(async (resources) => {
    return resources.map((resource, index) => {
      if (index === 0) {
        return {
          ...resource,
          value: {
            id: resource.id,
          },
        };
      }

      return;
    });
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      strict: false,
      resourceTypes: {
        product: {
          fetch: productCustomFetchMock,
        },
      },
      components: [
        {
          id: "TestComponent",
          type: "item",
          schema: [
            { prop: "product1", type: "resource", resourceType: "product" },
            { prop: "product2", type: "resource", resourceType: "product" },
            { prop: "product3", type: "resource", resourceType: "product" },
          ],
        },
      ],
    }),
    contextParams
  );

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "xxx",
    product1: {
      id: "product1",
    },
    product2: {
      id: "product2",
    },
    product3: {
      id: "product3",
    },
  });

  const meta = await shopstoryClient.build();

  expect(meta.resources).toHaveLength(3);
  expect(meta.resources).toEqual(
    expect.arrayContaining([
      resolvedResource({
        id: "product1",
        type: "product",
        values: {
          default: {
            id: "product1",
          },
        },
      }),
      rejectedResource({
        id: "product2",
        type: "product",
      }),
      rejectedResource({
        id: "product3",
        type: "product",
      }),
    ])
  );
});
