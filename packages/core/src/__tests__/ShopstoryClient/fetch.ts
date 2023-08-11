import { mock } from "@easyblocks/test-utils";
import { SHA1 } from "crypto-js";
import identity from "lodash/identity";
import {
  ConfigDTO,
  DocumentWithResolvedConfigDTO,
} from "../../infrastructure/apiClient";
import { ShopstoryClient } from "../../ShopstoryClient";
import {
  createTestConfig,
  defaultTestImageTransformer,
  defaultTestVideoTransformer,
  rejectedResource,
  resolvedResource,
} from "../../testUtils";
import {
  CompiledComponentConfig,
  DefaultFetchFunction,
  Document,
  FetchFunction,
  FetchResourcesInput,
  ImageTransformer,
  ImageVariant,
  LauncherPlugin,
  PostFetchFunction,
  RawContentRemote,
  RenderableContent,
  ResourceDefinition,
  ResourceTransformer,
  SerializableResource,
  VideoTransformer,
  VideoVariant,
} from "../../types";

jest.mock("../../loadScripts", () => {
  return {
    loadCompilerScript: async () =>
      jest.requireActual("../../../../../apps/api/public/compiler.cjs"),
    _esModule: true,
  };
});

test("fetches resources using custom fetcher", async () => {
  const productDefaultFetchMock = jest.fn();
  const productCustomFetchMock = mock<FetchFunction>(async (resources) => {
    return resources.map((resource) => {
      return {
        ...resource,
        value: {
          id: resource.id,
          name: `Product ${resource.id}`,
        },
      };
    });
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      resourceTypes: {
        product: {
          defaultFetch: productDefaultFetchMock,
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
            {
              prop: "product3",
              type: "resource",
              resourceType: "product",
              params: {
                size: 24,
              },
              fetchParams: {
                variant: "test-variant",
              },
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
      info: {
        type: "shoes",
      },
    },
    product3: {
      id: "product3",
    },
  });

  const meta = await shopstoryClient.build();

  expect(productCustomFetchMock).toHaveBeenCalledTimes(1);
  expect(productCustomFetchMock).toHaveBeenNthCalledWith<
    [Array<FetchResourcesInput>, any]
  >(
    1,
    [
      {
        id: "product1",
        type: "product",
      },
      {
        id: "product2",
        type: "product",
        info: {
          type: "shoes",
        },
      },
      {
        id: "product3",
        type: "product",
        fetchParams: {
          variant: "test-variant",
        },
      },
    ],
    expect.any(Object)
  );
  expect(productDefaultFetchMock).toHaveBeenCalledTimes(0);
  expect(meta.resources).toHaveLength(3);
  expect(meta.resources).toEqual(
    expect.arrayContaining([
      resolvedResource({
        id: "product1",
        type: "product",
        values: {
          default: {
            id: "product1",
            name: `Product product1`,
          },
        },
      }),
      resolvedResource({
        id: "product2",
        type: "product",
        values: {
          default: {
            id: "product2",
            name: `Product product2`,
          },
        },
        info: {
          type: "shoes",
        },
      }),
      resolvedResource({
        id: "product3",
        type: "product",
        values: {
          default: {
            id: "product3",
            name: `Product product3`,
          },
        },
        fetchParams: {
          variant: "test-variant",
        },
      }),
    ])
  );
});

test("fetches resources using default fetcher when custom fetcher is not defined", async () => {
  const defaultFetchMock = mock<DefaultFetchFunction>(async (resources) => {
    return resources.map((resource) => {
      return {
        ...resource,
        value: {
          id: resource.id,
          name: `Product ${resource.id}`,
        },
      };
    });
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      resourceTypes: {
        product: {
          defaultFetch: defaultFetchMock,
        },
      },
      components: [
        {
          id: "TestComponent",
          type: "item",
          schema: [
            { prop: "product1", type: "resource", resourceType: "product" },
            { prop: "product2", type: "resource", resourceType: "product" },
            {
              prop: "product3",
              type: "resource",
              resourceType: "product",
              fetchParams: {
                variant: "test-variant",
              },
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
      info: {
        type: "shoes",
      },
    },
    product3: {
      id: "product3",
    },
  });

  const meta = await shopstoryClient.build();

  expect(meta.resources).toHaveLength(3);
  expect(defaultFetchMock).toHaveBeenCalledTimes(1);
  expect(defaultFetchMock).toHaveBeenNthCalledWith<
    [Array<FetchResourcesInput>, any]
  >(
    1,
    [
      {
        id: "product1",
        type: "product",
      },
      {
        id: "product2",
        type: "product",
        info: {
          type: "shoes",
        },
      },
      {
        id: "product3",
        type: "product",
        fetchParams: {
          variant: "test-variant",
        },
      },
    ],
    expect.any(Object)
  );
});

test("fetches part of resources using custom fetcher, then remaining unresolved resources are fetched using default fetcher", async () => {
  const defaultFetchMock = mock<DefaultFetchFunction>(async (resources) => {
    return resources.map((resource) => {
      return {
        ...resource,
        value: {
          id: resource.id,
          name: `Product ${resource.id}`,
        },
      };
    });
  });

  const customFetchMock = mock<FetchFunction>(async (resources) => {
    return resources.map((resource) => {
      if (resource.id === "product1") {
        return undefined;
      }

      if (resource.id === "product3") {
        return resource;
      }

      return {
        ...resource,
        value: {
          id: resource.id,
          name: `Product ${resource.id}`,
        },
      };
    });
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      resourceTypes: {
        product: {
          defaultFetch: defaultFetchMock,
          fetch: customFetchMock,
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
              resourceType: "product",
              fetchParams: { variant: "test-variant1" },
            },
            { prop: "product2", type: "resource", resourceType: "product" },
            { prop: "product3", type: "resource", resourceType: "product" },
            {
              prop: "product4",
              type: "resource",
              resourceType: "product",
              fetchParams: { variant: "test-variant4" },
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
      info: {
        type: "shoes",
      },
    },
    product3: {
      id: "product3",
      info: {
        type: "shirts",
      },
    },
    product4: {
      id: "product4",
    },
  });

  const meta = await shopstoryClient.build();

  expect(meta.resources).toHaveLength(4);
  expect(customFetchMock).toHaveBeenCalledTimes(1);
  expect(customFetchMock).toHaveBeenNthCalledWith<Parameters<FetchFunction>>(
    1,
    [
      {
        id: "product1",
        type: "product",
        fetchParams: { variant: "test-variant1" },
      },
      {
        id: "product2",
        type: "product",
        info: {
          type: "shoes",
        },
      },
      {
        id: "product3",
        type: "product",
        info: {
          type: "shirts",
        },
      },
      {
        id: "product4",
        type: "product",
        fetchParams: { variant: "test-variant4" },
      },
    ],
    expect.any(Object)
  );
  expect(defaultFetchMock).toHaveBeenCalledTimes(1);
  expect(defaultFetchMock).toHaveBeenNthCalledWith<Parameters<FetchFunction>>(
    1,
    [
      {
        id: "product1",
        type: "product",
        fetchParams: { variant: "test-variant1" },
      },
      {
        id: "product3",
        type: "product",
        info: {
          type: "shirts",
        },
      },
    ],
    expect.any(Object)
  );
});

test("runs postFetch when given", async () => {
  const product1PostFetchMock = mock<PostFetchFunction>(async (resources) => {
    return resources.map((resource) => {
      return {
        ...resource,
        value: {
          // @ts-expect-error `value.data` is an object returned from `fetch` for `product1` resource
          ...resource.value.data,
        },
      };
    });
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      resourceTypes: {
        product1: {
          fetch: async (resources) => {
            return resources.map((resource) => {
              return {
                ...resource,
                value: {
                  data: {
                    id: resource.id,
                  },
                },
              };
            });
          },
          postFetch: product1PostFetchMock,
        },
        product2: {
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
            {
              prop: "product3",
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
    _id: "xxx",
    product1: {
      id: "id.product1",
    },
    product2: {
      id: "id.product2",
    },
    product3: {
      id: "id.product3",
    },
  });

  const meta = await shopstoryClient.build();

  expect(product1PostFetchMock).toHaveBeenCalledTimes(1);
  expect(product1PostFetchMock).toHaveBeenNthCalledWith(
    1,
    [
      {
        id: "id.product1",
        value: {
          data: { id: "id.product1" },
        },
        type: "product1",
      },
      {
        id: "id.product2",
        value: {
          data: {
            id: "id.product2",
          },
        },
        type: "product1",
      },
    ],
    expect.any(Object)
  );

  expect(meta.resources).toHaveLength(3);
  expect(meta.resources).toEqual(
    expect.arrayContaining([
      resolvedResource({
        id: "id.product1",
        type: "product1",
        values: {
          default: {
            id: "id.product1",
          },
        },
      }),
      resolvedResource({
        id: "id.product2",
        type: "product1",
        values: {
          default: {
            id: "id.product2",
          },
        },
      }),
      resolvedResource({
        id: "id.product3",
        type: "product2",
        values: {
          default: {
            id: "id.product3",
          },
        },
      }),
    ])
  );
});

test("runs transform when given to resource schema prop", async () => {
  const product1TransformMock = jest.fn(identity);
  const product2TransformMock = jest.fn(identity);

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      resourceTypes: {
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
          schema: [
            {
              prop: "product1",
              type: "resource",
              resourceType: "product",
              transform: product1TransformMock,
            },
            {
              prop: "product2",
              type: "resource",
              resourceType: "product",
              transform: product2TransformMock,
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

  const meta = await shopstoryClient.build();

  expect(meta.resources).toHaveLength(2);
  expect(meta.resources).toEqual(
    expect.arrayContaining([
      resolvedResource({
        id: "product1",
        type: "product",
        values: {
          [getTransformHash(product1TransformMock)]: { id: "product1" },
        },
      }),
      resolvedResource({
        id: "product2",
        type: "product",
        values: {
          [getTransformHash(product2TransformMock)]: { id: "product2" },
        },
      }),
    ])
  );
});

test("fetches resources for new configs added during fetching", async () => {
  const entry1Fetcher = mock<FetchFunction>(
    async (resources, { shopstoryClient }) => {
      const result = resources.map((resource) => {
        if (resource.info?.contentType === "shopstoryPage") {
          const result = shopstoryClient.add({
            _template: "TestComponent",
            _id: `yyy.${resource.id}`,
            entry: {
              id: `yyy.${resource.id}`,
              info: {
                contentType: "shopstoryBlock",
              },
            },
          });

          return {
            ...resource,
            value: result,
          };
        }

        if (resource.info?.contentType === "shopstoryBlock") {
          const result = shopstoryClient.add({
            _template: "TestComponent",
            _id: `zzz.${resource.id}`,
            entry: {
              id: `zzz.${resource.id}`,
            },
          });

          return {
            ...resource,
            value: result,
          };
        }

        return {
          ...resource,
          value: {
            id: `entry1.${resource.id}`,
          },
        };
      });

      return result;
    }
  );

  const entry2Fetcher = mock<FetchFunction>(
    async (resources, { shopstoryClient }) => {
      return resources.map((resource) => {
        if (resource.info?.contentType === "shopstoryBlock") {
          const result = shopstoryClient.add({
            _template: "TestComponent2",
            _id: `yyy.${resource.id}`,
            entry1: {
              id: `yyy.${resource.id}.1`,
            },
            entry2: {
              id: `yyy.${resource.id}.2`,
            },
            entry3: {
              id: `yyy.${resource.id}.3`,
            },
          });

          return {
            ...resource,
            value: result,
          };
        }

        return {
          ...resource,
          value: {
            id: `entry2.${resource.id}`,
          },
        };
      });
    }
  );

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      resourceTypes: {
        entry1: {
          fetch: entry1Fetcher,
        },
        entry2: {
          fetch: entry2Fetcher,
        },
      },
      components: [
        {
          id: "TestComponent",
          type: "item",
          schema: [
            {
              prop: "entry",
              type: "resource",
              resourceType: "entry1",
            },
          ],
        },
        {
          id: "TestComponent2",
          type: "item",
          schema: [
            {
              prop: "entry1",
              type: "resource",
              resourceType: "entry2",
            },
            {
              prop: "entry2",
              type: "resource",
              resourceType: "entry2",
            },
            {
              prop: "entry3",
              type: "resource",
              resourceType: "entry2",
            },
          ],
        },
      ],
    }),
    { locale: "en-US" }
  );

  const blocks: Array<RenderableContent> = [];

  blocks.push(
    shopstoryClient.add({
      _template: "TestComponent",
      _id: "c1",
      entry: {
        id: "xxx.entry1",
        info: {
          contentType: "shopstoryPage",
        },
      },
    })
  );

  blocks.push(
    shopstoryClient.add({
      _template: "TestComponent2",
      _id: "c2",
      entry1: {
        id: "xxx.entry2.1",
        info: {
          contentType: "shopstoryBlock",
        },
      },
      entry2: {
        id: "xxx.entry2.2",
        info: {
          contentType: "shopstoryBlock",
        },
      },
      entry3: {
        id: "xxx.entry2.3",
        info: {
          contentType: "shopstoryBlock",
        },
      },
    })
  );

  const meta = await shopstoryClient.build();

  expect(entry1Fetcher).toHaveBeenCalledTimes(3);
  expect(entry2Fetcher).toHaveBeenCalledTimes(2);

  const expectedEntry1ResourcesCount = 3;
  const expectedEntry2ResourcesCount = 3 + 3 * 3;

  expect(meta.resources).toHaveLength(
    expectedEntry1ResourcesCount + expectedEntry2ResourcesCount
  );
  expect(meta.resources).toEqual([
    // entry1 resources
    resolvedResource({
      id: "xxx.entry1",
      type: "entry1",
      values: {
        default: {
          renderableContent: expect.objectContaining({
            _id: "yyy.xxx.entry1",
            _template: "TestComponent",
          }),
        },
      },
      info: {
        contentType: "shopstoryPage",
      },
    }),
    resolvedResource({
      id: "yyy.xxx.entry1",
      type: "entry1",
      values: {
        default: {
          renderableContent: expect.objectContaining({
            _id: "zzz.yyy.xxx.entry1",
            _template: "TestComponent",
          }),
        },
      },
      info: {
        contentType: "shopstoryBlock",
      },
    }),
    resolvedResource({
      id: "zzz.yyy.xxx.entry1",
      type: "entry1",
      values: { default: { id: "entry1.zzz.yyy.xxx.entry1" } },
    }),
    // entry2 resources
    resolvedResource({
      id: "xxx.entry2.1",
      type: "entry2",
      values: {
        default: {
          renderableContent: expect.objectContaining({
            _id: "yyy.xxx.entry2.1",
            _template: "TestComponent2",
          }),
        },
      },
      info: {
        contentType: "shopstoryBlock",
      },
    }),
    resolvedResource({
      id: "xxx.entry2.2",
      type: "entry2",
      values: {
        default: {
          renderableContent: expect.objectContaining({
            _id: "yyy.xxx.entry2.2",
            _template: "TestComponent2",
          }),
        },
      },
      info: {
        contentType: "shopstoryBlock",
      },
    }),
    resolvedResource({
      id: "xxx.entry2.3",
      type: "entry2",
      values: {
        default: {
          renderableContent: expect.objectContaining({
            _id: "yyy.xxx.entry2.3",
            _template: "TestComponent2",
          }),
        },
      },
      info: {
        contentType: "shopstoryBlock",
      },
    }),
    resolvedResource({
      id: "yyy.xxx.entry2.1.1",
      type: "entry2",
      values: {
        default: {
          id: "entry2.yyy.xxx.entry2.1.1",
        },
      },
    }),
    resolvedResource({
      id: "yyy.xxx.entry2.1.2",
      type: "entry2",
      values: {
        default: {
          id: "entry2.yyy.xxx.entry2.1.2",
        },
      },
    }),
    resolvedResource({
      id: "yyy.xxx.entry2.1.3",
      type: "entry2",
      values: {
        default: {
          id: "entry2.yyy.xxx.entry2.1.3",
        },
      },
    }),
    resolvedResource({
      id: "yyy.xxx.entry2.2.1",
      type: "entry2",
      values: {
        default: {
          id: "entry2.yyy.xxx.entry2.2.1",
        },
      },
    }),
    resolvedResource({
      id: "yyy.xxx.entry2.2.2",
      type: "entry2",
      values: {
        default: {
          id: "entry2.yyy.xxx.entry2.2.2",
        },
      },
    }),
    resolvedResource({
      id: "yyy.xxx.entry2.2.3",
      type: "entry2",
      values: {
        default: {
          id: "entry2.yyy.xxx.entry2.2.3",
        },
      },
    }),
    resolvedResource({
      id: "yyy.xxx.entry2.3.1",
      type: "entry2",
      values: {
        default: {
          id: "entry2.yyy.xxx.entry2.3.1",
        },
      },
    }),
    resolvedResource({
      id: "yyy.xxx.entry2.3.2",
      type: "entry2",
      values: {
        default: {
          id: "entry2.yyy.xxx.entry2.3.2",
        },
      },
    }),
    resolvedResource({
      id: "yyy.xxx.entry2.3.3",
      type: "entry2",
      values: {
        default: {
          id: "entry2.yyy.xxx.entry2.3.3",
        },
      },
    }),
  ]);
});

test("doesn't refetch resources again if they were already fetched", async () => {
  const productFetchMock = mock<FetchFunction>(async (resources) => {
    return resources.map((resource) => {
      return {
        ...resource,
        value: {
          id: `product.${resource.id}`,
        },
      };
    });
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      resourceTypes: {
        product: {
          fetch: productFetchMock,
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
    _id: "xxx",
    product1: {
      id: "xxx.product1",
    },
  });

  await shopstoryClient.build();
  expect(productFetchMock).toHaveBeenCalledTimes(1);

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "yyy",
    product1: {
      id: "xxx.product1",
    },
  });

  await shopstoryClient.build();
  expect(productFetchMock).toHaveBeenCalledTimes(1);

  shopstoryClient.add({
    _template: "TestComponent",
    _id: "zzz",
    product1: {
      id: "xxx.product1",
    },
  });

  await shopstoryClient.build();
  expect(productFetchMock).toHaveBeenCalledTimes(1);
});

test("user can specify it's own error for resources", async () => {
  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      resourceTypes: {
        product: {
          fetch: async (resources) => {
            return resources.map((resource) => {
              return {
                ...resource,
                error: new Error(`Custom error for ${resource.id}!`),
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
            {
              prop: "product1",
              type: "resource",
              resourceType: "product",
            },
            {
              prop: "product2",
              type: "resource",
              resourceType: "product",
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
  });

  const meta = await shopstoryClient.build();

  expect(meta.resources).toEqual(
    expect.arrayContaining([
      rejectedResource({
        id: "product1",
        type: "product",
        error: new Error("Custom error for product1!"),
      }),
      rejectedResource({
        id: "product2",
        type: "product",
        error: new Error("Custom error for product2!"),
      }),
    ])
  );
});

test("resources with the same id, but different info and/or fetchParams should be stored as separated resources", async () => {
  const productFetchSpy = mock<FetchFunction>(async (resources) => {
    return resources.map((resource) => {
      return {
        ...resource,
        value: {
          id: resource.id,
        },
      };
    });
  });

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      resourceTypes: {
        product: {
          fetch: productFetchSpy,
        },
      },
      components: [
        {
          id: "TestComponent",
          type: "item",
          schema: [
            { prop: "product1", type: "resource", resourceType: "product" },
            { prop: "product2", type: "resource", resourceType: "product" },
            {
              prop: "product3",
              type: "resource",
              resourceType: "product",
              fetchParams: { include: 5 },
            },
            {
              prop: "product4",
              type: "resource",
              resourceType: "product",
              fetchParams: { include: 3 },
            },
            { prop: "product5", type: "resource", resourceType: "product" },
            { prop: "product6", type: "resource", resourceType: "product" },
            {
              prop: "product7",
              type: "resource",
              resourceType: "product",
              fetchParams: { include: 5 },
            },
            {
              prop: "product8",
              type: "resource",
              resourceType: "product",
              fetchParams: { include: 3 },
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
      id: "product1",
      info: {
        type: "shoes",
      },
    },
    product3: {
      id: "product1",
    },
    product4: {
      id: "product1",
    },
    product5: {
      id: "product1",
    },
    product6: {
      id: "product1",
      info: {
        type: "shoes",
      },
    },
    product7: {
      id: "product1",
    },
    product8: {
      id: "product1",
      info: {
        type: "shoes",
      },
    },
  });

  const meta = await shopstoryClient.build();

  expect(productFetchSpy).toHaveBeenCalledTimes(1);
  expect(productFetchSpy).toHaveBeenNthCalledWith(
    1,
    [
      {
        id: "product1",
        type: "product",
      },
      {
        id: "product1",
        type: "product",
        info: {
          type: "shoes",
        },
      },
      {
        id: "product1",
        type: "product",
        fetchParams: { include: 5 },
      },
      {
        id: "product1",
        type: "product",
        fetchParams: { include: 3 },
      },
      {
        id: "product1",
        type: "product",
        info: {
          type: "shoes",
        },
        fetchParams: { include: 3 },
      },
    ],
    expect.any(Object)
  );
  expect(meta.resources).toHaveLength(5);
  expect(meta.resources).toEqual<Array<SerializableResource>>([
    {
      error: null,
      id: "product1",
      status: "success",
      type: "product",
      values: { default: { id: "product1" } },
    },
    {
      error: null,
      id: "product1",
      info: { type: "shoes" },
      status: "success",
      type: "product",
      values: { default: { id: "product1" } },
    },
    {
      error: null,
      id: "product1",
      fetchParams: { include: 5 },
      status: "success",
      type: "product",
      values: { default: { id: "product1" } },
    },
    {
      error: null,
      id: "product1",
      fetchParams: { include: 3 },
      status: "success",
      type: "product",
      values: { default: { id: "product1" } },
    },
    {
      error: null,
      id: "product1",
      info: { type: "shoes" },
      fetchParams: { include: 3 },
      status: "success",
      type: "product",
      values: { default: { id: "product1" } },
    },
  ]);
});

test("fetches resources for config returned from API when input is a remote content", async () => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async (): Promise<ConfigDTO> => ({
      id: "xxx",
      config: {
        _id: "123",
        _template: "TestComponent",
        product1: {
          id: "product1",
        },
        product2: {
          id: "product2",
        },
      },
      created_at: "",
      parent_id: null,
      project_id: "",
      metadata: null,
      updated_at: "",
    }),

    // We cast to Response object and only declare necessary properties
  } as unknown as Response);

  global.fetch = fetchMock;

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      accessToken: "test access token",
      resourceTypes: {
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

  const remoteContent: RawContentRemote = {
    id: "xxx",
    hash: "yyy",
  };

  shopstoryClient.add(remoteContent);

  const meta = await shopstoryClient.build();

  expect(meta.resources).toHaveLength(2);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/\/api\/configs\/xxx\?locale=en-US$/),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-shopstory-access-token": "test access token",
      },
    }
  );

  fetchMock.mockReset();
});

test("fetches resources for multiple configs returned from API when inputs are remote content", async () => {
  const fetchMock = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async (): Promise<ConfigDTO> => ({
        id: "xxx",
        config: {
          _id: "123",
          _template: "TestComponent",
          product1: {
            id: "product1",
          },
          product2: {
            id: "product2",
          },
        },
        created_at: "",
        parent_id: null,
        project_id: "",
        metadata: null,
        updated_at: "",
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async (): Promise<ConfigDTO> => ({
        id: "yyy",
        config: {
          _id: "456",
          _template: "TestComponent",
          product1: {
            id: "product3",
          },
          product2: {
            id: "product4",
          },
        },
        created_at: "",
        parent_id: null,
        project_id: "",
        metadata: null,
        updated_at: "",
      }),
    });

  global.fetch = fetchMock;

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      accessToken: "test access token",
      resourceTypes: {
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

  const remoteContent1: RawContentRemote = {
    id: "xxx",
    hash: "yyy",
  };

  const remoteContent2: RawContentRemote = {
    id: "yyy",
    hash: "zzz",
  };

  shopstoryClient.add(remoteContent1);
  shopstoryClient.add(remoteContent2);

  const meta = await shopstoryClient.build();

  expect(meta.resources).toHaveLength(4);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/\/api\/configs\/xxx\?locale=en-US$/),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-shopstory-access-token": "test access token",
      },
    }
  );
  expect(fetchMock).toHaveBeenNthCalledWith(
    2,
    expect.stringMatching(/\/api\/configs\/yyy\?locale=en-US$/),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-shopstory-access-token": "test access token",
      },
    }
  );

  fetchMock.mockReset();
});

test("returns compiled default template for given mode when input is nullish", async () => {
  const shopstoryClient = new ShopstoryClient(createTestConfig(), {
    locale: "en-US",
  });

  const nullContent = shopstoryClient.add(null);
  const undefinedContent = shopstoryClient.add(undefined);
  const nullGrid = shopstoryClient.add(null, { mode: "grid" });
  const undefinedGrid = shopstoryClient.add(null, { mode: "grid" });

  await shopstoryClient.build();

  const expectedCompiledContent: CompiledComponentConfig = {
    _id: expect.any(String),
    _template: "$RootSections",
    components: {
      data: [],
    },
    actions: {},
    textModifiers: {},
    props: expect.any(Object),
    styled: expect.any(Object),
  };

  expect(nullContent.renderableContent).toEqual(expectedCompiledContent);
  expect(undefinedContent.renderableContent).toEqual(expectedCompiledContent);

  const expectedCompiledGrid: CompiledComponentConfig = {
    _id: expect.any(String),
    _template: "$RootGrid",
    components: {
      data: [
        {
          _id: expect.any(String),
          _template: "$Grid",
          components: expect.objectContaining({
            Component: [
              expect.objectContaining({
                _template: "$GridCard",
              }),
            ],
          }),
          actions: {},
          textModifiers: {},
          props: expect.any(Object),
          styled: expect.any(Object),
        },
      ],
    },
    actions: {},
    textModifiers: {},
    props: expect.any(Object),
    styled: expect.any(Object),
  };

  expect(nullGrid.renderableContent).toEqual(expectedCompiledGrid);
  expect(undefinedGrid.renderableContent).toEqual(expectedCompiledGrid);
});

test("returns meta with serialized definitions of all components that were used", async () => {
  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      components: [
        {
          id: "TestComponent1",
          type: "item",
          schema: [],
        },
        {
          id: "TestComponent2",
          type: "section",
          schema: [],
        },
      ],
      buttons: [
        {
          id: "TestComponent3",
          schema: [],
        },
      ],
    }),
    { locale: "en-US" }
  );

  shopstoryClient.add({ _template: "TestComponent1", _id: "xxx" });
  shopstoryClient.add({ _template: "TestComponent2", _id: "yyy" });
  shopstoryClient.add({ _template: "TestComponent3", _id: "zzz" });

  const meta = await shopstoryClient.build();

  expect(meta.vars.definitions.components).toHaveLength(3);
  expect(meta.vars.definitions.components.map((d: any) => d.id)).toEqual(
    expect.arrayContaining([
      "TestComponent1",
      "TestComponent2",
      "TestComponent3",
    ])
  );
});

test("stores different transforms of the same result under one resource", async () => {
  const productFetchSpy = mock<FetchFunction>(async (resources) => {
    return resources.map((resource) => {
      return {
        ...resource,
        value: {
          sku: "123456789",
          variant: "small",
          price: 29.99,
          currency: "USD",
        },
      };
    });
  });

  function getProductSku(product: any) {
    return product.sku;
  }

  function getPriceAndCurrency(product: any) {
    return {
      price: product.price,
      currency: product.currency,
    };
  }

  const shopstoryClient = new ShopstoryClient(
    createTestConfig({
      resourceTypes: {
        product: {
          fetch: productFetchSpy,
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
              resourceType: "product",
              transform: getProductSku,
            },
            {
              prop: "product2",
              type: "resource",
              resourceType: "product",
              transform: getProductSku,
            },
            {
              prop: "product3",
              type: "resource",
              resourceType: "product",
              transform: getPriceAndCurrency,
            },
            { prop: "product4", type: "resource", resourceType: "product" },
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
      id: "xyz",
    },
    product2: {
      id: "xyz",
    },
    product3: {
      id: "xyz",
    },
    product4: {
      id: "xyz",
    },
  });

  const meta = await shopstoryClient.build();

  expect(productFetchSpy).toHaveBeenCalledTimes(1);
  expect(productFetchSpy).toHaveBeenNthCalledWith<Parameters<FetchFunction>>(
    1,
    [
      {
        id: "xyz",
        type: "product",
      },
    ],
    expect.any(Object)
  );
  expect(meta.resources).toHaveLength(1);
  expect(meta.resources).toEqual<Array<SerializableResource>>([
    {
      error: null,
      id: "xyz",
      status: "success",
      type: "product",
      values: {
        default: {
          sku: "123456789",
          variant: "small",
          price: 29.99,
          currency: "USD",
        },
        [getTransformHash(getPriceAndCurrency)]: {
          price: 29.99,
          currency: "USD",
        },
        [getTransformHash(getProductSku)]: "123456789",
      },
    },
  ]);
});

describe("image and video", () => {
  test("fetches image and video together with other resources of their underlying resource type", async () => {
    const mediaTypeFetchMock = mock<FetchFunction>(async (resources) => {
      return resources.map((resource) => {
        return {
          ...resource,
          value: {
            id: resource.id,
          },
        };
      });
    });

    const imageTransformer: ImageTransformer = (data) => {
      return {
        alt: "Image",
        aspectRatio: 1,
        mimeType: "image/test",
        srcset: [{ url: `some_url_${data.id}`, w: 100, h: 100 }],
        url: `some_url_${data.id}`,
      };
    };

    const videoTransformer: VideoTransformer = (data) => {
      return {
        alt: "Video",
        aspectRatio: 1,
        url: `some_url_${data.id}`,
      };
    };

    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        resourceTypes: {
          product: {
            fetch: async (resources) => {
              return resources.map((resource) => {
                return {
                  ...resource,
                  value: {
                    id: resource.id,
                    name: `Product ${resource.id}`,
                  },
                };
              });
            },
          },
          media: {
            fetch: mediaTypeFetchMock,
          },
        },
        plugins: [
          {
            id: "myplugin",
            launcher: {
              onEditorLoad: () => {},
              image: {
                resourceType: "media",
                transform: imageTransformer,
              },
              video: {
                resourceType: "media",
                transform: videoTransformer,
              },
            },
          },
        ],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [
              { prop: "product1", type: "resource", resourceType: "product" },
              { prop: "media1", type: "resource", resourceType: "media" },
              {
                prop: "image1",
                type: "image",
              },
              {
                prop: "video1",
                type: "video",
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
      media1: {
        id: "media1",
      },
      image1: {
        id: "image1",
      },
      video1: {
        id: "video1",
      },
    });

    const meta = await shopstoryClient.build();

    expect(mediaTypeFetchMock).toHaveBeenCalledTimes(1);
    expect(mediaTypeFetchMock).toHaveBeenNthCalledWith<
      Parameters<FetchFunction>
    >(
      1,
      [
        {
          id: "media1",
          type: "media",
        },
        {
          id: "image1",
          type: "media",
        },
        {
          id: "video1",
          type: "media",
        },
      ],
      expect.any(Object)
    );
    expect(meta.resources).toHaveLength(4);
    expect(meta.resources).toEqual<Array<SerializableResource>>(
      expect.arrayContaining([
        resolvedResource({
          id: "product1",
          type: "product",
          values: { default: { id: "product1", name: "Product product1" } },
        }),
        resolvedResource({
          id: "media1",
          type: "media",
          values: { default: { id: "media1" } },
        }),
        resolvedResource({
          id: "image1",
          type: "media",
          values: {
            [getTransformHash(imageTransformer)]: {
              alt: "Image",
              aspectRatio: 1,
              mimeType: "image/test",
              srcset: [{ url: "some_url_image1", w: 100, h: 100 }],
              url: "some_url_image1",
            },
          },
        }),
        resolvedResource({
          id: "video1",
          type: "media",
          values: {
            [getTransformHash(videoTransformer)]: {
              alt: "Video",
              aspectRatio: 1,
              url: "some_url_video1",
            },
          },
        }),
      ])
    );
  });

  test("passes fetch params specified for image and video to fetch", async () => {
    const imageAssetFetchMock = mock<FetchFunction>(async (resources) => {
      return resources.map((resource) => {
        return {
          ...resource,
          value: {
            id: resource.id,
            mimeType: "image/jpeg",
          },
        };
      });
    });

    const videoAssetFetchMock = mock<FetchFunction>(async (resources) => {
      return resources.map((resource) => {
        return {
          ...resource,
          value: {
            id: resource.id,
            format: "mp4",
          },
        };
      });
    });

    const imageTransformer: ImageTransformer = (imageAssetResource) => {
      return {
        alt: "Image",
        aspectRatio: 1,
        mimeType: imageAssetResource.mimeType,
        srcset: [{ url: `image_src/${imageAssetResource.id}`, w: 100, h: 100 }],
        url: `image_src/${imageAssetResource.id}`,
      };
    };

    const videoTransformer: VideoTransformer = (videoAssetResource) => {
      return {
        alt: "Video",
        aspectRatio: 1,
        url: `video_src/${videoAssetResource.id}`,
      };
    };

    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        resourceTypes: {
          imageAsset: {
            fetch: imageAssetFetchMock,
          },
          videoAsset: {
            fetch: videoAssetFetchMock,
          },
        },
        plugins: [
          {
            id: "myplugin",
            launcher: {
              onEditorLoad: () => {},
              image: {
                resourceType: "imageAsset",
                transform: imageTransformer,
                fetchParams: {
                  quality: 90,
                },
              },
              video: {
                resourceType: "videoAsset",
                transform: videoTransformer,
                fetchParams: {
                  quality: "720p",
                },
              },
            },
          },
        ],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [
              {
                prop: "video1",
                type: "video",
              },
              {
                prop: "image1",
                type: "image",
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
      video1: {
        id: "video1",
      },
      image1: {
        id: "image1",
      },
    });

    shopstoryClient.add({
      _template: "TestComponent",
      _id: "xxx",
      video1: {
        id: "video2",
      },
      image1: {
        id: "image2",
      },
    });

    await shopstoryClient.build();

    expect(imageAssetFetchMock).toHaveBeenCalledTimes(1);
    expect(imageAssetFetchMock).toHaveBeenNthCalledWith<
      Parameters<FetchFunction>
    >(
      1,
      [
        {
          id: "image1",
          type: "imageAsset",
          fetchParams: {
            quality: 90,
          },
        },
        {
          id: "image2",
          type: "imageAsset",
          fetchParams: {
            quality: 90,
          },
        },
      ],
      expect.any(Object)
    );
    expect(videoAssetFetchMock).toHaveBeenCalledTimes(1);
    expect(videoAssetFetchMock).toHaveBeenNthCalledWith<
      Parameters<FetchFunction>
    >(
      1,
      [
        {
          id: "video1",
          type: "videoAsset",
          fetchParams: {
            quality: "720p",
          },
        },
        {
          id: "video2",
          type: "videoAsset",
          fetchParams: {
            quality: "720p",
          },
        },
      ],
      expect.any(Object)
    );
  });

  test("runs postFetch on image and video together with other resources of underlying resource type", async () => {
    const mediaTypePostFetchMock = mock<PostFetchFunction>(
      async (resources) => {
        return resources;
      }
    );

    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        resourceTypes: {
          product: {
            fetch: async (resources) => {
              return resources.map((resource) => {
                return {
                  ...resource,
                  value: {
                    id: resource.id,
                    name: `Product ${resource.id}`,
                  },
                };
              });
            },
          },
          media: {
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
            postFetch: mediaTypePostFetchMock,
          },
        },
        plugins: [
          {
            id: "plugin",
            launcher: {
              onEditorLoad: () => {},
              image: {
                resourceType: "media",
                transform: defaultTestImageTransformer,
              },
              video: {
                resourceType: "media",
                transform: defaultTestVideoTransformer,
              },
            },
          },
        ],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [
              { prop: "media1", type: "resource", resourceType: "media" },
              { prop: "media2", type: "resource", resourceType: "media" },
              {
                prop: "image1",
                type: "image",
              },
              {
                prop: "video1",
                type: "video",
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
      media1: {
        id: "media1",
      },
      image1: {
        id: "image1",
      },
      video1: {
        id: "video1",
      },
    });

    const meta = await shopstoryClient.build();

    expect(mediaTypePostFetchMock).toHaveBeenCalledTimes(1);
    expect(mediaTypePostFetchMock).toHaveBeenNthCalledWith<
      Parameters<PostFetchFunction>
    >(
      1,
      [
        {
          id: "media1",
          type: "media",
          value: { id: "media1" },
        },
        {
          id: "image1",
          type: "media",
          value: { id: "image1" },
        },
        {
          id: "video1",
          type: "media",
          value: { id: "video1" },
        },
      ],
      expect.any(Object)
    );
    expect(meta.resources).toHaveLength(3);
    expect(meta.resources).toEqual(
      expect.arrayContaining([
        resolvedResource({
          id: "media1",
          type: "media",
          values: { default: { id: "media1" } },
        }),
        resolvedResource({
          id: "image1",
          type: "media",
          values: {
            [getTransformHash(defaultTestImageTransformer)]: {
              alt: "Image",
              aspectRatio: 1,
              mimeType: "image/test",
              srcset: [{ url: "some_url_image1", w: 100, h: 100 }],
              url: "some_url_image1",
            },
          },
        }),
        resolvedResource({
          id: "video1",
          type: "media",
          values: {
            [getTransformHash(defaultTestVideoTransformer)]: {
              alt: "Video",
              aspectRatio: 1,
              url: "some_url_video1",
            },
          },
        }),
      ])
    );
  });

  test("invokes transformer for image and video", async () => {
    const imageTransform = mock<ImageTransformer>((imageAssetResource) => {
      return {
        alt: "Image",
        aspectRatio: 1,
        mimeType: imageAssetResource.mimeType,
        srcset: [{ url: `image_src/${imageAssetResource.id}`, w: 100, h: 100 }],
        url: `image_src/${imageAssetResource.id}`,
      };
    });

    const videoTransform = mock<VideoTransformer>((videoAssetResource) => {
      return {
        alt: "Video",
        aspectRatio: 1,
        url: `video_src/${videoAssetResource.id}`,
      };
    });

    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        resourceTypes: {
          imageAsset: {
            fetch: async (resources) => {
              return resources.map((resource) => {
                return {
                  ...resource,
                  value: {
                    id: resource.id,
                    mimeType: "image/jpeg",
                  },
                };
              });
            },
          },
          videoAsset: {
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
        plugins: [
          {
            id: "myplugin",
            launcher: {
              onEditorLoad: () => {},
              image: {
                resourceType: "imageAsset",
                transform: imageTransform,
              },
              video: {
                resourceType: "videoAsset",
                transform: videoTransform,
              },
            },
          },
        ],

        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [
              {
                prop: "video1",
                type: "video",
              },
              {
                prop: "image1",
                type: "image",
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
      video1: {
        id: "video1",
      },
      image1: {
        id: "image1",
      },
    });

    shopstoryClient.add({
      _template: "TestComponent",
      _id: "xxx",
      video1: {
        id: "video2",
      },
      image1: {
        id: "image2",
      },
    });

    const meta = await shopstoryClient.build();

    expect(meta.resources).toHaveLength(4);
    expect(meta.resources).toEqual(
      expect.arrayContaining([
        resolvedResource({
          id: "image1",
          type: "imageAsset",
          values: {
            [getTransformHash(imageTransform)]: {
              alt: "Image",
              aspectRatio: 1,
              mimeType: "image/jpeg",
              srcset: [{ url: `image_src/image1`, w: 100, h: 100 }],
              url: `image_src/image1`,
            },
          },
        }),
        resolvedResource({
          id: "image2",
          type: "imageAsset",
          values: {
            [getTransformHash(imageTransform)]: {
              alt: "Image",
              aspectRatio: 1,
              mimeType: "image/jpeg",
              srcset: [{ url: `image_src/image2`, w: 100, h: 100 }],
              url: `image_src/image2`,
            },
          },
        }),
        resolvedResource({
          id: "video1",
          type: "videoAsset",
          values: {
            [getTransformHash(videoTransform)]: {
              alt: "Video",
              aspectRatio: 1,
              url: `video_src/video1`,
            },
          },
        }),
        resolvedResource({
          id: "video2",
          type: "videoAsset",
          values: {
            [getTransformHash(videoTransform)]: {
              alt: "Video",
              aspectRatio: 1,
              url: `video_src/video2`,
            },
          },
        }),
      ])
    );
    expect(imageTransform).toHaveBeenCalledTimes(2);
    expect(videoTransform).toHaveBeenCalledTimes(2);
  });
});

describe("documents", () => {
  test("uses config given in document input if it's present", async () => {
    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        components: [
          {
            id: "$TestComponent",
            schema: [],
          },
        ],
      }),
      { locale: "en-US" }
    );

    const testDocument: Document = {
      documentId: "xxx",
      preview: { mode: "content", sectionsCount: 1 },
      projectId: "yyy",
      config: {
        _template: "$TestComponent",
        _id: "xxx",
      },
    };

    shopstoryClient.add(testDocument);

    await shopstoryClient.build();
  });

  test("uses config given in document input if it's present and preview property is missing", async () => {
    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        components: [
          {
            id: "$TestComponent",
            schema: [],
          },
        ],
      }),
      { locale: "en-US" }
    );

    const testDocument: Document = {
      documentId: "xxx",
      projectId: "yyy",
      config: {
        _template: "$TestComponent",
        _id: "xxx",
      },
    };

    shopstoryClient.add(testDocument);

    await shopstoryClient.build();
  });

  test("fetches config for input document from API when config property isn't present", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async (): Promise<DocumentWithResolvedConfigDTO> => ({
        archived: false,
        config: {
          config: {
            _template: "$TestComponent",
            _id: "123",
          },
          created_at: "",
          id: "zzz",
          metadata: null,
          parent_id: null,
          project_id: "yyy",
          updated_at: "",
        },
        config_id: "zzz",
        created_at: "",
        id: "xxx",
        project_id: "yyy",
        source: "test",
        title: "Untitled",
        unique_source_identifier: null,
        updated_at: "",
        version: 0,
      }),
    });

    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        accessToken: "test access token",
        components: [
          {
            id: "$TestComponent",
            schema: [],
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

    const testDocument: Document = {
      documentId: "xxx",
      preview: { mode: "content", sectionsCount: 1 },
      projectId: "yyy",
    };

    shopstoryClient.add(testDocument);

    await shopstoryClient.build();
  });
});

const testPluginDefaultImageFetch = mock<DefaultFetchFunction>(
  async (resources) => {
    return resources.map((r) => {
      return {
        ...r,
        value: {
          id: r.id,
          width: 1920,
          height: 1080,
          alt: `Image ${r.id}`,
        },
      };
    });
  }
);

const testPluginDefaultVideoFetch = mock<DefaultFetchFunction>(
  async (resources) => {
    return resources.map((r) => {
      return {
        ...r,
        value: {
          id: r.id,
          alt: `Video ${r.id}`,
        },
      };
    });
  }
);

const testPlugin: LauncherPlugin = {
  id: "test",
  launcher: {
    image: {
      resourceType: "test.image",
      transform: (value) => {
        return {
          alt: value.alt,
          aspectRatio: value.width / value.height,
          mimeType: "image/jpeg",
          srcset: [
            {
              h: value.height,
              url: `/images/${value.id}.jpeg`,
              w: value.width,
            },
          ],
          url: `/images/${value.id}.jpeg`,
        };
      },
    },
    onEditorLoad() {},
    video: {
      resourceType: "test.video",
      transform: (value) => {
        return {
          alt: value.alt,
          aspectRatio: 1,
          url: `/videos/${value.id}.mp4`,
        };
      },
    },
  },
  resources: {
    "test.image": {
      defaultFetch: testPluginDefaultImageFetch,
      widget: () => ({
        type: "custom",
        component: () => {
          new Error("Not implemented");
        },
      }),
    },
    "test.video": {
      defaultFetch: testPluginDefaultVideoFetch,
      widget: () => ({
        type: "custom",
        component: () => {
          new Error("Not implemented");
        },
      }),
    },
  },
};

test("returns empty resources if no content was added", async () => {
  const shopstoryClient = new ShopstoryClient(createTestConfig(), {
    locale: "en-US",
  });
  const meta = await shopstoryClient.build();

  expect(meta.resources).toEqual([]);
});

describe("image variants", () => {
  const customImageResourceFetch = mock<FetchFunction>(async (resources) => {
    return resources.map((r) => {
      return {
        ...r,
        value: {
          id: r.id,
          width: 1920,
          height: 1080,
          alt: `Custom image ${r.id}`,
        },
      };
    });
  });

  const customImageResourceDefinition: ResourceDefinition = {
    fetch: customImageResourceFetch,
  };

  afterEach(() => {
    testPluginDefaultImageFetch.mockClear();
    customImageResourceFetch.mockClear();
  });

  it("fetches resources for image props using default variant from launcher plugin when variant is set to default or is missing", async () => {
    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        plugins: [testPlugin],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [
              { prop: "image1", type: "image" },
              { prop: "image2", type: "image" },
            ],
          },
        ],
        resourceTypes: {
          customImage: customImageResourceDefinition,
        },
        imageVariants: [
          {
            id: "customImageSource",
            resourceType: "customImage",
            transform: (v) => v,
          },
        ],
      }),
      { locale: "en-US" }
    );

    shopstoryClient.add({
      _id: "123",
      _template: "TestComponent",
      image1: {
        id: "image1",
        variant: "test.default",
      },
      image2: {
        id: "image2",
      },
    });

    const meta = await shopstoryClient.build();

    expect(meta.resources).toHaveLength(2);
    expect(meta.resources).toEqual([
      resolvedResource({
        id: "image1",
        type: "test.image",
        values: {
          [getTransformHash(testPlugin.launcher.image.transform)]: {
            alt: `Image image1`,
            aspectRatio: 1.7777777777777777,
            mimeType: "image/jpeg",
            srcset: [
              {
                h: 1080,
                url: `/images/image1.jpeg`,
                w: 1920,
              },
            ],
            url: `/images/image1.jpeg`,
          },
        },
      }),
      resolvedResource({
        id: "image2",
        type: "test.image",
        values: {
          [getTransformHash(testPlugin.launcher.image.transform)]: {
            alt: `Image image2`,
            aspectRatio: 1.7777777777777777,
            mimeType: "image/jpeg",
            srcset: [
              {
                h: 1080,
                url: `/images/image2.jpeg`,
                w: 1920,
              },
            ],
            url: `/images/image2.jpeg`,
          },
        },
      }),
    ]);
    expect(customImageResourceFetch).not.toHaveBeenCalled();
    expect(testPluginDefaultImageFetch).toHaveBeenCalledTimes(1);
    expect(testPluginDefaultImageFetch).toHaveBeenNthCalledWith(
      1,
      [
        {
          id: "image1",
          type: "test.image",
        },
        {
          id: "image2",
          type: "test.image",
        },
      ],
      expect.any(Object)
    );
  });

  it("fetches resource for image prop using custom image variant when it's set", async () => {
    const customImageVariant: ImageVariant = {
      id: "customImageVariant",
      resourceType: "customImage",
      transform: (value) => {
        return {
          ...value,
          width: value.width * 2,
          height: value.height * 2,
        };
      },
      fetchParams: {
        someParam1: true,
      },
    };

    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        plugins: [testPlugin],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [{ prop: "image1", type: "image" }],
          },
        ],
        resourceTypes: {
          customImage: customImageResourceDefinition,
        },
        imageVariants: [customImageVariant],
      }),
      { locale: "en-US" }
    );

    shopstoryClient.add({
      _id: "123",
      _template: "TestComponent",
      image1: {
        id: "image1",
        variant: "customImageVariant",
      },
    });

    const meta = await shopstoryClient.build();

    expect(meta.resources).toHaveLength(1);
    expect(meta.resources[0]).toEqual(
      resolvedResource({
        id: "image1",
        type: "customImage",
        values: {
          [getTransformHash(customImageVariant.transform)]: {
            id: "image1",
            width: 1920 * 2,
            height: 1080 * 2,
            alt: `Custom image image1`,
          },
        },
        fetchParams: { someParam1: true },
      })
    );
    expect(testPluginDefaultImageFetch).not.toHaveBeenCalled();
    expect(customImageResourceFetch).toHaveBeenCalledTimes(1);
    expect(customImageResourceFetch).toHaveBeenNthCalledWith(
      1,
      [
        {
          id: "image1",
          type: "customImage",
          fetchParams: { someParam1: true },
        },
      ],
      expect.any(Object)
    );
  });
});

describe("video variants", () => {
  const customVideoResourceFetch = mock<FetchFunction>(async (resources) => {
    return resources.map((r) => {
      return {
        ...r,
        value: {
          id: r.id,
          aspectRatio: 1,
          alt: `Custom video ${r.id}`,
        },
      };
    });
  });

  const customVideoResourceDefinition: ResourceDefinition = {
    fetch: customVideoResourceFetch,
  };

  afterEach(() => {
    testPluginDefaultVideoFetch.mockClear();
    customVideoResourceFetch.mockClear();
  });

  it("fetches resources for video props using default variant from launcher plugin when variant is set to default or is missing", async () => {
    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        plugins: [testPlugin],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [
              { prop: "video1", type: "video" },
              { prop: "video2", type: "video" },
            ],
          },
        ],
        resourceTypes: {
          customVideo: customVideoResourceDefinition,
        },
        imageVariants: [
          {
            id: "customVideoVariant",
            resourceType: "customVideo",
            transform: (v) => v,
          },
        ],
      }),
      { locale: "en-US" }
    );

    shopstoryClient.add({
      _id: "123",
      _template: "TestComponent",
      video1: {
        id: "video1",
        variant: "test.default",
      },
      video2: {
        id: "video2",
      },
    });

    const meta = await shopstoryClient.build();

    expect(meta.resources).toHaveLength(2);
    expect(meta.resources).toEqual([
      resolvedResource({
        id: "video1",
        type: "test.video",
        values: {
          [getTransformHash(testPlugin.launcher.video.transform)]: {
            alt: `Video video1`,
            aspectRatio: 1,
            url: `/videos/video1.mp4`,
          },
        },
      }),
      resolvedResource({
        id: "video2",
        type: "test.video",
        values: {
          [getTransformHash(testPlugin.launcher.video.transform)]: {
            alt: `Video video2`,
            aspectRatio: 1,
            url: `/videos/video2.mp4`,
          },
        },
      }),
    ]);
    expect(customVideoResourceFetch).not.toHaveBeenCalled();
    expect(testPluginDefaultVideoFetch).toHaveBeenCalledTimes(1);
    expect(testPluginDefaultVideoFetch).toHaveBeenNthCalledWith(
      1,
      [
        {
          id: "video1",
          type: "test.video",
        },
        {
          id: "video2",
          type: "test.video",
        },
      ],
      expect.any(Object)
    );
  });

  it("fetches resource for video prop using custom video variant when it's set", async () => {
    const customVideoVariant: VideoVariant = {
      id: "customVideoVariant",
      resourceType: "customVideo",
      transform: (value) => {
        return {
          ...value,
          aspectRatio: 1,
          alt: `Custom video ${value.id}`,
        };
      },
      fetchParams: {
        someParam1: true,
      },
    };

    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        plugins: [testPlugin],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [{ prop: "video1", type: "video" }],
          },
        ],
        resourceTypes: {
          customVideo: customVideoResourceDefinition,
        },
        videoVariants: [customVideoVariant],
      }),
      { locale: "en-US" }
    );

    shopstoryClient.add({
      _id: "123",
      _template: "TestComponent",
      video1: {
        id: "video1",
        variant: "customVideoVariant",
      },
    });

    const meta = await shopstoryClient.build();

    expect(meta.resources).toHaveLength(1);
    expect(meta.resources[0]).toEqual(
      resolvedResource({
        id: "video1",
        type: "customVideo",
        values: {
          [getTransformHash(customVideoVariant.transform)]: {
            id: "video1",
            aspectRatio: 1,
            alt: `Custom video video1`,
          },
        },
        fetchParams: { someParam1: true },
      })
    );
    expect(testPluginDefaultVideoFetch).not.toHaveBeenCalled();
    expect(customVideoResourceFetch).toHaveBeenCalledTimes(1);
    expect(customVideoResourceFetch).toHaveBeenNthCalledWith(
      1,
      [
        {
          id: "video1",
          type: "customVideo",
          fetchParams: { someParam1: true },
        },
      ],
      expect.any(Object)
    );
  });
});

describe("resource variants", () => {
  afterEach(() => {
    testPluginDefaultImageFetch.mockClear();
  });

  it("fetches resource using default variant if no variant is given", async () => {
    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        plugins: [testPlugin],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [
              {
                prop: "resource1",
                type: "resource",
                variants: [
                  {
                    id: "customResourceSource1",
                    resourceType: "test.image",
                  },
                  {
                    id: "customResourceSource2",
                    resourceType: "test.image",
                  },
                ],
                defaultVariantId: "customResourceSource2",
              },
            ],
          },
        ],
      }),
      { locale: "en-US" }
    );

    shopstoryClient.add({
      _id: "123",
      _template: "TestComponent",
      resource1: {
        id: "resource1",
      },
    });

    const meta = await shopstoryClient.build();

    expect(meta.resources).toHaveLength(1);
    expect(meta.resources[0]).toEqual(
      resolvedResource({
        id: "resource1",
        type: "test.image",
        values: {
          default: {
            alt: "Image resource1",
            height: 1080,
            id: "resource1",
            width: 1920,
          },
        },
      })
    );
    expect(testPluginDefaultImageFetch).toHaveBeenCalledTimes(1);
    expect(testPluginDefaultImageFetch).toHaveBeenNthCalledWith(
      1,
      [
        {
          id: "resource1",
          type: "test.image",
        },
      ],
      expect.any(Object)
    );
  });

  it("fetches resource using given variant", async () => {
    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        plugins: [testPlugin],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [
              {
                prop: "resource1",
                type: "resource",
                variants: [
                  {
                    id: "customResourceSource1",
                    resourceType: "test.image",
                  },
                  {
                    id: "customResourceSource2",
                    resourceType: "test.image",
                  },
                ],
                defaultVariantId: "customResourceSource1",
              },
            ],
          },
        ],
      }),
      { locale: "en-US" }
    );

    shopstoryClient.add({
      _id: "123",
      _template: "TestComponent",
      resource1: {
        id: "resource1",
        variant: "customResourceSource2",
      },
    });

    const meta = await shopstoryClient.build();

    expect(meta.resources).toHaveLength(1);
    expect(meta.resources[0]).toEqual(
      resolvedResource({
        id: "resource1",
        type: "test.image",
        values: {
          default: {
            alt: "Image resource1",
            height: 1080,
            id: "resource1",
            width: 1920,
          },
        },
      })
    );
    expect(testPluginDefaultImageFetch).toHaveBeenCalledTimes(1);
    expect(testPluginDefaultImageFetch).toHaveBeenNthCalledWith(
      1,
      [
        {
          id: "resource1",
          type: "test.image",
        },
      ],
      expect.any(Object)
    );
  });

  it("fetches resource using given variant and transforms the result using given transformer", async () => {
    const transformer = mock<ResourceTransformer<any, any>>((value) => {
      return {
        ...value,
        width: 2 * value.width,
        height: 2 * value.height,
      };
    });

    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        plugins: [testPlugin],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [
              {
                prop: "resource1",
                type: "resource",
                variants: [
                  {
                    id: "customResourceSource1",
                    resourceType: "test.image",
                    transform: transformer,
                  },
                  {
                    id: "customResourceSource2",
                    resourceType: "test.image",
                  },
                ],
                defaultVariantId: "customResourceSource1",
              },
            ],
          },
        ],
      }),
      { locale: "en-US" }
    );

    shopstoryClient.add({
      _id: "123",
      _template: "TestComponent",
      resource1: {
        id: "resource1",
        variant: "customResourceSource1",
      },
    });

    const meta = await shopstoryClient.build();

    expect(meta.resources).toHaveLength(1);
    expect(meta.resources[0]).toEqual(
      resolvedResource({
        id: "resource1",
        type: "test.image",
        values: {
          ee6a637f024a7bf78cc8479d477dd2b38dbb0967: {
            alt: "Image resource1",
            height: 2 * 1080,
            id: "resource1",
            width: 2 * 1920,
          },
        },
      })
    );
    expect(transformer).toHaveBeenCalledTimes(1);
  });

  it("fetches resource with given fetch params for given variant", async () => {
    const shopstoryClient = new ShopstoryClient(
      createTestConfig({
        plugins: [testPlugin],
        components: [
          {
            id: "TestComponent",
            type: "item",
            schema: [
              {
                prop: "resource1",
                type: "resource",
                variants: [
                  {
                    id: "customResourceSource1",
                    resourceType: "test.image",
                  },
                  {
                    id: "customResourceSource2",
                    resourceType: "test.image",
                    fetchParams: {
                      testParam1: "value1",
                      testParam2: 666, // 😈
                    },
                  },
                ],
                defaultVariantId: "customResourceSource1",
              },
            ],
          },
        ],
      }),
      { locale: "en-US" }
    );

    shopstoryClient.add({
      _id: "123",
      _template: "TestComponent",
      resource1: {
        id: "resource1",
        variant: "customResourceSource2",
      },
    });

    const meta = await shopstoryClient.build();

    expect(meta.resources).toHaveLength(1);
    expect(meta.resources[0]).toEqual(
      resolvedResource({
        id: "resource1",
        type: "test.image",
        values: {
          default: {
            alt: "Image resource1",
            height: 1080,
            id: "resource1",
            width: 1920,
          },
        },
        fetchParams: {
          testParam1: "value1",
          testParam2: 666,
        },
      })
    );
    expect(testPluginDefaultImageFetch).toHaveBeenCalledTimes(1);
    expect(testPluginDefaultImageFetch).toHaveBeenNthCalledWith(
      1,
      [
        {
          id: "resource1",
          type: "test.image",
          fetchParams: {
            testParam1: "value1",
            testParam2: 666,
          },
        },
      ],
      expect.any(Object)
    );
  });
});

function getTransformHash(transformer: ResourceTransformer<any, any>) {
  return SHA1(transformer.toString()).toString();
}
