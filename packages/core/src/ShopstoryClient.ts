import { serialize } from "@easyblocks/utils";
import { isDocument } from "./checkers";
import { createResourcesStore, ResourcesStore } from "./createResourcesStore";
import { findPendingResources } from "./findPendingResources";
import {
  ApiClient,
  DocumentWithResolvedConfigDTO,
  IApiClient,
} from "./infrastructure/apiClient";
import { ShopstoryAccessTokenApiAuthenticationStrategy } from "./infrastructure/ShopstoryAccessTokenApiAuthenticationStrategy";
import { loadCompilerScript } from "./loadScripts";
import { getFallbackLocaleForLocale } from "./locales";
import {
  Config,
  ContextParams,
  Document,
  FetchInputResources,
  Metadata,
  RenderableContent,
  ResourceWithSchemaProp,
  SerializableResource,
  ShopstoryClientAddOptions,
  ShopstoryClientDependencies,
} from "./types";

type PendingContentEntry<T = any> = {
  value: T;
  options: ShopstoryClientAddOptions;
  resultReference: RenderableContent;
  nested?: boolean;
};

export class ShopstoryClient {
  private pendingContent: PendingContentEntry[];
  private resourcesStore: ResourcesStore;
  private apiClient!: IApiClient;
  public __applyConfigTransform = true;
  private dependencies?: ShopstoryClientDependencies;

  constructor(
    config: Config,
    contextParams: ContextParams & { isEditing?: boolean }
  );
  constructor(
    config: Config,
    contextParams: ContextParams & { isEditing?: boolean },
    resourcesStore: ResourcesStore
  );
  constructor(
    private config: Config,
    private contextParams: ContextParams & { isEditing?: boolean },
    resourcesStore?: ResourcesStore
  ) {
    this.config = config;
    this.contextParams = contextParams;
    this.resourcesStore = resourcesStore ?? createResourcesStore();
    this.pendingContent = [];

    if (this.config.accessToken) {
      this.apiClient = new ApiClient(
        new ShopstoryAccessTokenApiAuthenticationStrategy(
          this.config.accessToken
        )
      );
    }
  }

  add(input: unknown, options: ShopstoryClientAddOptions): RenderableContent {
    const result: RenderableContent = {
      renderableContent: null,
    };

    this.pendingContent.push({
      value: input,
      options,
      resultReference: result,
    });

    return result;
  }

  buildSync(onFetchEnd: (meta: Metadata) => void): Metadata {
    const meta = this.compilePendingContentEntries(this.pendingContent);
    this.build().then(onFetchEnd);
    return meta;
  }

  injectDependencies(dependencies: ShopstoryClientDependencies) {
    this.dependencies = dependencies;
  }

  async build(): Promise<Metadata> {
    if (!this.dependencies) {
      this.dependencies = await loadCompilerScript();
    }

    this.validatePendingContent();
    await this.fetchConfigsForPendingRemoteContentEntries();
    const syncedConfigs: PendingContentEntry[] =
      await this.fetchResourcesForPendingContentEntries();
    const metadata = this.compilePendingContentEntries(syncedConfigs);

    return metadata;
  }

  private async fetchResourcesForPendingContentEntries() {
    const { findResources } = this.dependencies!;

    const syncedConfigs: PendingContentEntry[] = [];

    let isFirstIteration = true;

    while (this.pendingContent.length > 0) {
      for (const pendingContentItem of this.pendingContent) {
        syncedConfigs.push({
          ...pendingContentItem,
          nested: !isFirstIteration,
        });
      }

      this.pendingContent.length = 0;

      const resourcesWithSchemas =
        syncedConfigs.flatMap<ResourceWithSchemaProp>((syncedConfig) => {
          return findResources(
            syncedConfig.value,
            this.config,
            this.contextParams
          );
        });

      const pendingResources = findPendingResources(
        resourcesWithSchemas,
        this.resourcesStore
      );

      const fetchInput: FetchInputResources = Object.fromEntries(
        pendingResources.map((r) => {
          return [
            r.id,
            {
              externalId: r.resource.id,
              type: r.resource.type,
              widgetId: r.resource.widgetId,
              fetchParams: r.resource.fetchParams,
            },
          ];
        })
      );

      if (this.contextParams.isEditing) {
        pendingResources.forEach((r) => {
          this.resourcesStore.set(r.id, {
            id: r.id,
            type: r.resource.type,
            status: "loading",
            error: null,
            value: undefined,
          });
        });
      }

      const resources = await this.config.fetch(fetchInput, this.contextParams);

      Object.entries(resources).forEach(([id, resource]) => {
        const fetchInputResource = fetchInput[id];

        if (!fetchInputResource) {
          console.warn(
            `Unknown resource with id "${id}" has been returned from the fetch function"`
          );
          return;
        }

        if ("value" in resource.value) {
          this.resourcesStore.set(id, {
            id,
            type: fetchInputResource.type,
            status: "success",
            value: resource.value.value,
            error: null,
          });
        } else {
          this.resourcesStore.set(id, {
            id,
            type: fetchInputResource.type,
            status: "error",
            value: undefined,
            error: resource.value.error,
          });
        }
      });

      isFirstIteration = false;
    }
    return syncedConfigs;
  }

  private compilePendingContentEntries(
    contentEntries: PendingContentEntry[]
  ): Metadata {
    if (!this.dependencies) {
      throw new Error("Internal error: dependencies are not defined");
    }

    const { compile } = this.dependencies;
    const content = contentEntries.map((item) => ({
      content: item.value,
      options: { ...item.options, nested: !!item.nested },
    }));

    const { meta, items } = compile(content, this.config, this.contextParams);

    if (items.length !== contentEntries.length) {
      throw new Error("compile output length is not equal to input length");
    }

    items.forEach(({ compiled, configAfterAuto }, index) => {
      const renderableContentReference = contentEntries[index].resultReference;
      renderableContentReference.renderableContent = compiled;

      if (configAfterAuto) {
        (renderableContentReference as any).configAfterAuto = configAfterAuto;
      }
    });

    return {
      ...serialize(meta),
      resources: this.getCurrentResources(),
    };
  }

  private validatePendingContent() {
    if (!this.dependencies) {
      throw new Error("Internal error: dependencies are not defined");
    }

    const { validate } = this.dependencies;

    const invalidContent = this.pendingContent.filter(
      (content) => !validate(content.value).isValid
    );

    if (invalidContent.length > 0) {
      console.error(
        "Invalid content items: ",
        invalidContent.map((content) => content.value)
      );
      throw new Error(
        "ShopstoryClient has received one or more invalid content item. Please check the console for more details."
      );
    }
  }
  private getPendingRemoteContentItems() {
    return this.pendingContent.filter<
      PendingContentEntry<Omit<Document, "config">>
    >(
      (content): content is PendingContentEntry<Omit<Document, "config">> =>
        isDocument(content.value) && !content.value.config
    );
  }

  private async fetchConfigsForPendingRemoteContentEntries() {
    const pendingRemoteContentItems = this.getPendingRemoteContentItems();

    if (pendingRemoteContentItems.length > 0) {
      if (!this.apiClient) {
        if (!this.config.accessToken) {
          throw new Error(
            "Access token is required in Shopstory config for using remote content."
          );
        }

        this.apiClient = new ApiClient(
          new ShopstoryAccessTokenApiAuthenticationStrategy(
            this.config.accessToken
          )
        );
      }

      const locales = this.buildLocalesWithFallbacksForLocale();

      try {
        const configResponses = await Promise.allSettled(
          pendingRemoteContentItems.map((contentItem) =>
            this.apiClient.documents.getDocumentById({
              documentId: contentItem.value.documentId,
              projectId: contentItem.value.projectId,
              locales,
            })
          )
        );

        for (const pendingRemoteContent of pendingRemoteContentItems) {
          const remoteContentIdentifier = pendingRemoteContent.value.documentId;
          const rawContentResult = configResponses.find<
            PromiseFulfilledResult<DocumentWithResolvedConfigDTO>
          >(
            (
              config
            ): config is PromiseFulfilledResult<DocumentWithResolvedConfigDTO> =>
              config.status === "fulfilled" &&
              config.value !== null &&
              config.value.id === remoteContentIdentifier
          );

          if (!rawContentResult) {
            throw new Error(
              "Could not find config for remote content with id " +
                remoteContentIdentifier
            );
          }

          const document: Document = {
            documentId: rawContentResult.value.id,
            projectId: rawContentResult.value.project_id,
            rootContainer:
              rawContentResult.value.root_container ??
              pendingRemoteContent.options.rootContainer,
            config: rawContentResult.value.config.config,
          };

          pendingRemoteContent.value = document;
        }
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching remote content configs.");
      }
    }
  }

  private getCurrentResources() {
    const resources = this.resourcesStore
      .values()
      .map<SerializableResource>((resource) => {
        if (resource.status === "error" && resource.error) {
          return serialize({
            ...resource,
            error: serialize(resource.error),
          });
        }

        return serialize(resource);
      });

    return resources;
  }

  private buildLocalesWithFallbacksForLocale(): Array<string> {
    if (!this.config.locales) {
      throw new Error(
        "Property 'locales' is required in Shopstory config when using remote content."
      );
    }

    const resultLocales: Array<string> = [this.contextParams.locale];
    let lastLocale = this.contextParams.locale;

    while (true) {
      const fallbackLocale = getFallbackLocaleForLocale(
        lastLocale,
        this.config.locales
      );

      if (!fallbackLocale) {
        break;
      }

      resultLocales.push(fallbackLocale);
      lastLocale = fallbackLocale;
    }

    return resultLocales;
  }
}

// TODO: Create CompilerModuleApi type to decouple core from compiler
