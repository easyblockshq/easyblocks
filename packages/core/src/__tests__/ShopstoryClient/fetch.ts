import { mock } from "@easyblocks/test-utils";
import { SHA1 } from "crypto-js";
import {
  ConfigDTO,
  DocumentWithResolvedConfigDTO,
} from "../../infrastructure/apiClient";
import { ShopstoryClient } from "../../ShopstoryClient";
import {
  createTestConfig,
  rejectedResource,
  resolvedResource,
} from "../../testUtils";
import {
  CompiledComponentConfig,
  Document,
  FetchFunction,
  FetchResourcesInput,
  ImageTransformer,
  ImageVariant,
  LauncherPlugin,
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
      jest.requireActual("../../../../../apps/app/public/compiler.cjs"),
    _esModule: true,
  };
});

test("fetches resources using custom fetcher", async () => {
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
      rootContainer: "content",
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
      rootContainer: "content",
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
        root_container: "content",
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
      rootContainer: "content",
    };

    shopstoryClient.add(testDocument);

    await shopstoryClient.build();
  });
});

const testPluginImageFetch = mock<FetchFunction>(async (resources) => {
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
});

const testPluginVideoFetch = mock<FetchFunction>(async (resources) => {
  return resources.map((r) => {
    return {
      ...r,
      value: {
        id: r.id,
        alt: `Video ${r.id}`,
      },
    };
  });
});

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
      fetch: testPluginImageFetch,
      widget: () => ({
        type: "custom",
        component: () => {
          new Error("Not implemented");
        },
      }),
    },
    "test.video": {
      fetch: testPluginVideoFetch,
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
    testPluginImageFetch.mockClear();
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
    expect(testPluginImageFetch).toHaveBeenCalledTimes(1);
    expect(testPluginImageFetch).toHaveBeenNthCalledWith(
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
    expect(testPluginImageFetch).not.toHaveBeenCalled();
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
    testPluginVideoFetch.mockClear();
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
    expect(testPluginVideoFetch).toHaveBeenCalledTimes(1);
    expect(testPluginVideoFetch).toHaveBeenNthCalledWith(
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
    expect(testPluginVideoFetch).not.toHaveBeenCalled();
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
    testPluginImageFetch.mockClear();
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
    expect(testPluginImageFetch).toHaveBeenCalledTimes(1);
    expect(testPluginImageFetch).toHaveBeenNthCalledWith(
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
    expect(testPluginImageFetch).toHaveBeenCalledTimes(1);
    expect(testPluginImageFetch).toHaveBeenNthCalledWith(
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
    expect(testPluginImageFetch).toHaveBeenCalledTimes(1);
    expect(testPluginImageFetch).toHaveBeenNthCalledWith(
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
