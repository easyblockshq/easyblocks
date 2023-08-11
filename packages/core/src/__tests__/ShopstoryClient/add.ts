import { mockConsoleMethod } from "@easyblocks/test-utils";
import { ShopstoryClient } from "../../ShopstoryClient";
import { getLauncherPlugin } from "../../syncResources";
import { createTestConfig } from "../../testUtils";
import { Config, LauncherPlugin } from "../../types";

afterEach(() => {
  jest.resetAllMocks();
});

test("returns new reference to compiled config that's empty at the beginning for each of accepted inputs", async () => {
  const shopstoryClient = new ShopstoryClient(createTestConfig(), {
    locale: "en-US",
  });

  const configComponentInput = shopstoryClient.add({
    _id: "123",
    _template: "$RootSections",
    data: [],
  });

  const contentPieceRemoteInput = shopstoryClient.add({
    id: "xxx",
    hash: "total valid hash",
  });

  const contentPieceLocalInput = shopstoryClient.add({
    content: {
      _id: "321",
      _template: "$RootSections",
      data: [],
    },
  });

  const contentPieceFullInput = shopstoryClient.add({
    id: "yyy",
    hash: "total valid hash",
    content: {
      _id: "456",
      _template: "$RootSections",
      data: [],
    },
  });

  const undefinedInput = shopstoryClient.add(undefined);

  const nullInput = shopstoryClient.add(null);

  expect(configComponentInput.renderableContent).toBeNull();
  expect(contentPieceRemoteInput.renderableContent).toBeNull();
  expect(contentPieceLocalInput.renderableContent).toBeNull();
  expect(contentPieceFullInput.renderableContent).toBeNull();
  expect(undefinedInput.renderableContent).toBeNull();
  expect(nullInput.renderableContent).toBeNull();
});

test("doesn't throw when given input is invalid", () => {
  const { mockedFn: consoleErrorMock } = mockConsoleMethod("error");

  const shopstoryClient = new ShopstoryClient(createTestConfig(), {
    locale: "en-US",
  });

  expect(() =>
    shopstoryClient.add({
      prop1: "not a config",
    })
  ).not.toThrow();

  expect(() => shopstoryClient.add("invalid input")).not.toThrow();

  expect(consoleErrorMock).toHaveBeenCalledTimes(0);
});

test("invokes configTransform method when given", () => {
  const testConfig: Config = {
    plugins: [
      {
        id: "test-plugin",
        launcher: {
          image: {
            resourceType: "test.image",
            transform: () => {
              return {
                alt: "",
                aspectRatio: -1,
                mimeType: "",
                srcset: [],
                url: "",
              };
            },
          },
          video: {
            resourceType: "test.video",
            transform: () => {
              return {
                alt: "",
                url: "",
                aspectRatio: -1,
              };
            },
          },
          onEditorLoad: () => {},
        },
      },
    ],
  };
  const configTransformMock = jest.fn((input) => input);

  const launcherPlugin = getLauncherPlugin(testConfig);

  const launcherPluginWithTransform: LauncherPlugin = {
    ...launcherPlugin,
    launcher: {
      ...launcherPlugin.launcher,
      configTransform: configTransformMock,
    },
  };

  const shopstoryClient = new ShopstoryClient(
    {
      ...testConfig,
      plugins: [launcherPluginWithTransform],
    },
    { locale: "en" }
  );

  shopstoryClient.add({
    _template: "$RootSections",
    _id: "xxx",
    data: [],
  });

  expect(configTransformMock).toHaveBeenCalledTimes(1);
});
