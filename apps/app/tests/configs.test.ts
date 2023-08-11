import { expect, test } from "@playwright/test";
import { uniqueId } from "@easyblocks/utils";

const ACCESS_TOKEN_HEADER = "x-shopstory-access-token";

const PROJECT_A_ID = "89ed48c6-dc0b-4936-9a97-4eb791396853";
const PROJECT_A_ACCESS_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NjE5NTM2NzMsImV4cCI6MTY5MzQ4OTY3MywiYXVkIjoiYXV0aGVudGljYXRlZCIsInN1YiI6IjEyMyIsImVtYWlsIjoibWljaGFsQHNob3BzdG9yeS5hcHAiLCJwcm9qZWN0X2lkIjoiODllZDQ4YzYtZGMwYi00OTM2LTlhOTctNGViNzkxMzk2ODUzIn0.3I9QMjhPkYHtzW19g-uIjattobPBiXEK0Fz4AwxEfQg";

test.use({
  baseURL: "http://localhost:3100",
  extraHTTPHeaders: {
    "Content-Type": "application/json",
  },
});

test.describe("configs", () => {
  test("should return a config for given id", async ({ request }) => {
    const saveTestConfigResponse = await request.post("/api/save-config", {
      headers: {
        [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
      },
      data: {
        id: uniqueId(),
        config: {
          _template: "$text",
          _id: "local.xxx",
          value: {
            __localized: true,
            en: "English",
            de: "Deutsch",
          },
        },
        project_id: PROJECT_A_ID,
        parent_id: null,
      },
    });

    const testConfig = await saveTestConfigResponse.json();

    const response = await request.get(`/api/configs/${testConfig.id}`, {
      headers: {
        [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toEqual(testConfig);
  });

  test("should return localised config for given id if locale option is given", async ({
    request,
  }) => {
    const saveTestConfigResponse = await request.post("/api/save-config", {
      headers: {
        [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
      },
      data: {
        id: uniqueId(),
        config: {
          _template: "$text",
          _id: "local.xxx",
          value: {
            __localized: true,
            en: "English",
            de: "Deutsch",
          },
        },
        project_id: PROJECT_A_ID,
        parent_id: null,
      },
    });

    const testConfig = await saveTestConfigResponse.json();

    const response = await request.get(
      `/api/configs/${testConfig.id}?locale=de`,
      {
        headers: {
          [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
        },
      }
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      ...testConfig,
      config: {
        _template: "$text",
        _id: "local.xxx",
        value: {
          de: "Deutsch",
        },
      },
    });
  });

  test("should return localised config for given id if locale option with fallback is given", async ({
    request,
  }) => {
    const saveTestConfigResponse = await request.post("/api/save-config", {
      headers: {
        [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
      },
      data: {
        id: uniqueId(),
        config: {
          _template: "$text",
          _id: "local.xxx",
          value1: {
            __localized: true,
            en: "English",
            de: "Deutsch",
          },
          value2: {
            __localized: true,
            en: "English",
          },
        },
        project_id: PROJECT_A_ID,
        parent_id: null,
      },
    });

    const testConfig = await saveTestConfigResponse.json();

    const response = await request.get(
      `/api/configs/${testConfig.id}?locale=de&locale=en`,
      {
        headers: {
          [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
        },
      }
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      ...testConfig,
      config: {
        _template: "$text",
        _id: "local.xxx",
        value1: {
          de: "Deutsch",
        },
        value2: {
          __fallback: true,
          de: "English",
        },
      },
    });
  });

  test("should return localised config for given id and project id if locale option is given", async ({
    request,
  }) => {
    const saveTestConfigResponse = await request.post("/api/save-config", {
      headers: {
        [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
      },
      data: {
        id: uniqueId(),
        config: {
          _template: "$text",
          _id: "local.xxx",
          value: {
            __localized: true,
            en: "English",
            de: "Deutsch",
          },
        },
        project_id: PROJECT_A_ID,
        parent_id: null,
      },
    });

    const testConfig = await saveTestConfigResponse.json();

    const response = await request.get(
      `/api/projects/${PROJECT_A_ID}/configs/${testConfig.id}?locale=de`,
      {
        headers: {
          [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
        },
      }
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.config).toEqual({
      _template: "$text",
      _id: "local.xxx",
      value: {
        de: "Deutsch",
      },
    });
  });

  test("should return localised config for given id and project id if locale option with fallback is given", async ({
    request,
  }) => {
    const saveTestConfigResponse = await request.post("/api/save-config", {
      headers: {
        [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
      },
      data: {
        id: uniqueId(),
        config: {
          _template: "$text",
          _id: "local.xxx",
          value1: {
            __localized: true,
            en: "English",
            de: "Deutsch",
          },
          value2: {
            __localized: true,
            en: "English",
          },
        },
        project_id: PROJECT_A_ID,
        parent_id: null,
      },
    });

    const testConfig = await saveTestConfigResponse.json();

    const response = await request.get(
      `/api/projects/${PROJECT_A_ID}/configs/${testConfig.id}?locale=de&locale=en`,
      {
        headers: {
          [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
        },
      }
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.config).toEqual({
      _template: "$text",
      _id: "local.xxx",
      value1: {
        de: "Deutsch",
      },
      value2: {
        __fallback: true,
        de: "English",
      },
    });
  });
});
