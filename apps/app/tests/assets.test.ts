import { APIRequestContext, expect, test } from "@playwright/test";
import { AssetDTO } from "@easyblocks/core";
import { createClient, Session } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { Database } from "../src/infrastructure/supabaseSchema";
import { TableRecord } from "../src/infrastructure/types";
import {
  ACCESS_TOKEN_HEADER,
  createTestUserAndSignIn,
  removeTestUser,
} from "./helpers";

const PROJECT_A_ID = "89ed48c6-dc0b-4936-9a97-4eb791396853";
const PROJECT_A_ACCESS_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NjE5NTM2NzMsImV4cCI6MTY5MzQ4OTY3MywiYXVkIjoiYXV0aGVudGljYXRlZCIsInN1YiI6IjEyMyIsImVtYWlsIjoibWljaGFsQHNob3BzdG9yeS5hcHAiLCJwcm9qZWN0X2lkIjoiODllZDQ4YzYtZGMwYi00OTM2LTlhOTctNGViNzkxMzk2ODUzIn0.3I9QMjhPkYHtzW19g-uIjattobPBiXEK0Fz4AwxEfQg";

test.use({
  baseURL: "http://localhost:3100",
});

test.describe("Assets", () => {
  const supabase = createClient<Database>(
    "http://localhost:54321",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
    {
      auth: {
        persistSession: false,
      },
    }
  );

  let demoProject: TableRecord<"projects">;
  let session: Session;

  function loadTestImageFile(
    fileName: "test_image_1.jpg" | "test_image_2.png"
  ) {
    return fs.createReadStream(path.resolve(__dirname, fileName));
  }

  function loadTestVideoFile(fileName: "test_video_1.mp4") {
    return fs.createReadStream(path.resolve(__dirname, fileName));
  }

  test.beforeAll(async () => {
    const result = await createTestUserAndSignIn(supabase);
    demoProject = result.demoProject;
    session = result.session;
  });

  test.afterEach(async () => {
    // Query all files uploaded for the test demo project during the test
    const { data: allFilesOfTestDemoProject } = await supabase.storage
      .from("assets")
      .list(demoProject.id);

    // Before removing files from storage, delete the records from the assets table
    await supabase
      .from("assets")
      .delete()
      .in(
        "asset_id",
        allFilesOfTestDemoProject.map((f) => f.id)
      );

    // Finally remove the files from the storage
    await supabase.storage
      .from("assets")
      .remove(
        allFilesOfTestDemoProject.map((f) => `${demoProject.id}/${f.name}`)
      );
  });

  test.afterAll(() => removeTestUser(supabase, session));

  test.describe("POST", () => {
    test("should upload given image file for given project", async ({
      request,
    }) => {
      const testImageFile = loadTestImageFile("test_image_1.jpg");

      const uploadResponse = await request.post(
        `/api/projects/${demoProject.id}/assets`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          multipart: {
            file: testImageFile,
          },
        }
      );

      expect(uploadResponse.status()).toBe(200);

      const { data: assetFiles } = await supabase.storage
        .from("assets")
        .list(demoProject.id);

      expect(assetFiles).toHaveLength(1);
      expect(assetFiles[0].name).toBe("test_image_1.jpg");

      const { data: assets } = await supabase
        .from("assets")
        .select()
        .in(
          "asset_id",
          assetFiles.map((f) => f.id)
        );

      expect(assets).toHaveLength(1);
      expect(assets[0].metadata).toEqual({
        height: 1058,
        width: 1410,
      });
    });

    test("should upload given video file for given project", async ({
      request,
    }) => {
      const testVideoFile = loadTestVideoFile("test_video_1.mp4");

      const uploadResponse = await request.post(
        `/api/projects/${demoProject.id}/assets`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          multipart: {
            file: testVideoFile,
          },
        }
      );

      expect(uploadResponse.status()).toBe(200);

      const { data: assetFiles } = await supabase.storage
        .from("assets")
        .list(demoProject.id);

      expect(assetFiles).toHaveLength(1);
      expect(assetFiles[0].name).toBe("test_video_1.mp4");

      const { data: assets } = await supabase
        .from("assets")
        .select()
        .in(
          "asset_id",
          assetFiles.map((f) => f.id)
        );

      expect(assets).toHaveLength(1);
      expect(assets[0].metadata).toBeNull();
    });

    test('should append "(1)" to file\'s name if given file already exists for given project', async ({
      request,
    }) => {
      let testImageFile = loadTestImageFile("test_image_1.jpg");

      const uploadResponse1 = await request.post(
        `/api/projects/${demoProject.id}/assets`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          multipart: {
            file: testImageFile,
          },
        }
      );

      expect(uploadResponse1.status()).toBe(200);

      // We have to create new read stream for the same file, otherwise test hangs up and fails.
      // After reading stream once, it's not possible to read it again without some tricky hacks AFAIK.
      testImageFile = loadTestImageFile("test_image_1.jpg");

      const uploadResponse2 = await request.post(
        `/api/projects/${demoProject.id}/assets`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          multipart: {
            file: testImageFile,
          },
        }
      );

      expect(uploadResponse2.status()).toBe(200);

      const { data: assets } = await supabase.storage
        .from("assets")
        .list(demoProject.id, {
          sortBy: {
            column: "created_at",
          },
        });

      expect(assets).toHaveLength(2);
      expect(assets[0].name).toBe("test_image_1.jpg");
      expect(assets[1].name).toBe("test_image_1 (1).jpg");
    });

    test("shouldn't allow to upload file for project without access", async ({
      request,
    }) => {
      const testImageFile = loadTestImageFile("test_image_1.jpg");

      const uploadResponse = await request.post(
        `/api/projects/${PROJECT_A_ID}/assets`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          multipart: {
            file: testImageFile,
          },
        }
      );

      expect(uploadResponse.status()).toBe(403);
    });

    test("it should return 400 if file is not provided", async ({
      request,
    }) => {
      const uploadResponse = await request.post(
        `/api/projects/${demoProject.id}/assets`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          multipart: {},
        }
      );

      expect(uploadResponse.status()).toBe(400);
    });

    test("it should return 400 if file is not a valid file", async ({
      request,
    }) => {
      const uploadResponse = await request.post(
        `/api/projects/${demoProject.id}/assets`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          multipart: {
            file: "test",
          },
        }
      );

      expect(uploadResponse.status()).toBe(400);
    });

    test("it should return 400 if file is an image and its dimensions can't be obtained", async ({
      request,
    }) => {
      const uploadResponse = await request.post(
        `/api/projects/${demoProject.id}/assets`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          multipart: {
            file: {
              name: "test_image_1.jpg",
              mimeType: "image/png",
              buffer: Buffer.from("test"),
            },
          },
        }
      );

      expect(uploadResponse.status()).toBe(400);
    });
  });

  test.describe("GET", () => {
    // `content` property is a function on purpose to have a new stream on each test.
    // After reading stream once, it's not possible to read it again without some tricky hacks AFAIK.
    const testFiles = [
      {
        name: "test_image_1.jpg",
        metadata: {
          mimeType: "image/jpeg",
          height: 1058,
          width: 1410,
        },
        mediaType: "image",
        content: () => loadTestImageFile("test_image_1.jpg"),
      },
      {
        name: "test_image_2.png",
        metadata: {
          mimeType: "image/png",
          width: 144,
          height: 144,
        },
        mediaType: "image",
        content: () => loadTestImageFile("test_image_2.png"),
      },
      {
        name: "test_video_1.mp4",
        mediaType: "video",
        metadata: {
          mimeType: "video/mp4",
        },
        content: () => loadTestVideoFile("test_video_1.mp4"),
      },
    ] as const;

    async function uploadTestFiles(request: APIRequestContext) {
      await Promise.all(
        testFiles.map((file) =>
          request.post(`/api/projects/${demoProject.id}/assets`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            multipart: {
              file: file.content(),
            },
          })
        )
      );
    }

    test.beforeEach(({ request }) => uploadTestFiles(request));

    test("should return all assets", async ({ request }) => {
      const response = await request.get(
        `/api/projects/${demoProject.id}/assets`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      expect(response.status()).toBe(200);
      const assets = (await response.json()) as Array<AssetDTO>;
      expect(assets).toHaveLength(3);

      const expectedAssets = testFiles.map((file) => ({
        name: file.name,
        id: expect.any(String),
        url: expect.stringMatching(
          new RegExp(`assets/${demoProject.id}/${file.name.replace(".", ".")}$`)
        ),
        mediaType: file.mediaType,
        metadata: file.metadata,
      }));

      expect(assets).toEqual(expectedAssets);
    });

    test('should return image assets only if search param is "type=image"', async ({
      request,
    }) => {
      const response = await request.get(
        `/api/projects/${demoProject.id}/assets?type=image`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      expect(response.status()).toBe(200);
      const assets = (await response.json()) as Array<AssetDTO>;
      expect(assets).toHaveLength(2);

      const expectedAssets = testFiles
        .filter((file) => file.mediaType === "image")
        .map((file) => ({
          name: file.name,
          id: expect.any(String),
          url: expect.stringMatching(
            new RegExp(
              `assets/${demoProject.id}/${file.name.replace(".", ".")}$`
            )
          ),
          mediaType: file.mediaType,
          metadata: file.metadata,
        }));

      expect(assets).toEqual(expectedAssets);
    });

    test('should return video assets only if search param is "type=video"', async ({
      request,
    }) => {
      const response = await request.get(
        `/api/projects/${demoProject.id}/assets?type=video`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      expect(response.status()).toBe(200);
      const assets = (await response.json()) as Array<AssetDTO>;
      expect(assets).toHaveLength(1);

      const expectedAssets = testFiles
        .filter((file) => file.mediaType === "video")
        .map((file) => ({
          name: file.name,
          id: expect.any(String),
          url: expect.stringMatching(
            new RegExp(
              `assets/${demoProject.id}/${file.name.replace(".", ".")}$`
            )
          ),
          mediaType: file.mediaType,
          metadata: file.metadata,
        }));

      expect(assets).toEqual(expectedAssets);
    });

    test("should return only matching assets if search param ids is given", async ({
      request,
    }) => {
      const { data: filteredAssets } = await supabase.storage
        .from("assets")
        .list(demoProject.id, { search: "test_image_" });

      const idsSearchParam = filteredAssets
        .map((asset) => `ids=${asset.id}`)
        .join("&");

      const response = await request.get(
        `/api/projects/${demoProject.id}/assets?${idsSearchParam}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      expect(response.status()).toBe(200);
      const assets = (await response.json()) as Array<AssetDTO>;
      expect(assets).toHaveLength(2);

      const expectedAssets = testFiles
        .filter((file) => file.name.includes("test_image_"))
        .map((file) => ({
          name: file.name,
          id: expect.any(String),
          url: expect.stringMatching(
            new RegExp(
              `assets/${demoProject.id}/${file.name.replace(".", ".")}$`
            )
          ),
          mediaType: file.mediaType,
          metadata: file.metadata,
        }));

      expect(assets).toEqual(expectedAssets);
    });

    test("shouldn't allow to get assets from other projects", async ({
      request,
    }) => {
      const response = await request.get(
        `/api/projects/${demoProject.id}/assets`,
        {
          headers: {
            [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
          },
        }
      );

      expect(response.status()).toBe(403);
    });
  });

  test.describe("DELETE", () => {
    test("should delete given asset", async ({ request }) => {
      const testImageFile = loadTestImageFile("test_image_1.jpg");

      await request.post(`/api/projects/${demoProject.id}/assets`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        multipart: {
          file: testImageFile,
        },
      });

      const { data: assetFilesBeforeDelete } = await supabase.storage
        .from("assets")
        .list(demoProject.id);

      expect(assetFilesBeforeDelete).toHaveLength(1);

      const { data: assetsBeforeDelete } = await supabase
        .from("assets")
        .select()
        .in(
          "asset_id",
          assetFilesBeforeDelete.map((a) => a.id)
        );

      expect(assetsBeforeDelete).toHaveLength(1);

      const deleteResponse = await request.delete(
        `/api/projects/${demoProject.id}/assets/${assetFilesBeforeDelete[0].id}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      expect(deleteResponse.status()).toBe(200);

      const { data: assetFilesAfterDelete } = await supabase.storage
        .from("assets")
        .list(demoProject.id);

      expect(assetFilesAfterDelete).toHaveLength(0);
    });

    test("shouldn't allow to delete assets from other projects", async ({
      request,
    }) => {
      const testImageFile = loadTestImageFile("test_image_1.jpg");

      await request.post(`/api/projects/${demoProject.id}/assets`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        multipart: {
          file: testImageFile,
        },
      });

      const { data: assetFilesBeforeDelete } = await supabase.storage
        .from("assets")
        .list(demoProject.id);

      const { data: assetsBeforeDelete } = await supabase
        .from("assets")
        .select()
        .in(
          "asset_id",
          assetFilesBeforeDelete.map((a) => a.id)
        );

      expect(assetFilesBeforeDelete).toHaveLength(1);
      expect(assetsBeforeDelete).toHaveLength(1);

      const deleteResponse = await request.delete(
        `/api/projects/${demoProject.id}/assets/${assetFilesBeforeDelete[0].id}`,
        {
          headers: {
            [ACCESS_TOKEN_HEADER]: PROJECT_A_ACCESS_TOKEN,
          },
        }
      );

      expect(deleteResponse.status()).toBe(403);

      const { data: assetFilesAfterDelete } = await supabase.storage
        .from("assets")
        .list(demoProject.id);

      const { data: assetsAfterDelete } = await supabase
        .from("assets")
        .select()
        .in(
          "asset_id",
          assetFilesAfterDelete.map((a) => a.id)
        );

      expect(assetFilesAfterDelete).toHaveLength(1);
      expect(assetsAfterDelete).toHaveLength(1);
    });
  });
});
