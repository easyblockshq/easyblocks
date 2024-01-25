import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const ACCESS_TOKEN_HEADER = "x-shopstory-access-token";

import {
  PROJECT_A_ACCESS_TOKEN,
  PROJECT_A_ID,
  PROJECT_B_ACCESS_TOKEN,
  PROJECT_B_ID,
  SUPABASE_HOST,
  SUPABASE_KEY,
} from "./testData";

test.use({
  baseURL: "http://localhost:3100",
  extraHTTPHeaders: {
    "Content-Type": "application/json",
  },
});

test.describe("API", () => {
  test.describe.serial("templates", () => {
    const exampleTemplates: Record<string, any> = {
      TemplateA_1: {
        accessToken: PROJECT_A_ACCESS_TOKEN,
        projectId: PROJECT_A_ID,
        input: {
          label: "TemplateA_1",
          config: { _id: "$Component" },
          masterTemplateIds: ["xxx"],
          width: 1000,
          widthAuto: false,
        },
      },
      TemplateA_2: {
        accessToken: PROJECT_A_ACCESS_TOKEN,
        projectId: PROJECT_A_ID,
        input: {
          label: "TemplateA_2",
          config: { _id: "$Component" },
          masterTemplateIds: ["aaa", "bbb"],
        },
      },
      TemplateB_1: {
        accessToken: PROJECT_B_ACCESS_TOKEN,
        projectId: PROJECT_B_ID,
        input: {
          label: "TemplateB_1",
          config: { _id: "$Component" },
          width: -1,
          widthAuto: true,
        },
      },
      TemplateB_2: {
        accessToken: PROJECT_B_ACCESS_TOKEN,
        projectId: PROJECT_B_ID,
        input: {
          label: "TemplateB_2",
          config: { _id: "$Component" },
          masterTemplateIds: ["xxx", "yyy"],
        },
      },
    };

    async function cleanAllTestTemplates() {
      const supabase = createClient(SUPABASE_HOST, SUPABASE_KEY, {
        auth: {
          persistSession: false,
        },
      });
      await supabase
        .from("template_mappings")
        .delete()
        .eq("project_id", PROJECT_A_ID);
      await supabase
        .from("template_mappings")
        .delete()
        .eq("project_id", PROJECT_B_ID);
      await supabase.from("templates").delete().eq("project_id", PROJECT_A_ID);
      await supabase.from("templates").delete().eq("project_id", PROJECT_B_ID);
    }

    test.beforeAll(async ({ request }) => {
      // Clean test projects
      await cleanAllTestTemplates();

      for (const key in exampleTemplates) {
        const template = exampleTemplates[key]!;

        const response = await request.post(
          `/api/projects/${template.projectId}/templates`,
          {
            data: template.input,
            headers: {
              [ACCESS_TOKEN_HEADER]: template.accessToken,
            },
          }
        );

        const json = await response.json();
        template.response = response;
        template.data = json;
      }
    });

    test.afterAll(async () => {
      await cleanAllTestTemplates();
    });

    test("the response from add operation is correct", async () => {
      for (const key in exampleTemplates) {
        const template = exampleTemplates[key]!;

        expect(template.response.status()).toBe(200);
        expect(template.data).toMatchObject({
          id: expect.any(String),
          config_id: expect.any(String),
          label: template.input.label,
          width: template.input.width ?? null,
          widthAuto: template.input.widthAuto ?? null,
          archived: false,
        });
      }
    });

    test("GET all templates works (filtered by project_id, sorted, with config added)", async ({
      request,
    }) => {
      const response = await request.get(
        `/api/projects/${PROJECT_A_ID}/templates`,
        {
          headers: {
            [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
          },
        }
      );

      expect(response.status()).toBe(200);

      const data = await response.json();

      expect(data.length).toBe(2);
      expect(data[0].id).toBe(exampleTemplates.TemplateA_2.data.id);
      expect(data[0].label).toBe(exampleTemplates.TemplateA_2.input.label);
      expect(data[0].config.config).toEqual(
        exampleTemplates.TemplateA_2.input.config
      );
      expect(data[0].mapTo).toEqual(
        exampleTemplates.TemplateA_2.input.masterTemplateIds ?? []
      );
      expect(data[0].width).toEqual(
        exampleTemplates.TemplateA_2.input.width ?? null
      );
      expect(data[0].widthAuto).toEqual(
        exampleTemplates.TemplateA_2.input.widthAuto ?? null
      );

      expect(data[1].id).toBe(exampleTemplates.TemplateA_1.data.id);
      expect(data[1].label).toBe(exampleTemplates.TemplateA_1.input.label);
      expect(data[1].config.config).toEqual(
        exampleTemplates.TemplateA_1.input.config
      );
      expect(data[1].mapTo).toEqual(
        exampleTemplates.TemplateA_1.input.masterTemplateIds ?? []
      );
      expect(data[1].width).toEqual(
        exampleTemplates.TemplateA_1.input.width ?? null
      );
      expect(data[1].widthAuto).toEqual(
        exampleTemplates.TemplateA_1.input.widthAuto ?? null
      );
    });

    test("create with no label triggers error", async ({ request }) => {
      const response = await request.post(
        `/api/projects/${PROJECT_A_ID}/templates`,
        {
          data: {
            config: { _component: "$Component2" },
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
        `/api/projects/${PROJECT_A_ID}/templates`,
        {
          data: {
            label: "New label",
          },
          headers: {
            [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
          },
        }
      );

      expect(response.status()).toBe(400);
    });

    const newLabel = "TemplateA_2 Modified";
    const newMapTo = ["xxx", "bbb", "ccc"];
    const updatePayload = {
      data: {
        label: newLabel,
        masterTemplateIds: newMapTo, // one old, one new
      },
      headers: {
        [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
      },
    };

    test("updating fails with incorrect id", async ({ request }) => {
      const response = await request.put(
        `/api/projects/${PROJECT_A_ID}/templates/xxx`,
        updatePayload
      );
      expect(response.status()).toBe(400);
    });

    test("updating fails with id from another project", async ({ request }) => {
      const response = await request.put(
        `/api/projects/${PROJECT_A_ID}/templates/${exampleTemplates.TemplateB_1.data.id}`,
        updatePayload
      );
      expect(response.status()).toBe(400);
    });

    test("updating templates works with PUT method", async ({ request }) => {
      const response = await request.put(
        `/api/projects/${PROJECT_A_ID}/templates/${exampleTemplates.TemplateA_2.data.id}`,
        updatePayload
      );

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data).toMatchObject({
        id: exampleTemplates.TemplateA_2.data.id,
        label: newLabel,
        mapTo: newMapTo,
      });
    });

    test("all templates are consistent after PUT (especially mappings)", async ({
      request,
    }) => {
      const response = await request.get(
        `/api/projects/${PROJECT_A_ID}/templates`,
        {
          headers: {
            [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
          },
        }
      );

      expect(response.status()).toBe(200);

      const data = await response.json();

      expect(data.length).toBe(2);
      expect(data[0].id).toBe(exampleTemplates.TemplateA_2.data.id);
      expect(data[0].label).toBe(newLabel);
      expect(data[0].config.config).toEqual(
        exampleTemplates.TemplateA_2.input.config
      );
      expect(data[0].mapTo).toEqual(newMapTo);
      expect(data[0].width).toEqual(
        exampleTemplates.TemplateA_2.input.width ?? null
      );
      expect(data[0].widthAuto).toEqual(
        exampleTemplates.TemplateA_2.input.widthAuto ?? null
      );

      expect(data[1].id).toBe(exampleTemplates.TemplateA_1.data.id);
      expect(data[1].label).toBe(exampleTemplates.TemplateA_1.input.label);
      expect(data[1].config.config).toEqual(
        exampleTemplates.TemplateA_1.input.config
      );
      expect(data[1].mapTo).toEqual([]); // Empty, because "xxx" is in TemplateA_2 now
      expect(data[1].width).toEqual(
        exampleTemplates.TemplateA_1.input.width ?? null
      );
      expect(data[1].widthAuto).toEqual(
        exampleTemplates.TemplateA_1.input.widthAuto ?? null
      );
    });

    const deletePayload = {
      headers: {
        [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
      },
    };

    test("deleting fails with incorrect id", async ({ request }) => {
      const response = await request.delete(
        `/api/projects/${PROJECT_A_ID}/templates/xxx`,
        deletePayload
      );
      expect(response.status()).toBe(400);
    });

    test("deleting fails with id from another project", async ({ request }) => {
      const response = await request.delete(
        `/api/projects/${PROJECT_B_ID}/templates/${exampleTemplates.TemplateB_1.data.id}`,
        deletePayload
      );
      expect(response.status()).toBe(400);
    });

    test("deleting templates works", async ({ request }) => {
      const response = await request.delete(
        `/api/projects/${PROJECT_A_ID}/templates/${exampleTemplates.TemplateA_2.data.id}`,
        deletePayload
      );
      expect(response.status()).toBe(200);
    });

    test("deleted templates not available in GET", async ({ request }) => {
      const response = await request.get(
        `/api/projects/${PROJECT_A_ID}/templates`,
        {
          headers: {
            [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
          },
        }
      );

      expect(response.status()).toBe(200);

      const data = await response.json();

      expect(data.length).toBe(1);
      expect(data[0].id).toBe(exampleTemplates.TemplateA_1.data.id);
      expect(data[0].label).toBe(exampleTemplates.TemplateA_1.input.label);
      expect(data[0].config.config).toEqual(
        exampleTemplates.TemplateA_1.input.config
      );
      expect(data[0].mapTo).toEqual([]);
      expect(data[0].width).toEqual(
        exampleTemplates.TemplateA_1.input.width ?? null
      );
      expect(data[0].widthAuto).toEqual(
        exampleTemplates.TemplateA_1.input.widthAuto ?? null
      );
    });
  });
});
