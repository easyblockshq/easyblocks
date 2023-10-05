/**
 * These imports shouldn't be here.
 *
 * They're here only for historical reasons and when syncResources tests will be eaten by ShopstoryClient tests they will be out.
 * @easyblocks/core can't have dependency of @easyblocks/compiler
 */
import {
  createCompilationContext,
  findExternals,
  normalize,
} from "../../../apps/app/src/modules/compiler";

import { findPendingResources } from "./findPendingResources";

import { mock } from "@easyblocks/test-utils";
import { createResourcesStore, ResourcesStore } from "./createResourcesStore";
import { syncResources } from "./syncResources";
import {
  Config,
  ConfigComponent,
  FetchFunction,
  FetchResourcesOutput,
  LauncherPlugin,
  RejectedResource,
  ResolvedResource,
  ResourceTransformer,
} from "./types";
import { SHA1 } from "crypto-js";
import { createFetchingContext } from "./createFetchingContext";

const batchTextFetch = mock<FetchFunction>(async (resources) => {
  return resources.map((resource) => {
    if (resource.id === "incorrect") {
      return { ...resource, error: new Error("Incorrect text resource id") };
    }

    return { ...resource, value: { en: `!${resource.id}` } };
  });
});

const getImageFromId = (id: string) => ({
  alt: id,
  url: id,
  aspectRatio: 1,
  srcset: [
    {
      w: 100,
      h: 100,
      url: id,
    },
  ],
});

const imageFetcher = mock<FetchFunction>(async (resources) => {
  return resources.map((resource) => {
    return {
      ...resource,
      value: {
        data: getImageFromId(resource.id), // data is used to mock more complex object that will have image object extracted in mapper function
      },
    };
  });
});

describe("data synchronizers", () => {
  const testPlugin: LauncherPlugin = {
    id: "test",
    resources: {
      image: {
        fetch: imageFetcher,
        widget: {
          type: "custom",
          component: () => {},
        },
      },
      video: {
        fetch: async (resources) => {
          return resources.map((resource) => {
            return {
              ...resource,
              value: {
                data: {
                  alt: resource.id,
                  url: resource.id,
                  aspectRatio: 1,
                },
              },
            };
          });
        },
        widget: {
          type: "custom",
          component: () => {},
        },
      },
    },
    launcher: {
      onEditorLoad: () => {},
      image: {
        resourceType: "image",
        transform: (data: any) => {
          return data.data;
        },
      },
      video: {
        resourceType: "video",
        transform: (data: any) => {
          return data.data;
        },
      },
    },
  };

  const shopstoryConfig: Config = {
    plugins: [testPlugin],
    types: {
      product: {
        // @ts-expect-error there are purposeful type errors to mimic JS behavior
        fetch: async (resources, contextParams) => {
          // We always test context params and custom field params! Not the most beautiful place to have those expects but this is done in hotfix commit.
          expect(contextParams.locale).toBe("en");

          const result: Array<FetchResourcesOutput> = [];

          // Special values return wrong results
          for (let i = 0; i < resources.length; i++) {
            if (resources[i].id.startsWith("returnsNull.")) {
              return null;
            }
            if (resources[i].id.startsWith("returnsString.")) {
              return "xxx";
            }
          }

          resources.forEach((resource) => {
            if (resource.id.startsWith("triggerErrorResponse.")) {
              throw new Error("something wrong!!!");
            }

            if (resource.id.startsWith("hasCirculars.")) {
              const a: Record<string, any> = {
                a: resource.id,
              };
              const b: Record<string, any> = {
                b: resource.id,
              };

              a.b = b;
              b.a = a;

              result.push({
                ...resource,
                value: {
                  id: resource.id,
                  handle: resource.id,
                  price: 110,
                  a,
                  b,
                },
              });
              return;
            }

            result.push({
              ...resource,
              value: {
                id: resource.id,
                handle: resource.id,
                price: 100,
              },
            });
          });

          return result;
        },
      },
    },
    text: {
      fetch: batchTextFetch,
    },
    components: [
      {
        id: "$RunMappersTestSection",
        type: "section",
        schema: [
          {
            prop: "margin",
            type: "space",
          },
          {
            prop: "Card",
            type: "component",
            componentTypes: ["card"],
          },
          {
            prop: "Cards",
            type: "component-collection",
            componentTypes: ["card"],
          },
        ],
      },
      {
        id: "$RunMappersTestCard",
        type: "card",
        schema: [
          {
            prop: "color",
            type: "color",
          },
        ],
      },
      {
        id: "MyCard",
        type: "card",
        schema: [
          {
            prop: "select",
            type: "select",
            options: ["one", "two", "three"],
          },
          {
            prop: "textBatch",
            type: "text",
          },
          {
            prop: "textBatch2",
            type: "text",
          },
          {
            prop: "textTmp",
            type: "text",
          },
          {
            prop: "someImage",
            type: "image",
          },
          {
            prop: "product",
            type: "resource",
            resourceType: "product",
          },
        ],
      },
    ],
  };

  const compilationContext = createCompilationContext(
    shopstoryConfig,
    {
      locale: "en",
    },
    "content"
  );

  test("with correct config", async () => {
    const config: ConfigComponent = {
      _template: "$RunMappersTestSection",
      Card: [
        {
          _template: "MyCard",

          select: "one",

          someImage: {
            $res: true,
            xl: {
              id: "image1.png",
            },
          },

          textBatch: {
            id: "batchId1",
          },

          textBatch2: {
            id: "xxx",
          },

          product: {
            id: "shoes",
          },

          textTmp: {
            id: "local.123",
            value: {
              en: "Lorem ipsum 123",
            },
          },
        },
      ],
      Cards: [
        {
          _template: "MyCard",

          select: "two",

          textBatch: {
            id: "batchId2",
          },

          textBatch2: {
            id: "xxx",
          },

          someImage: {
            $res: true,
            sm: {
              id: "image2-mobile.png",
            },
            xl: {
              id: "image2.png",
            },
          },

          textTmp: {
            id: "local.555",
            value: {
              en: "Lorem ipsum 555",
            },
          },
        },
        {
          _template: "MyCard",

          select: "three",

          textBatch: {
            id: "incorrect",
          },

          textBatch2: {
            id: "xxx",
          },

          textTmp: {
            id: "local.888",
            value: {
              en: "Lorem ipsum 888",
            },
          },
        },
      ],
    };

    const resourcesStore = createResourcesStore();

    const inputConfig = normalize(config, compilationContext);

    // Let's make xxx defined!
    resourcesStore.set(inputConfig.Card[0].textBatch2.id, {
      id: inputConfig.Card[0].textBatch2.id,
      status: "success",
      error: null,
      type: "text",
      values: { default: { en: "!xxx" } },
    });

    const contextParams = {
      locale: "en",
    };

    const resorcesWithSchemaProps = findExternals(
      inputConfig,
      shopstoryConfig,
      contextParams
    );
    const pendingResources = findPendingResources(
      resorcesWithSchemaProps,
      resourcesStore,
      createFetchingContext(shopstoryConfig)
    );

    expect(Object.values(pendingResources).flat().length).toBeGreaterThan(0);

    await syncResources({
      config: shopstoryConfig,
      contextParams,
      resourcesStore,
      shopstoryClient: {
        add: () => {
          return { renderableContent: null };
        },
        build: () => {
          throw new Error("It's only a test");
        },
      },
      stagedForMap: pendingResources,
    });

    const resorcesWithSchemaPropsAfterSync = findExternals(
      inputConfig,
      shopstoryConfig,
      contextParams
    );
    const pendingResourcesAfterSync = findPendingResources(
      resorcesWithSchemaPropsAfterSync,
      resourcesStore,
      createFetchingContext(shopstoryConfig)
    );

    const imageTransformHash = getTransformHash(
      testPlugin.launcher.image.transform
    );

    expect(Object.values(pendingResourcesAfterSync).flat().length).toBe(0);

    expect(inputConfig.Card[0].select).toEqual("one");
    expect(
      getResolvedResource(resourcesStore, "batchId1", "text")?.values["default"]
    ).toEqual({
      en: "!batchId1",
    });

    expect(
      getResolvedResource(resourcesStore, "image1.png", "image")?.values[
        imageTransformHash
      ]
    ).toEqual(getImageFromId("image1.png"));

    expect(inputConfig.Card[0].textTmp).toEqual({
      id: "local.123",
      value: { en: "Lorem ipsum 123" },
    });

    expect(
      getResolvedResource(resourcesStore, "shoes", "product")?.values["default"]
    ).toEqual({
      id: "shoes",
      handle: "shoes",
      price: 100,
    });

    expect(inputConfig.Cards[0].select).toEqual("two");
    expect(
      getResolvedResource(resourcesStore, "batchId2", "text")?.values["default"]
    ).toEqual({
      en: "!batchId2",
    });

    expect(
      getResolvedResource(resourcesStore, "image2-mobile.png", "image")?.values[
        imageTransformHash
      ]
    ).toEqual(getImageFromId("image2-mobile.png"));
    expect(
      getResolvedResource(resourcesStore, "image2.png", "image")?.values[
        imageTransformHash
      ]
    ).toEqual(getImageFromId("image2.png"));

    expect(inputConfig.Cards[0].textTmp).toEqual({
      id: "local.555",
      value: { en: "Lorem ipsum 555" },
    });

    expect(inputConfig.Cards[1].select).toEqual("three");
    expect(
      getRejectedResource(resourcesStore, "incorrect", "text")?.values
    ).toBeUndefined();
    expect(
      getRejectedResource(resourcesStore, "incorrect", "text")?.error
    ).toEqual(new Error("Incorrect text resource id"));

    expect(inputConfig.Cards[1].someImage).toEqual({
      $res: true,
      xl: {
        id: null,
      },
    });

    expect(inputConfig.Cards[1].textTmp).toEqual({
      id: "local.888",
      value: { en: "Lorem ipsum 888" },
    });

    expect(batchTextFetch.mock.calls[0][0].length).toBe(3); // 3 items are batch fetched
    expect(batchTextFetch.mock.calls.length).toBe(1); // in one call

    expect(imageFetcher.mock.calls[0][0].length).toBe(3); // 3 items are batch fetched
    expect(imageFetcher.mock.calls.length).toBe(1); // in one call
  });
});

function getResolvedResource(
  resourcesStore: ResourcesStore,
  id: string,
  type: string
): ResolvedResource<unknown> | undefined {
  const resource = resourcesStore.get(id, type);

  if (!resource) {
    return;
  }

  if (resource.status !== "success") {
    throw new Error("Expected resource to be resolved");
  }

  return resource;
}

function getRejectedResource(
  resourcesStore: ResourcesStore,
  id: string,
  type: string
): RejectedResource | undefined {
  const resource = resourcesStore.get(id, type);

  if (!resource) {
    return;
  }

  if (resource.status !== "error") {
    throw new Error("Expected resource to be rejected");
  }

  return resource;
}

function getTransformHash(transformer: ResourceTransformer<any, any>) {
  return SHA1(transformer.toString()).toString();
}
