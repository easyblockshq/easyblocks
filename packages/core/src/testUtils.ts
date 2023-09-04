import { mock } from "@easyblocks/test-utils";
import { serialize } from "@easyblocks/utils";
import mergeWith from "lodash/mergeWith";
import type { PartialDeep } from "type-fest";
import { FetchResourceError } from "./FetchResourceError";
import {
  Config,
  FetchFunction,
  ImageTransformer,
  LauncherPlugin,
  RejectedResource,
  ResolvedResource,
  VideoTransformer,
} from "./types";

const defaultTestImageTransformer: ImageTransformer = (data) => {
  return {
    alt: "Image",
    aspectRatio: 1,
    mimeType: "image/test",
    srcset: [{ url: `some_url_${data.id}`, w: 100, h: 100 }],
    url: `some_url_${data.id}`,
  };
};

const defaultTestVideoTransformer: VideoTransformer = (data) => {
  return {
    alt: "Video",
    aspectRatio: 1,
    url: `some_url_${data.id}`,
  };
};

function createTestConfig(configOverrides: PartialDeep<Config> = {}): Config {
  const batchTextFetch = mock<FetchFunction>(async (resources) => {
    return resources.map((resource) => {
      if (resource.id === "incorrect") {
        return { ...resource, error: new Error("Incorrect text resource id") };
      }

      return { ...resource, value: { en: `!${resource.id}` } };
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
            aspectRatio: value.width / value.height,
            url: `/videos/${value.id}`,
          };
        },
      },
    },
    resources: {
      "test.image": {
        fetch: async (resources) => {
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
        },
        widget: () => ({
          type: "custom",
          component: () => {
            new Error("Not implemented");
          },
        }),
      },
    },
  };

  const defaultTestConfig: Config = {
    plugins: configOverrides.plugins ?? [testPlugin],
    text: {
      fetch: batchTextFetch,
    },
  };

  return mergeWith(
    defaultTestConfig,
    configOverrides,
    (objValue, srcValue, key) => {
      if (
        Array.isArray(objValue) &&
        Array.isArray(srcValue) &&
        key !== "plugins"
      ) {
        return objValue.concat(srcValue);
      }
    }
  );
}

function resolvedResource({
  id,
  type,
  values,
  info,
  fetchParams,
}: {
  id: string;
  type: string;
  values: ResolvedResource["values"];
  info?: ResolvedResource["info"];
  fetchParams?: ResolvedResource["fetchParams"];
}): ResolvedResource {
  return {
    id,
    type,
    values,
    error: null,
    status: "success",
    ...(info !== undefined && { info }),
    ...(fetchParams !== undefined && { fetchParams }),
  };
}

function rejectedResource({
  id,
  type,
  error,
}: {
  id: string;
  type: string;
  error?: Error;
}): RejectedResource {
  // @ts-expect-error `value` can be omitted because it will be removed by serialization during fetch
  return {
    id,
    type,
    error: {
      ...serialize(error ?? new FetchResourceError(id)),
      stack: expect.any(String),
    },
    status: "error",
  };
}

export {
  createTestConfig,
  resolvedResource,
  rejectedResource,
  defaultTestImageTransformer,
  defaultTestVideoTransformer,
};
