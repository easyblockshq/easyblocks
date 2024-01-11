import { getAppUrlRoot } from "@easyblocks/utils";
import { ComponentConfig, UserDefinedTemplate } from "../types";
import { ConfigComponent } from "../../dist";

type RequestSearchParams = Record<string, string | Array<string>>;

type ApiRequestOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  searchParams?: RequestSearchParams;
};

type ApiGetRequestOptions = Omit<ApiRequestOptions, "method" | "body">;

type ApiPostRequestOptions = Omit<ApiRequestOptions, "method">;

type ApiPutRequestOptions = Omit<ApiRequestOptions, "method">;

type ApiDeleteRequestOptions = Omit<ApiRequestOptions, "method" | "body">;

export interface ApiAuthenticationStrategy {
  readonly headerName: string;
  getAccessToken(): Promise<string>;
}

type DateString = string;

export type DocumentDTO = {
  archived: boolean;
  config_id: string;
  created_at: DateString;
  id: string;
  project_id: string;
  source: string;
  title: string;
  unique_source_identifier: string | null;
  updated_at: DateString;
  version: number;
  root_container: string | null;
};

export type DocumentWithResolvedConfigDTO = DocumentDTO & {
  config: ConfigDTO;
};

export type ConfigDTO = {
  config: ComponentConfig;
  created_at: DateString;
  id: string;
  metadata: Record<string, unknown> | null;
  parent_id: string | null;
  project_id: string;
  updated_at: DateString;
};

type GetDocumentFormat = "full" | "versionOnly";

export type AssetDTO = {
  id: string;
  name: string;
  url: string;
} & (
  | {
      mediaType: "image";
      metadata: { width: number; height: number; mimeType: string };
    }
  | {
      mediaType: "video";
      metadata: { mimeType: string };
    }
);

interface IApiClient {
  project?: {
    id: string;
    tokens: string[];
    name: string;
  };

  init(): Promise<void>;

  request(path: string, options?: ApiRequestOptions): ReturnType<typeof fetch>;
  get(path: string, options?: ApiGetRequestOptions): ReturnType<typeof fetch>;
  post(path: string, options?: ApiPostRequestOptions): ReturnType<typeof fetch>;
  put(path: string, options?: ApiPutRequestOptions): ReturnType<typeof fetch>;
  delete(
    path: string,
    options?: ApiDeleteRequestOptions
  ): ReturnType<typeof fetch>;

  documents: {
    get: (payload: {
      id: string;
      includeEntry?: boolean;
      locales?: string[];
    }) => Promise<DocumentWithResolvedConfigDTO | null>;
    create: (payload: {
      entry: ComponentConfig;
      rootContainer: string;
    }) => Promise<DocumentDTO>;
    update: (payload: {
      id: string;
      version?: number;
      entry?: ComponentConfig;
    }) => Promise<DocumentDTO>;
  };

  templates: {
    getAll: () => Promise<UserDefinedTemplate[]>;
    create: (payload: {
      title: string;
      entry: ConfigComponent;
      width?: number;
      widthAuto?: boolean;
    }) => Promise<void>;

    update: (payload: { id: string; title: string }) => Promise<void>;

    delete: (payload: { id: string }) => Promise<void>;
  };

  configs: {
    getConfigById: (payload: {
      configId: string;
      locales?: Array<string>;
    }) => Promise<ConfigDTO | null>;
  };

  assets: {
    getAssets(payload: {
      type?: "image" | "video";
      ids?: Array<string>;
    }): Promise<Array<AssetDTO>>;
    uploadAsset(payload: { asset: File }): Promise<void>;
    removeAsset(payload: { assetId: string }): Promise<void>;
  };
}

type Project = {
  id: string;
  name: string;
  tokens: Array<string>;
};

class ApiClient implements IApiClient {
  project?: {
    id: string;
    tokens: string[];
    name: string;
  };

  constructor(
    private readonly authenticationStrategy: ApiAuthenticationStrategy
  ) {
    this.authenticationStrategy = authenticationStrategy;
  }

  async init() {
    // Set project!
    const response = await this.get("/projects");

    if (response.ok) {
      const projects = (await response.json()) as Array<Project>;

      if (projects.length === 0) {
        throw new Error(
          "Authorization error. Have you provided a correct access token?"
        );
      }

      this.project = projects[0];
    } else {
      throw new Error("Initialization error in ApiClient");
    }
  }

  async request(path: string, options: ApiRequestOptions) {
    const apiRequestUrl = new URL(`${getAppUrlRoot()}/api${path}`);

    if (options.searchParams && Object.keys(options.searchParams).length > 0) {
      for (const [key, value] of Object.entries(options.searchParams)) {
        if (Array.isArray(value)) {
          value.forEach((value) => {
            apiRequestUrl.searchParams.append(key, value);
          });
        } else {
          apiRequestUrl.searchParams.set(key, value);
        }
      }
    }

    const headers: HeadersInit = {
      ...(path.includes("assets")
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
      [this.authenticationStrategy.headerName]:
        await this.authenticationStrategy.getAccessToken(),
    };

    const body = options.body
      ? typeof options.body === "object" && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body
      : undefined;

    return fetch(apiRequestUrl.toString(), {
      method: options.method,
      headers,
      body,
    });
  }

  async get(path: string, options: ApiGetRequestOptions = {}) {
    return this.request(path, { ...options, method: "GET" });
  }

  async post(path: string, options: ApiPostRequestOptions = {}) {
    return this.request(path, { ...options, method: "POST" });
  }

  async put(path: string, options: ApiPutRequestOptions = {}) {
    return this.request(path, { ...options, method: "PUT" });
  }

  async delete(path: string, options: ApiDeleteRequestOptions = {}) {
    return this.request(path, { ...options, method: "DELETE" });
  }

  documents = {
    // getAll: async (): Promise<Array<DocumentDTO>> => {
    //   const response = await this.get(
    //     `/projects/${this.project!.id}/documents`
    //   );
    //
    //   if (response.ok) {
    //     return (await response.json()) as Array<DocumentDTO>;
    //   }
    //
    //   throw new Error("Failed to get documents");
    // },

    get: async (payload: {
      id: string;
      includeEntry?: boolean;
      locales?: Array<string>;
    }): Promise<DocumentWithResolvedConfigDTO | null> => {
      const response = await this.get(
        `/projects/${this.project!.id}/documents/${payload.id}`,
        {
          searchParams: {
            format: payload.includeEntry ? "full" : "versionOnly",
            ...(payload.locales && { locale: payload.locales }),
          },
        }
      );

      if (response.ok) {
        return (await response.json()) as DocumentWithResolvedConfigDTO;
      }

      if (response.status === 400) {
        return null;
      }

      throw new Error("Failed to get document");
    },

    create: async (payload: {
      entry: ComponentConfig;
      rootContainer: string;
    }): Promise<DocumentDTO> => {
      const response = await this.post(
        `/projects/${this.project!.id}/documents`,
        {
          body: {
            title: "Untitled",
            config: payload.entry,
            rootContainer: payload.rootContainer,
          },
        }
      );

      if (response.ok) {
        return (await response.json()) as DocumentDTO;
      }

      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      throw new Error("Failed to save document");
    },

    update: async (payload: {
      id: string;
      version?: number;
      entry?: ComponentConfig;
    }): Promise<DocumentDTO> => {
      const response = await this.put(
        `/projects/${this.project!.id}/documents/${payload.id}`,
        {
          body: {
            version: payload.version,
            config: payload.entry,
          },
        }
      );

      if (response.ok) {
        return (await response.json()) as DocumentDTO;
      }

      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      throw new Error("Failed to update document");
    },
  };

  templates = {
    getAll: async (): Promise<UserDefinedTemplate[]> => {
      try {
        const response = await this.get(
          `/projects/${this.project!.id}/templates`
        );
        const data: Array<any> = await response.json();

        const templates = data.map<UserDefinedTemplate>((item) => ({
          id: item.id,
          label: item.label,
          entry: item.config.config,
          isUserDefined: true,
        }));

        return templates;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    create: async (input: {
      title: string;
      entry: ConfigComponent;
      width?: number;
      widthAuto?: boolean;
    }) => {
      const payload = {
        label: input.title,
        config: input.entry,
        masterTemplateIds: [],
        width: input.width,
        widthAuto: input.widthAuto,
      };

      const response = await this.request(
        `/projects/${this.project!.id}/templates`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (response.status !== 200) {
        throw new Error();
      }
    },
    update: async (input: { id: string; title: string }) => {
      const payload = {
        label: input.title,
        masterTemplateIds: [],
      };

      const response = await this.request(
        `/projects/${this.project!.id}/templates/${input.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      if (response.status !== 200) {
        throw new Error();
      }
    },
    delete: async (input: { id: string }) => {
      const response = await this.request(
        `/projects/${this.project!.id}/templates/${input.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status !== 200) {
        throw new Error();
      }
    },
  };

  configs = {
    getConfigById: async (payload: {
      configId: string;
      locales?: Array<string>;
    }): Promise<ConfigDTO | null> => {
      const path = this.project
        ? `/projects/${this.project.id}/configs/${payload.configId}`
        : `/configs/${payload.configId}`;

      const options: ApiGetRequestOptions = {
        ...(payload.locales && { searchParams: { locale: payload.locales } }),
      };

      const response = await this.get(path, options);

      if (response.ok) {
        if (this.project) {
          return (await response.json()) as ConfigDTO;
        }

        const getConfigData = await response.json();

        if (getConfigData === null) {
          return null;
        }

        return getConfigData as ConfigDTO;
      }

      if (response.status === 400) {
        return null;
      }

      throw new Error("Failed to get config");
    },
  };

  assets = {
    getAssets: async (payload: {
      type?: "image" | "video";
      ids?: Array<string>;
    }): Promise<Array<AssetDTO>> => {
      const searchParams: RequestSearchParams = {};

      if (payload.type) {
        searchParams.type = payload.type;
      }

      if (payload.ids) {
        searchParams.ids = payload.ids;
      }

      const response = await this.get(`/projects/${this.project!.id}/assets`, {
        searchParams,
      });

      if (response.ok) {
        const assets = await response.json();
        return assets as Array<AssetDTO>;
      }

      throw new Error("Failed to get assets");
    },

    uploadAsset: async (payload: { asset: File }): Promise<void> => {
      const formData = new FormData();
      formData.append("file", payload.asset);

      const response = await this.post(`/projects/${this.project!.id}/assets`, {
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload asset");
      }
    },

    removeAsset: async (payload: { assetId: string }): Promise<void> => {
      const response = await this.delete(
        `/projects/${this.project!.id}/assets/${payload.assetId}`
      );

      if (!response.ok) {
        throw new Error("Failed to remove asset");
      }
    },
  };
}

export { ApiClient };

export type { ApiRequestOptions, IApiClient };
