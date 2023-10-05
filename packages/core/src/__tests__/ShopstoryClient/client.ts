import { mock, mockConsoleMethod } from "@easyblocks/test-utils";
import { ShopstoryClient } from "../../ShopstoryClient";
import { createTestConfig } from "../../testUtils";
import { FetchFunction } from "../../types";

jest.mock("../../loadScripts", () => {
  return {
    loadCompilerScript: async () =>
      jest.requireActual("../../../../../apps/app/public/compiler.cjs"),
    _esModule: true,
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

test("throws error when type is missing custom fetch ", async () => {
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
      types: {
        product1: {
          fetch: product1FetchMock,
        },
        product2: {},
        product3: {
          fetch: product3FetchMock,
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
    { locale: "en-US" }
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

  await expect(shopstoryClient.build()).rejects.toThrow();
  expect(product1FetchMock).toHaveBeenCalledTimes(1);
  expect(product3FetchMock).toHaveBeenCalledTimes(0);
});

test("throws error when one of custom fetches finishes with error", async () => {
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
      types: {
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
          ],
          type: "item",
        },
      ],
    }),
    { locale: "en-US" }
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
  });

  await expect(shopstoryClient.build()).rejects
    .toThrowErrorMatchingInlineSnapshot(`
              "Fetch function for type \\"product1\\" finished with error above. This is not Shopstory error.

              Below is the input for which the resource fetch failed:
              [
                {
                  \\"id\\": \\"product1\\",
                  \\"type\\": \\"product1\\"
                }
              ]"
            `);

  expect(product2FetchMock).toHaveBeenCalledTimes(1);
  expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  expect(consoleErrorMock).toHaveBeenNthCalledWith(
    1,
    new Error('Unhandled error during "product1" fetch')
  );

  unmock();
});

test("throws error when custom fetcher doesn't return an array", async () => {
  // @ts-expect-error This is only for test purposes
  const customFetchMock = mock<FetchFunction>(async () => {
    return "definitely not an array!";
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      types: {
        product: {
          fetch: customFetchMock,
        },
      },
      components: [
        {
          id: "TestComponent",
          type: "item",
          schema: [
            { prop: "product1", type: "resource", resourceType: "product" },
          ],
        },
      ],
    }),
    { locale: "en-US" }
  );

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "xxx",
    product1: {
      id: "product1",
    },
  });

  await expect(shopstoryClient.build()).rejects.toThrowError(
    `Result of fetch function for type "product" is not an array, got ""definitely not an array!"" instead. Make sure to return an array of resources from your custom fetch.`
  );
});

test("throws error when custom fetcher returns array of not valid output", async () => {
  // @ts-expect-error This is only for test purposes
  const customFetchMock = mock<FetchFunction>(async (resources) => {
    return resources.map(
      (resource) => "Invalid output for resource " + resource.id
    );
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      types: {
        product: {
          fetch: customFetchMock,
        },
      },
      components: [
        {
          id: "TestComponent",
          type: "item",
          schema: [
            { prop: "product1", type: "resource", resourceType: "product" },
          ],
        },
      ],
    }),
    { locale: "en-US" }
  );

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "xxx",
    product1: {
      id: "product1",
    },
  });

  await expect(shopstoryClient.build()).rejects
    .toThrowErrorMatchingInlineSnapshot(`
              "Results of fetch function for type \\"product\\" are invalid. Each result should be one of:
              • undefined
              • same as resource input
              • resolved resource with \\"value\\" or \\"error\\" property."
            `);
});

test("throws error when result of fetch function is data with circular references", async () => {
  const { mockedFn: consoleErrorMock, unmock } = mockConsoleMethod("error");

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      types: {
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
    { locale: "en-US" }
  );

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "xyz",
    product1: {
      id: "product1",
    },
  });

  await expect(shopstoryClient.build()).rejects.toThrowError(
    `Resource of type "product" and id "product1" resolved to object with circular references. This is not Shopstory error.`
  );

  expect(consoleErrorMock).toHaveBeenCalledTimes(0);

  unmock();
});

test("throws error when custom fetch function returned unresolved resources", async () => {
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
      types: {
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
    { locale: "en-US" }
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

  await expect(shopstoryClient.build()).rejects
    .toThrowErrorMatchingInlineSnapshot(`
          "Fetching resources for type \\"product\\" didn't resolve all resources. This is not Shopstory error.

          Below is the list of remaining unresolved resources:
          [
            {
              \\"id\\": \\"product2\\",
              \\"type\\": \\"product\\"
            },
            {
              \\"id\\": \\"product3\\",
              \\"type\\": \\"product\\"
            }
          ]

          "
        `);
});

// test("throws error when config contains external text resource but text fetch is missing", async () => {
//   const testConfig = createTestConfig({
//     components: [
//       {
//         id: "TestComponent",
//         schema: [{ prop: "text1", type: "text" }],
//         type: "item",
//       },
//     ],
//   });
//
//   function withEmptyText(cmsCompilationSetup: CMSClientSetup): CMSClientSetup {
//     return (config) => {
//       const fullConfig = cmsCompilationSetup(config);
//       fullConfig.text = undefined;
//       return fullConfig;
//     };
//   }
//
//   const shopstoryClient = new ShopstoryClient(
//     testConfig,
//     withEmptyText(noCMSClientSetup),
//     { locale: "en-US" }
//   );
//
//   shopstoryClient.add({
//     _template: "TestComponent",
//     _id: "xxx",
//     text1: {
//       id: "external text",
//     },
//   });
//
//   await expect(shopstoryClient.fetch()).rejects.toThrowError(
//     "There is external text in config but there is no fetch function"
//   );
// });

test("throws error when there is no config returned from API for remote content piece input", async () => {
  const fetchMock = jest.fn().mockResolvedValue({
    status: 200,
    json: async () => {
      return {
        data: null,
      };
    },
    // We cast to unknown to prevent declaring all properties required by Response object and only declare necessary
  } as unknown as Response);

  global.fetch = fetchMock;

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      accessToken: "test access token",
      types: {
        product: {
          fetch: async (resources) => {
            return resources.map((resource) => {
              return {
                ...resource,
                value: {
                  id: resource.id,
                },
              };
            });
          },
        },
      },
      components: [
        {
          id: "TestComponent",
          type: "item",
          schema: [
            { prop: "product1", type: "resource", resourceType: "product" },
            { prop: "product2", type: "resource", resourceType: "product" },
          ],
        },
      ],
      locales: [
        {
          code: "en-US",
          isDefault: true,
        },
      ],
    }),
    { locale: "en-US" }
  );

  shopstoryClient.add({
    id: "xxx",
    hash: "yyy",
  });

  await expect(() =>
    shopstoryClient.build()
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Error fetching remote content configs."`
  );

  fetchMock.mockReset();
});

test("throws error if invalid config is given", async () => {
  const consoleErrorMock = mockConsoleMethod("error");

  const shopstoryClient = new ShopstoryClient(createTestConfig(), {
    locale: "en-US",
  });

  shopstoryClient.add(
    JSON.stringify({ _template: "TestComponent", _id: "xxx" })
  );

  await expect(() =>
    shopstoryClient.build()
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"ShopstoryClient has received one or more invalid content item. Please check the console for more details."`
  );

  expect(consoleErrorMock.mockedFn).toHaveBeenCalledTimes(1);
  expect(consoleErrorMock.mockedFn.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "Invalid content items: ",
      Array [
        "{\\"_template\\":\\"TestComponent\\",\\"_id\\":\\"xxx\\"}",
      ],
    ]
  `);
});
