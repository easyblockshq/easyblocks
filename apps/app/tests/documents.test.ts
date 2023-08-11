import { test, expect } from "@playwright/test";
import { sleep, uniqueId } from "@easyblocks/utils";
import { createClient } from "@supabase/supabase-js";

const ACCESS_TOKEN_HEADER = "x-shopstory-access-token";

const PROJECT_A_ID = "89ed48c6-dc0b-4936-9a97-4eb791396853";
const PROJECT_A_ACCESS_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NjE5NTM2NzMsImV4cCI6MTY5MzQ4OTY3MywiYXVkIjoiYXV0aGVudGljYXRlZCIsInN1YiI6IjEyMyIsImVtYWlsIjoibWljaGFsQHNob3BzdG9yeS5hcHAiLCJwcm9qZWN0X2lkIjoiODllZDQ4YzYtZGMwYi00OTM2LTlhOTctNGViNzkxMzk2ODUzIn0.3I9QMjhPkYHtzW19g-uIjattobPBiXEK0Fz4AwxEfQg";

const PROJECT_B_ID = "04bc84cb-9204-4ede-aeb1-b0dde5e7d83d";
const PROJECT_B_ACCESS_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NjI2MjUyMzYsImV4cCI6MTY5NDE2MTIzNiwiYXVkIjoiYXV0aGVudGljYXRlZCIsInN1YiI6Im1pY2hhbEBzaG9wc3RvcnkuYXBwIiwicHJvamVjdF9pZCI6IjA0YmM4NGNiLTkyMDQtNGVkZS1hZWIxLWIwZGRlNWU3ZDgzZCJ9.CgoPHlke30wti_U7I8KT8nXXVK0fjRghnbhnGIfeYJI";

test.use({
  baseURL: "http://localhost:3100",
  extraHTTPHeaders: {
    "Content-Type": "application/json",
  },
});

test.describe.serial("documents", () => {
  const exampleDocuments: Record<string, any> = {
    DocumentA_1: {
      accessToken: PROJECT_A_ACCESS_TOKEN,
      projectId: PROJECT_A_ID,
      input: {
        title: "DocumentA_1",
        config: { _id: "$Component" },
        source: "contentful",
        unique_source_identifier: "100",
      },
    },
    DocumentA_2: {
      accessToken: PROJECT_A_ACCESS_TOKEN,
      projectId: PROJECT_A_ID,
      input: {
        title: "DocumentA_2",
        config: { _id: "$Component" },
        source: "contentful",
        unique_source_identifier: "101",
      },
    },
    DocumentB_1: {
      accessToken: PROJECT_B_ACCESS_TOKEN,
      projectId: PROJECT_B_ID,
      input: {
        title: "DocumentB_1",
        config: { _id: "$Component" },
        source: "sanity",
        unique_source_identifier: "200",
      },
    },
    DocumentB_2: {
      accessToken: PROJECT_B_ACCESS_TOKEN,
      projectId: PROJECT_B_ID,
      input: {
        title: "DocumentB_2",
        config: { _id: "$Component" },
        source: "shopstory",
        unique_source_identifier: "300",
      },
    },
  };

  async function cleanAllTestDocuments() {
    const supabase = createClient(
      "http://localhost:54321",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    await supabase.from("documents").delete().eq("project_id", PROJECT_A_ID);
    await supabase.from("documents").delete().eq("project_id", PROJECT_B_ID);
  }

  test.beforeAll(async ({ request }) => {
    // Clean test projects
    await cleanAllTestDocuments();

    for (const key in exampleDocuments) {
      const document = exampleDocuments[key]!;

      const response = await request.post(
        `/api/projects/${document.projectId}/documents`,
        {
          data: document.input,
          headers: {
            [ACCESS_TOKEN_HEADER]: document.accessToken,
          },
        }
      );

      const json = await response.json();
      document.response = response;
      document.data = json;
    }
  });

  test.afterAll(async () => {
    await cleanAllTestDocuments();
  });

  test("the response from add operation is correct", async () => {
    for (const key in exampleDocuments) {
      const document = exampleDocuments[key]!;

      expect(document.response.status()).toBe(200);
      expect(document.data).toMatchObject({
        id: expect.any(String),
        config_id: expect.any(String),
        title: document.input.title,
        source: document.input.source,
        unique_source_identifier: document.input.unique_source_identifier,
        archived: false,
        version: 0,
      });
    }
  });

  test("saving config with non unique source identifier throws error", async ({
    request,
  }) => {
    const document = exampleDocuments.DocumentB_2;

    const response = await request.post(
      `/api/projects/${document.projectId}/documents`,
      {
        data: document.input,
        headers: {
          [ACCESS_TOKEN_HEADER]: document.accessToken,
        },
      }
    );

    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({
      error: `Document with unique_source_identifier "${document.input.unique_source_identifier}" already exists`,
    });
  });

  test("GET all documents works", async ({ request }) => {
    const response = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents`,
      {
        headers: {
          [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
        },
      }
    );

    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data[0].id).toBe(exampleDocuments.DocumentA_1.data.id);
    expect(data[0].label).toBe(exampleDocuments.DocumentA_1.input.label);
    expect(data[0].source).toEqual(exampleDocuments.DocumentA_1.input.source);
    expect(data[0].unique_source_identifier).toEqual(
      exampleDocuments.DocumentA_1.input.unique_source_identifier
    );

    expect(data.length).toBe(2);
    expect(data[1].id).toBe(exampleDocuments.DocumentA_2.data.id);
    expect(data[1].label).toBe(exampleDocuments.DocumentA_2.input.label);
    expect(data[1].source).toEqual(exampleDocuments.DocumentA_2.input.source);
    expect(data[1].unique_source_identifier).toEqual(
      exampleDocuments.DocumentA_2.input.unique_source_identifier
    );
  });

  test("GET single document gets correct document with config", async ({
    request,
  }) => {
    const response = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_1.data.id}`,
      {
        headers: {
          [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
        },
      }
    );

    const data = await response.json();

    expect(response.status()).toBe(200);

    expect(data.id).toBe(exampleDocuments.DocumentA_1.data.id);
    expect(data.label).toBe(exampleDocuments.DocumentA_1.input.label);
    expect(data.source).toEqual(exampleDocuments.DocumentA_1.input.source);
    expect(data.unique_source_identifier).toEqual(
      exampleDocuments.DocumentA_1.input.unique_source_identifier
    );
    expect(data.config.config).toEqual(
      exampleDocuments.DocumentA_1.input.config
    );
    expect(data.version).toBe(0);
  });

  test("GET single document using unique_source_identifier gets correct document with config", async ({
    request,
  }) => {
    const response = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_1.input.unique_source_identifier}?identifier_type=unique_source_identifier`,
      {
        headers: {
          [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
        },
      }
    );

    expect(response.status()).toBe(200);

    const document = await response.json();

    expect(document.id).toBe(exampleDocuments.DocumentA_1.data.id);
    expect(document.label).toBe(exampleDocuments.DocumentA_1.input.label);
    expect(document.source).toEqual(exampleDocuments.DocumentA_1.input.source);
    expect(document.unique_source_identifier).toEqual(
      exampleDocuments.DocumentA_1.input.unique_source_identifier
    );
    expect(document.config.config).toEqual(
      exampleDocuments.DocumentA_1.input.config
    );
    expect(document.version).toBe(0);
  });

  test('gets only document\'s version if format is set to "versionOnly"', async ({
    request,
  }) => {
    let savedDocument: Record<string, any> | undefined;

    try {
      savedDocument = await setup();

      const response = await request.get(
        `/api/projects/${PROJECT_A_ID}/documents/${savedDocument.id}?format=versionOnly`,
        {
          headers: {
            [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
          },
        }
      );

      expect(response.status()).toBe(200);

      const document = await response.json();

      expect(document).toEqual({
        version: 0,
      });
    } catch (error) {
      throw error;
    } finally {
      await teardown();
    }

    async function setup() {
      const savedDocumentResponse = await request.post(
        `/api/projects/${PROJECT_A_ID}/documents`,
        {
          data: {
            title: "DocumentA_1",
            config: {
              _id: "$Component",
            },
            source: "test",
            unique_source_identifier: uniqueId(),
          },
          headers: {
            [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
          },
        }
      );

      return await savedDocumentResponse.json();
    }

    async function teardown() {
      if (savedDocument) {
        await request.delete(
          `/api/projects/${PROJECT_A_ID}/documents/${savedDocument.id}`,
          {
            headers: {
              [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
            },
          }
        );
      }
    }
  });

  test("get single document by id and locale returns document with localised config", async ({
    request,
  }) => {
    let savedDocument: Record<string, any> | undefined;

    try {
      const savedDocumentResponse = await request.post(
        `/api/projects/${PROJECT_A_ID}/documents`,
        {
          data: {
            title: "DocumentA_1",
            config: {
              _template: "$text",
              _id: "xxx",
              value: {
                __localized: true,
                en: "English",
                de: "Deutsch",
              },
            },
            source: "contentful",
            unique_source_identifier: "150",
          },
          headers: {
            [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
          },
        }
      );

      savedDocument = await savedDocumentResponse.json();

      const response = await request.get(
        `/api/projects/${PROJECT_A_ID}/documents/${savedDocument.id}?locale=de`,
        {
          headers: {
            [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
          },
        }
      );

      expect(response.status()).toBe(200);

      const document = await response.json();

      expect(document.config.config).toEqual({
        _id: "xxx",
        _template: "$text",
        value: { de: "Deutsch" },
      });
    } catch (error) {
      throw error;
    } finally {
      if (savedDocument) {
        await request.delete(
          `/api/projects/${PROJECT_A_ID}/documents/${savedDocument.id}`,
          {
            headers: {
              [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
            },
          }
        );
      }
    }
  });

  test("create with no title triggers error", async ({ request }) => {
    const response = await request.post(
      `/api/projects/${PROJECT_A_ID}/documents`,
      {
        data: {
          config: { _template: "$Component2" },
        },
        headers: {
          [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
        },
      }
    );

    expect(response.status()).toBe(400);
  });

  test("create with no config triggers error", async ({ request }) => {
    const response = await request.post(
      `/api/projects/${PROJECT_A_ID}/documents`,
      {
        data: {
          title: "New title",
        },
        headers: {
          [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
        },
      }
    );

    expect(response.status()).toBe(400);
  });

  const newTitle = "DocumentA_2 Modified";
  const newUniqueSourceIdentifier = "modified";
  const updatePayload = {
    data: {
      title: newTitle,
      unique_source_identifier: newUniqueSourceIdentifier,
    },
    headers: {
      [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
    },
  };

  test("updating fails with incorrect id", async ({ request }) => {
    const response = await request.put(
      `/api/projects/${PROJECT_A_ID}/documents/xxx`,
      updatePayload
    );
    expect(response.status()).toBe(400);
  });

  test("updating fails with id from another project", async ({ request }) => {
    const response = await request.put(
      `/api/projects/${PROJECT_B_ID}/documents/${exampleDocuments.DocumentB_1.data.id}`,
      updatePayload
    );
    expect(response.status()).toBe(400);
  });

  test("updating documents works with PUT method (metadata)", async ({
    request,
  }) => {
    const response = await request.put(
      `/api/projects/${PROJECT_B_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      updatePayload
    );

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data).toMatchObject({
      id: exampleDocuments.DocumentA_2.data.id,
      title: newTitle,
      unique_source_identifier: newUniqueSourceIdentifier,
      source: exampleDocuments.DocumentA_2.data.source,
    });
  });

  const updatePayload_config = {
    config: { _id: "$ComponentModified" },
  };

  test("updating config fails if version isn't specified", async ({
    request,
  }) => {
    const getDocumentBeforeResponse = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { headers: projectAHeaders }
    );
    const documentBeforeUpdate = await getDocumentBeforeResponse.json();

    const updateDocumentResponse = await request.put(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { data: updatePayload_config, headers: projectAHeaders }
    );
    const updateDocumentResponseJson = await updateDocumentResponse.json();

    expect(updateDocumentResponse.status()).toBe(400);
    expect(updateDocumentResponseJson).toMatchObject({
      error: "Updating config requires specifying document's version",
    });

    const getDocumentAfterResponse = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { headers: projectAHeaders }
    );
    const documentAfterUpdate = await getDocumentAfterResponse.json();

    expect(documentBeforeUpdate).toMatchObject(documentAfterUpdate);
  });

  test("updating config fails if version isn't a number", async ({
    request,
  }) => {
    const getDocumentBeforeResponse = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { headers: projectAHeaders }
    );
    const documentBeforeUpdate = await getDocumentBeforeResponse.json();

    const updateDocumentResponse = await request.put(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      {
        data: { ...updatePayload_config, version: "not a number" },
        headers: projectAHeaders,
      }
    );
    const updateDocumentResponseJson = await updateDocumentResponse.json();

    expect(updateDocumentResponse.status()).toBe(400);
    expect(updateDocumentResponseJson).toMatchObject({
      error: "Version must be a number",
    });

    const getDocumentAfterResponse = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { headers: projectAHeaders }
    );
    const documentAfterUpdate = await getDocumentAfterResponse.json();

    expect(documentBeforeUpdate).toMatchObject(documentAfterUpdate);
  });

  // TODO: test for PUT with new config. To check: new config, old config, parent_id

  const projectAHeaders = {
    [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
  };

  test("updating document works with PUT method (config) within config update threshold", async ({
    request,
  }) => {
    const getDocumentResponse = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { headers: projectAHeaders }
    );
    const documentBeforeUpdate = await getDocumentResponse.json();
    const documentBeforeUpdateConfigId = documentBeforeUpdate.config.id;

    const updateDocumentResponse = await request.put(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      {
        data: { ...updatePayload_config, version: 0 },
        headers: projectAHeaders,
      }
    );

    expect(updateDocumentResponse.status()).toBe(200);
    const updatedDocument = await updateDocumentResponse.json();

    expect(updatedDocument).toMatchObject({
      id: exampleDocuments.DocumentA_2.data.id,
      title: newTitle,
      unique_source_identifier: newUniqueSourceIdentifier,
      source: exampleDocuments.DocumentA_2.data.source,
      version: 1,
    });

    expect(updatedDocument.config_id).toBe(documentBeforeUpdateConfigId);

    const getResponseAfter = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { headers: projectAHeaders }
    );
    const documentAfterUpdate = await getResponseAfter.json();

    expect(documentAfterUpdate).toMatchObject({
      id: exampleDocuments.DocumentA_2.data.id,
      title: newTitle,
      unique_source_identifier: newUniqueSourceIdentifier,
      source: exampleDocuments.DocumentA_2.data.source,
      config: {
        id: updatedDocument.config_id,
        config: updatePayload_config.config,
        parent_id: null,
      },
      version: 1,
    });
  });

  test("updating document works with PUT method (config) after config update threshold", async ({
    request,
  }) => {
    const getResponse = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { headers: projectAHeaders }
    );
    const initialData = await getResponse.json();
    const initialConfigId = initialData.config.id;

    await sleep(200);

    const response = await request.put(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      // Force update by setting update threshold to time lower than the time between the get and the update request
      {
        data: { ...updatePayload_config, version: 1 },
        headers: {
          ...projectAHeaders,
          "x-shopstory-config-update-threshold": "100",
        },
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data).toMatchObject({
      id: exampleDocuments.DocumentA_2.data.id,
      title: newTitle,
      unique_source_identifier: newUniqueSourceIdentifier,
      source: exampleDocuments.DocumentA_2.data.source,
      version: 2,
    });

    expect(data.config_id).not.toBe(initialConfigId);

    const getResponseAfter = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { headers: projectAHeaders }
    );
    const dataAfter = await getResponseAfter.json();

    expect(dataAfter).toMatchObject({
      id: exampleDocuments.DocumentA_2.data.id,
      title: newTitle,
      unique_source_identifier: newUniqueSourceIdentifier,
      source: exampleDocuments.DocumentA_2.data.source,
      config: {
        id: data.config_id,
        config: updatePayload_config.config,
        parent_id: initialConfigId,
      },
    });
  });

  test("updating config fails if specified version is lower than current document's version", async ({
    request,
  }) => {
    const getDocumentBeforeResponse = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { headers: projectAHeaders }
    );
    const documentBeforeUpdate = await getDocumentBeforeResponse.json();

    const updateDocumentResponse = await request.put(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      {
        data: { ...updatePayload_config, version: 1 },
        headers: projectAHeaders,
      }
    );
    const updateDocumentResponseJson = await updateDocumentResponse.json();

    expect(updateDocumentResponse.status()).toBe(400);
    expect(updateDocumentResponseJson).toMatchObject({
      error: "Document version mismatch",
    });

    const getDocumentAfterResponse = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      { headers: projectAHeaders }
    );
    const documentAfterUpdate = await getDocumentAfterResponse.json();

    expect(documentBeforeUpdate).toMatchObject(documentAfterUpdate);
  });

  const deletePayload = {
    headers: {
      [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
    },
  };

  test("deleting fails with incorrect id", async ({ request }) => {
    const response = await request.delete(
      `/api/projects/${PROJECT_A_ID}/documents/xxx`,
      deletePayload
    );
    expect(response.status()).toBe(400);
  });

  test("deleting fails with id from another project", async ({ request }) => {
    const response = await request.delete(
      `/api/projects/${PROJECT_B_ID}/documents/${exampleDocuments.DocumentB_1.data.id}`,
      deletePayload
    );
    expect(response.status()).toBe(404);
  });

  test("deleting documents works", async ({ request }) => {
    const response = await request.delete(
      `/api/projects/${PROJECT_A_ID}/documents/${exampleDocuments.DocumentA_2.data.id}`,
      deletePayload
    );
    expect(response.status()).toBe(200);
  });

  test("deleted templates not available in GET", async ({ request }) => {
    const response = await request.get(
      `/api/projects/${PROJECT_A_ID}/documents`,
      {
        headers: {
          [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
        },
      }
    );

    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data.length).toBe(1);
    expect(data[0].id).toBe(exampleDocuments.DocumentA_1.data.id);
    expect(data[0].title).toBe(exampleDocuments.DocumentA_1.input.title);
  });
});
