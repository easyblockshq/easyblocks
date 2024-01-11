import { getAppUrlRoot } from "@easyblocks/utils";
import {
  Backend,
  ComponentConfig,
  UserDefinedTemplate,
  Document,
} from "./types";
import { ShopstoryAccessTokenApiAuthenticationStrategy } from "./infrastructure/ShopstoryAccessTokenApiAuthenticationStrategy";
import { ConfigComponent } from "../dist";

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

type Project = {
  id: string;
  name: string;
  tokens: Array<string>;
};

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

export class EasyblocksBackend implements Backend {
  private project?: {
    id: string;
    tokens: string[];
    name: string;
  };

  private authenticationStrategy: ApiAuthenticationStrategy;

  private accessToken: string;

  constructor(args: { accessToken: string }) {
    this.accessToken = args.accessToken;
    this.authenticationStrategy =
      new ShopstoryAccessTokenApiAuthenticationStrategy(args.accessToken);
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

  private async request(path: string, options: ApiRequestOptions) {
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

  private async get(path: string, options: ApiGetRequestOptions = {}) {
    return this.request(path, { ...options, method: "GET" });
  }

  private async post(path: string, options: ApiPostRequestOptions = {}) {
    return this.request(path, { ...options, method: "POST" });
  }

  private async put(path: string, options: ApiPutRequestOptions = {}) {
    return this.request(path, { ...options, method: "PUT" });
  }

  private async delete(path: string, options: ApiDeleteRequestOptions = {}) {
    return this.request(path, { ...options, method: "DELETE" });
  }

  documents = {
    get: async (payload: {
      id: string;
      locales?: Array<string>;
    }): Promise<Document> => {
      const response = await this.get(
        `/projects/${this.project!.id}/documents/${payload.id}`,
        {
          searchParams: {
            format: "full",
            ...(payload.locales && { locale: payload.locales }),
          },
        }
      );

      if (response.ok) {
        return documentWithResolvedConfigDTOToDocument(
          (await response.json()) as DocumentWithResolvedConfigDTO
        );
      }

      throw new Error("Failed to get document");
    },

    create: async (
      payload: Omit<Document, "id" | "version">
    ): Promise<Document> => {
      const response = await this.post(
        `/projects/${this.project!.id}/documents`,
        {
          body: {
            title: "Untitled",
            config: payload.entry,
            rootContainer: payload.type,
          },
        }
      );

      if (response.ok) {
        return documentDTOToDocument(
          (await response.json()) as DocumentDTO,
          payload.entry
        );
      }

      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      throw new Error("Failed to save document");
    },

    update: async (payload: Document): Promise<Document> => {
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
        return documentDTOToDocument(
          (await response.json()) as DocumentDTO,
          payload.entry
        );
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
      label: string;
      entry: ConfigComponent;
      width?: number;
      widthAuto?: boolean;
    }): UserDefinedTemplate => {
      const payload = {
        label: input.label,
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

      const json = await response.json();

      console.log("create template json", json);

      if (response.status !== 200) {
        throw new Error();
      }
    },
    update: async (input: {
      id: string;
      label: string;
    }): UserDefinedTemplate => {
      const payload = {
        label: input.label,
        masterTemplateIds: [],
      };

      const response = await this.request(
        `/projects/${this.project!.id}/templates/${input.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      const json = await response.json();

      console.log("update template json", json);

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
}

function documentDTOToDocument(
  documentDTO: DocumentDTO,
  entry: ConfigComponent
): Document {
  if (!documentDTO.root_container) {
    throw new Error("unexpected server error");
  }

  return {
    id: documentDTO.id,
    version: documentDTO.version,
    type: documentDTO.root_container!,
    entry,
  };
}

function documentWithResolvedConfigDTOToDocument(
  documentWithResolvedConfigDTO: DocumentWithResolvedConfigDTO
): Document {
  return documentDTOToDocument(
    documentWithResolvedConfigDTO,
    documentWithResolvedConfigDTO.config.config
  );
}
