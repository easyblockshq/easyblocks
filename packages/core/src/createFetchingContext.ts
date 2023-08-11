import { SHA1 as sha1 } from "crypto-js";
import { SetRequired } from "type-fest";
import { getLauncherPlugin } from "./syncResources";
import {
  Config,
  ImageSrc,
  ImageVariant,
  LocalizedText,
  MediaSchemaPropTemplate,
  Plugin,
  ResourceDefinition,
  ResourceTransformer,
  VideoSrc,
  VideoVariant,
} from "./types";

export type FetchingContext = {
  resourceTypes: {
    [key: string]: ResourceDefinition<any>;
  };
  text?: ResourceDefinition<LocalizedText>;
  image: MediaSchemaPropTemplate<ImageSrc>;
  video: MediaSchemaPropTemplate<VideoSrc>;
  strict?: boolean;
  imageVariants: Array<ImageVariant>;
  videoVariants: Array<VideoVariant>;
};

function createFetchingContext(config: Config): FetchingContext {
  const launcherPlugin = getLauncherPlugin(config);

  const types = {
    ...config.resourceTypes,
  };

  config.plugins?.forEach((plugin) => {
    for (const id in plugin.resources) {
      const resource = plugin.resources[id];
      types[id] = {
        ...types[id],
        widget: resource.widget,
        defaultFetch: resource.defaultFetch,
      };
    }
  });

  const configPlugins = config.plugins ?? [];
  const launcherPluginId = launcherPlugin?.id;

  const imageTemplate =
    config.image ?? launcherPlugin?.launcher.image ?? configPlugins[0]?.image;

  if (!imageTemplate) {
    throw new Error(
      `Missing "image" media template schema prop. This is unexpected error.`
    );
  }

  const videoTemplate =
    config.video ?? launcherPlugin?.launcher.video ?? configPlugins[0]?.video;

  if (!videoTemplate) {
    throw new Error(
      `Missing "video" media template schema prop. This is unexpected error.`
    );
  }

  const imageVariants = buildMediaVariants(
    "image",
    config.imageVariants,
    configPlugins,
    imageTemplate,
    launcherPluginId
  );

  const videoVariants = buildMediaVariants(
    "video",
    config.videoVariants,
    configPlugins,
    videoTemplate,
    launcherPluginId
  );

  return {
    resourceTypes: types,
    image: {
      ...imageTemplate,
      optional: true,
    },
    video: {
      ...videoTemplate,
      optional: true,
    },
    text: config.text,
    strict: config.strict,
    imageVariants,
    videoVariants,
  };
}

export { createFetchingContext };

function getTransformHash(transformer: ResourceTransformer<any, any>) {
  return sha1(transformer.toString()).toString();
}

function buildMediaVariants<
  MediaType extends "image" | "video",
  MediaVariantsProperty extends keyof Pick<
    Required<Config>,
    "imageVariants" | "videoVariants"
  > = `${MediaType}Variants`,
  MediaVariant extends Required<Config>[MediaVariantsProperty][number] = Required<Config>[MediaVariantsProperty][number]
>(
  mediaType: MediaType,
  variants: Config[MediaVariantsProperty],
  plugins: Array<Plugin>,
  mediaSchemaPropTemplate: NonNullable<Config[MediaType]>,
  launcherPluginId?: string
): Array<MediaVariant> {
  const launcherVariantId = launcherPluginId
    ? `${launcherPluginId}.default`
    : undefined;

  // @ts-expect-error
  const launcherDefaultMediaVariant: MediaVariant | undefined = launcherPluginId
    ? {
        id: launcherVariantId,
        label: "Default",
        resourceType: mediaSchemaPropTemplate.resourceType,
        transform: mediaSchemaPropTemplate.transform,
        transformHash: getTransformHash(mediaSchemaPropTemplate.transform),
        fetchParams: mediaSchemaPropTemplate.fetchParams,
        params: mediaSchemaPropTemplate.params,
      }
    : undefined;

  const pluginBasedMediaVariants = launcherPluginId
    ? []
    : plugins
        .filter<Plugin & SetRequired<Plugin, MediaType>>(
          (plugin): plugin is Plugin & SetRequired<Plugin, MediaType> =>
            plugin[mediaType] !== undefined
        )
        // @ts-expect-error
        .map<MediaVariant>((plugin) => {
          return {
            id: `${plugin.id}.default`,
            label: `Default ${plugin.id}`,
            resourceType: plugin[mediaType]!.resourceType,
            transform: plugin[mediaType]!.transform,
            transformHash: getTransformHash(plugin[mediaType]!.transform),
          };
        });

  if (!variants) {
    if (launcherDefaultMediaVariant) {
      return [launcherDefaultMediaVariant];
    }

    return pluginBasedMediaVariants;
  }

  const nonUniqueVariantsIds = new Set<string>();
  // @ts-expect-error
  const resultVariants: Required<Config>[MediaVariantsProperty] =
    launcherPluginId ? [launcherDefaultMediaVariant] : pluginBasedMediaVariants;

  for (const variant of variants) {
    if (launcherVariantId && variant.id === launcherVariantId) {
      throw new Error(
        `${upperCaseFirstCharacter(
          mediaType
        )} variant id "${launcherVariantId}" is reserved identifier and cannot be used.`
      );
    }

    if (resultVariants.some((v) => v.id === variant.id)) {
      nonUniqueVariantsIds.add(variant.id);
    }

    // @ts-expect-error
    resultVariants.push({
      ...variant,
      transformHash: getTransformHash(variant.transform),
    });
  }

  if (nonUniqueVariantsIds.size > 0) {
    throw new Error(
      `All ${mediaType} variants must have a unique id. ${upperCaseFirstCharacter(
        mediaType
      )} variants with non unique id: ${valuesListing(
        Array.from(nonUniqueVariantsIds)
      )}.`
    );
  }

  // @ts-expect-error
  return resultVariants;
}

function valuesListing(values: Array<string>) {
  return values.map((v) => `"${v}"`).join(", ");
}

function upperCaseFirstCharacter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
