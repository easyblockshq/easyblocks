# Backend

The architecture of Easyblocks decouples the editor from the underlying backend service. The backend is responsible for:

1. Fetching, creating, updating and versioning of documents.
2. Fetching, creating and updating templates.

Easyblocks comes with a simple cloud service ([app.easyblocks.io](https://app.easyblocks.io)) that can be used in a following way:

```typescript
import { Config, EasyblocksBackend } from "@easyblocks/core";

export const easyblocksConfig: Config = {
  backend: new EasyblocksBackend({
    accessToken: "<<< your access token >>>",
  }),
  // ...
};
```

The access token can be acquired by creating the account described in [Getting Started](../getting-started.md#get-access-token).&#x20;

### Building custom `Backend`

You can build your own backend. Each Backend must conform to the following TS interface:

```typescript
export type Backend = {
  documents: {
    get: (payload: { id: string; locale?: string }) => Promise<Document>;
    create: (payload: Omit<Document, "id" | "version">) => Promise<Document>;
    update: (payload: Omit<Document, "type">) => Promise<Document>;
  };
  templates: {
    get(payload: { id: string }): Promise<UserDefinedTemplate>;
    getAll: () => Promise<UserDefinedTemplate[]>;
    create: (payload: {
      label: string;
      entry: NoCodeComponentEntry;
      width?: number;
      widthAuto?: boolean;
    }) => Promise<UserDefinedTemplate>;
    update: (payload: {
      id: string;
      label: string;
    }) => Promise<Omit<UserDefinedTemplate, "entry">>;
    delete: (payload: { id: string }) => Promise<void>;
  };
};

export type Document = {
  id: string;
  version: number;
  entry: NoCodeComponentEntry;
};

export type UserDefinedTemplate = {
  id: string;
  label: string;
  thumbnail?: string;
  thumbnailLabel?: string;
  entry: NoCodeComponentEntry;
  isUserDefined: true;
  width?: number;
  widthAuto?: boolean;
};
```
