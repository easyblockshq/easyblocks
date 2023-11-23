import { normalize } from "@easyblocks/compiler";
import {
  ComponentConfig,
  Document,
  ResponsiveValue,
  DocumentDTO,
  DocumentWithResolvedConfigDTO,
  IApiClient,
} from "@easyblocks/core";
import { mock, mockConsoleMethod } from "@easyblocks/test-utils";
import { assertDefined, deepClone, dotNotationSet } from "@easyblocks/utils";
import { renderHook } from "@testing-library/react";
import React from "react";
import { PartialDeep } from "type-fest";
import { EditorContextType } from "./EditorContext";
import { ApiClientProvider } from "./infrastructure/ApiClientProvider";
import { TextSyncers } from "./types";
import { useDataSaver } from "./useDataSaver";
import { addLocalizedFlag } from "./utils/locales/addLocalizedFlag";
import {
  ControllableMockAsyncFunction,
  createControllableMockAsyncFunction,
  testEditorContext,
} from "./utils/tests";

afterEach(() => {
  jest.clearAllMocks();
});

function createEditorContext(
  initialConfig: ComponentConfig,
  ignoreCrud?: boolean
): {
  editorContext: EditorContextType;
  mockCreate: any;
  mockUpdate: any;
  mockRemove: ControllableMockAsyncFunction<NonNullable<TextSyncers["remove"]>>;
  mockSaveConfig: ControllableMockAsyncFunction<EditorContextType["save"]>;
  initialConfig: ComponentConfig;
} {
  const editorContext: EditorContextType = {
    ...testEditorContext,
  };

  const normalizedInitialConfig = normalize(initialConfig, editorContext);

  const form: any = {
    values: normalizedInitialConfig,
  };

  form.change = (path: string, newData: any) => {
    dotNotationSet(form, path === "" ? "values" : "values." + path, newData);
  };

  const mockCreate = createControllableMockAsyncFunction();
  const mockUpdate = createControllableMockAsyncFunction();
  const mockRemove = createControllableMockAsyncFunction();
  const mockSaveConfig = createControllableMockAsyncFunction();

  return {
    editorContext: {
      ...editorContext,
      actions: {
        ...editorContext.actions,
        runChange: (cb: () => string[] | void) => cb(),
      },
      form,
      text: ignoreCrud
        ? undefined
        : {
            create: mockCreate.function,
            update: mockUpdate.function,
            remove: mockRemove.function,
          },
      save: mockSaveConfig.function,
      project: {
        id: "test-project",
        name: "Test project",
        token: "test-project-token",
      },
    },
    mockCreate,
    mockUpdate,
    mockSaveConfig,
    mockRemove,
    initialConfig: normalizedInitialConfig,
  };
}

const textItems: Array<ComponentConfig> = [
  {
    _template: "@easyblocks/text",
    value: {
      id: "123",
    },
  },
  {
    _template: "@easyblocks/text",
    value: {
      id: "345",
    },
  },
];

const INVALIDATION_TIME = 5000;

jest.useFakeTimers();

async function advanceTimer(ms: number) {
  jest.advanceTimersByTime(ms);

  /**
   * When we advance timer, we might get stuck on unresolved promises.
   *
   * Even if we control promises that are "external" (like text.create, text.update or save) and can resolve them manually, we can't do this with "internal" promises.
   * When there's "await doSomething();" in code and it immediately returns (doesn't call any callback from API like text.update), it waits until next tick to resolve.
   * Following code makes sure that if we advance time and there are some internal callbacks pending, they'll be flushed ASAP.
   */
  await new Promise(process.nextTick);
  await new Promise(process.nextTick);
  await new Promise(process.nextTick);
  await new Promise(process.nextTick);
  await new Promise(process.nextTick);
  await new Promise(process.nextTick);
  await new Promise(process.nextTick);
}

const testApiClient: IApiClient = {
  request: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  configs: {
    getConfigById: jest.fn(),
  },
  documents: {
    getDocumentById: jest.fn(),
    getDocuments: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    getDocumentByUniqueSourceIdentifier: jest.fn(),
  },
  assets: {
    getAssets: jest.fn(),
    removeAsset: jest.fn(),
    uploadAsset: jest.fn(),
  },
};

function renderUseDataSaverHook({
  initialDocument,
  editorContext,
  uniqueSourceIdentifier,
}: {
  editorContext: EditorContextType;
  initialDocument: DocumentWithResolvedConfigDTO | null;
  uniqueSourceIdentifier?: string;
}) {
  return renderHook(
    ({ editorContext, initialDocument, uniqueSourceIdentifier }) =>
      useDataSaver(initialDocument, uniqueSourceIdentifier, editorContext),
    {
      initialProps: {
        editorContext,
        initialDocument,
        uniqueSourceIdentifier,
      },
      wrapper: ({ children }) => (
        <ApiClientProvider apiClient={testApiClient}>
          {children}
        </ApiClientProvider>
      ),
    }
  );
}

function createTestDocument(values: PartialDeep<DocumentDTO> = {}) {
  return {
    archived: false,
    config_id: "1",
    created_at: "",
    id: "test-document",
    project_id: "test-project",
    source: "test-source",
    title: "Test document",
    updated_at: "",
    unique_source_identifier: null,
    version: 0,
    root_container: "content",
    ...values,
  };
}

function createTestDocumentWithResolvedConfig(
  values: PartialDeep<Omit<DocumentWithResolvedConfigDTO, "config">> & {
    config?: Partial<DocumentWithResolvedConfigDTO["config"]>;
  } = {}
): DocumentWithResolvedConfigDTO {
  return {
    ...createTestDocument(values),
    archived: false,
    config_id: "1",
    created_at: "",
    id: "test-document",
    project_id: "test-project",
    source: "test-source",
    title: "Test document",
    updated_at: "",
    unique_source_identifier: null,
    version: 0,
    ...values,
    config: {
      config: { _template: "$RootSections", data: [] },
      created_at: "",
      id: "1",
      metadata: null,
      parent_id: null,
      project_id: "test-project",
      updated_at: "",
      ...(values.config ?? {}),
    },
    root_container: "content",
  };
}

/**
 * DISCLAIMER
 * --
 * All tests using CRUD text actions are temporarily disabled after we've introduced resources store and removed values kept there from config.
 * Because of this change we would have to read text external's values from resources store now instead of just reading config.
 * It's possible to introduce this change, but it would definitely take some time and it's not worth to invest it right now.
 */

describe("useDataSaver", () => {
  describe("initialization", () => {
    test("without temporary ids don't trigger any save actions", async () => {
      const {
        editorContext,
        mockCreate,
        mockUpdate,
        mockRemove,
        mockSaveConfig,
      } = createEditorContext({
        _template: "$stack",
        Items: [...textItems],
      });

      renderUseDataSaverHook({
        editorContext,
        initialDocument: null,
      });

      expect(mockCreate.function).toHaveBeenCalledTimes(0);
      expect(mockUpdate.function).toHaveBeenCalledTimes(0);
      expect(mockRemove.function).toHaveBeenCalledTimes(0);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);

      await advanceTimer(INVALIDATION_TIME + 100);

      expect(editorContext.text!.create).toHaveBeenCalledTimes(0);
      expect(editorContext.text!.update).toHaveBeenCalledTimes(0);
      expect(editorContext.text!.remove).toHaveBeenCalledTimes(0);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);
    });

    test("with local ids it should trigger save actions", async () => {
      const expectedId = "1234";
      const mockCreateDocument = jest.fn().mockResolvedValue({
        id: expectedId,
        version: 0,
      });
      testApiClient.documents.createDocument = mockCreateDocument;

      const {
        mockCreate,
        mockSaveConfig,
        mockRemove,
        mockUpdate,
        editorContext,
      } = createEditorContext({
        _template: "$RootSections",
        data: [
          {
            _template: "$stack",
            Items: [
              ...textItems,
              {
                _template: "@easyblocks/text",
                value: {
                  id: "local.123",
                  value: { en: "Lorem ipsum" },
                },
              },
              {
                _template: "@easyblocks/text",
                value: {
                  id: "local.345",
                  value: { en: "Dolor sit amet" },
                },
              },
            ],
          },
        ],
      });

      renderUseDataSaverHook({
        editorContext,
        initialDocument: null,
      });

      // 0 times before 10s
      expect(mockCreate.function).toHaveBeenCalledTimes(0);

      await advanceTimer(INVALIDATION_TIME / 2);
      expect(mockCreate.function).toHaveBeenCalledTimes(0);
      await advanceTimer(INVALIDATION_TIME / 2 + 1000);

      expect(mockCreate.function).toHaveBeenCalledTimes(1);
      expect(mockCreate.function).toHaveBeenNthCalledWith(
        1,
        [
          { id: "local.123", value: { en: "Lorem ipsum" } },
          { id: "local.345", value: { en: "Dolor sit amet" } },
        ],
        {
          locale: "en",
        }
      );
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);

      await mockCreate.resolve({
        "local.123": {
          id: "new.123",
          value: "Lorem ipsum",
        },
        "local.345": {
          id: "new.345",
          value: "Dolor sit amet",
        },
      });

      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

      const savedItems =
        mockCreateDocument.mock.calls[0][0].config.data[0].Items;
      expect(savedItems[2].value).toEqual({ id: "new.123" });
      expect(savedItems[3].value).toEqual({ id: "new.345" });

      expect(editorContext.text!.remove).toHaveBeenCalledTimes(0);

      // successful config save!
      await mockSaveConfig.resolve();

      expect(editorContext.text!.remove).toHaveBeenCalledTimes(0);

      // On the next tick nothing happens, because of no changes
      await advanceTimer(INVALIDATION_TIME);

      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
      expect(mockCreate.function).toHaveBeenCalledTimes(1);
      expect(mockUpdate.function).toHaveBeenCalledTimes(0);
      expect(mockRemove.function).toHaveBeenCalledTimes(0);
    });
  });

  describe("changing config without text changes", () => {
    test("config changes work properly and don't trigger any text operations", async () => {
      const mockCreateDocument = mock<
        IApiClient["documents"]["createDocument"]
      >(async () => createTestDocument());

      testApiClient.documents.createDocument = mockCreateDocument;

      const {
        mockRemove,
        mockSaveConfig,
        mockCreate,
        mockUpdate,
        editorContext,
      } = createEditorContext({
        _template: "$RootSections",
        data: [
          {
            _template: "$stack",
            Items: [...textItems],
          },
        ],
      });

      renderUseDataSaverHook({
        editorContext,
        initialDocument: null,
      });

      await advanceTimer(INVALIDATION_TIME + 1000);

      // if no changes happened save is not called
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);

      const newColor: ResponsiveValue<string> = { $res: true, b4: "#ff0000" };
      editorContext.form.values.data[0].Items[0].color = newColor;

      await advanceTimer(INVALIDATION_TIME);

      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

      const color =
        mockCreateDocument.mock.calls[0][0].config.data[0].Items[0].color;

      expect(color).toEqual(newColor);
      await mockSaveConfig.resolve();

      function testLastState() {
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
        expect(editorContext.form.values.data[0].Items[0].color).toEqual(
          newColor
        );
        expect(mockCreate.function).toHaveBeenCalledTimes(0);
        expect(mockUpdate.function).toHaveBeenCalledTimes(0);
        expect(mockRemove.function).toHaveBeenCalledTimes(0);
      }

      testLastState();
      await advanceTimer(INVALIDATION_TIME);
      testLastState();
      await advanceTimer(INVALIDATION_TIME);
      testLastState();
    });
  });

  describe("removing existing text", () => {
    const mockCreateDocument = mock<IApiClient["documents"]["createDocument"]>(
      async () => createTestDocument()
    );
    const mockUpdateDocument = mock<IApiClient["documents"]["updateDocument"]>(
      async ({ version, config }) =>
        createTestDocumentWithResolvedConfig({
          config: {
            config,
          },
          version: assertDefined(version || 0) + 1,
        })
    );
    let mockRemove: ReturnType<typeof createEditorContext>["mockRemove"];
    let mockCreate: ReturnType<typeof createEditorContext>["mockCreate"];
    let mockUpdate: ReturnType<typeof createEditorContext>["mockUpdate"];

    let mockSaveConfig: ReturnType<
      typeof createEditorContext
    >["mockSaveConfig"];

    let editorContext: EditorContextType;

    beforeEach(async () => {
      testApiClient.documents.createDocument = mockCreateDocument;
      testApiClient.documents.updateDocument = mockUpdateDocument;

      const context = createEditorContext({
        _template: "$RootSections",
        data: [
          {
            _template: "$stack",
            Items: [...textItems],
          },
        ],
      });

      mockRemove = context.mockRemove;
      mockSaveConfig = context.mockSaveConfig;
      mockCreate = context.mockCreate;
      mockUpdate = context.mockUpdate;
      editorContext = context.editorContext;

      renderUseDataSaverHook({
        editorContext,
        initialDocument: null,
      });

      // Before 10s nothing is happening
      await advanceTimer(INVALIDATION_TIME / 2);

      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);

      await advanceTimer(INVALIDATION_TIME / 2 + 1000);

      expect(mockCreate.function).toHaveBeenCalledTimes(0);
      expect(mockUpdate.function).toHaveBeenCalledTimes(0);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);

      // remove 2 items
      editorContext.form.values.data[0].Items.pop();
      editorContext.form.values.data[0].Items.pop();

      await advanceTimer(INVALIDATION_TIME / 2);

      expect(mockRemove.function).toHaveBeenCalledTimes(0);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);

      // now we should trigger update
      await advanceTimer(INVALIDATION_TIME / 2);

      // save config should have been called first, remove is called after save is success
      expect(mockRemove.function).toHaveBeenCalledTimes(0);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
      expect(
        mockCreateDocument.mock.calls[0][0].config.data[0].Items
      ).toHaveLength(0);
    });

    test("successful removals work properly", async () => {
      // Let's resolve save with success. After that remove should go with removed ids
      await mockSaveConfig.resolve();
      expect(mockRemove.function).toHaveBeenCalledTimes(1);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
      expect(mockRemove.function).toHaveBeenNthCalledWith(1, ["123", "345"]);

      await mockRemove.resolve();

      // After long time of inactivity we shouldn't call anything else
      await advanceTimer(INVALIDATION_TIME * 10);

      expect(mockRemove.function).toHaveBeenCalledTimes(1);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
    });

    // This test is skipped on purpose because it's an edge case that is not handled by the current implementation
    // and it's not important until we enable usage of text CRUD operations.
    test.skip("unsuccessful save operation after removal doesn't trigger subsequent remove operations, but can be retried successfully", async () => {
      mockConsoleMethod("log");
      const consoleWarnMock = mockConsoleMethod("warn");
      // Let's reject save operation. Remove shouldn't be called after that.
      await mockSaveConfig.reject();
      expect(consoleWarnMock.mockedFn).toHaveBeenNthCalledWith(
        1,
        "Error while saving config or removing items"
      );

      expect(mockRemove.function).toHaveBeenCalledTimes(0);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

      // Let's wait until next auto-save tick
      await advanceTimer(INVALIDATION_TIME);

      expect(mockRemove.function).toHaveBeenCalledTimes(0);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(2);

      await mockSaveConfig.resolve();
      expect(mockRemove.function).toHaveBeenNthCalledWith(1, ["123", "345"]);
      await mockRemove.resolve();

      // After long time of inactivity we shouldn't call anything else
      await advanceTimer(INVALIDATION_TIME * 10);

      expect(mockRemove.function).toHaveBeenCalledTimes(1);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(2);
      expect(consoleWarnMock.mockedFn).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * This function runs the same set of tests whether operation is adding new text or modifying existing text.
   * It tests different things like what if text was moved during operation, what if it was removed, etc etc
   *
   * @param testTitle
   * @param thirdItemBeforeModification
   * @param thirdItemAfterModification
   */
  function runTestsForAddOrModify(
    testTitle: string,
    thirdItemBeforeModification: any,
    thirdItemAfterModification: any,
    update?: boolean
  ) {
    describe(testTitle, () => {
      let mockCreateDocument: ReturnType<
        typeof mock<IApiClient["documents"]["createDocument"]>
      >;
      let mockUpdateDocument: ReturnType<
        typeof mock<IApiClient["documents"]["updateDocument"]>
      >;
      let mockCreate: ReturnType<typeof createEditorContext>["mockCreate"];
      let mockUpdate: ReturnType<typeof createEditorContext>["mockUpdate"];
      let mockRemove: ReturnType<typeof createEditorContext>["mockRemove"];
      let mockSaveConfig: ReturnType<
        typeof createEditorContext
      >["mockSaveConfig"];

      let mockActiveOperation: ReturnType<
        typeof createEditorContext
      >["mockCreate"];
      let mockInactiveOperation: ReturnType<
        typeof createEditorContext
      >["mockCreate"];

      let editorContext: EditorContextType;

      const START_ITEMS = [...textItems];

      if (thirdItemBeforeModification) {
        START_ITEMS.push(thirdItemBeforeModification);
      }

      beforeEach(async () => {
        mockCreateDocument = mock<IApiClient["documents"]["createDocument"]>(
          async () => createTestDocument()
        );

        mockUpdateDocument = mock<IApiClient["documents"]["updateDocument"]>(
          async ({ version }) =>
            createTestDocument({ version: (version || 0) + 1 })
        );

        testApiClient.documents.createDocument = mockCreateDocument;
        testApiClient.documents.updateDocument = mockUpdateDocument;

        const initialConfig: ComponentConfig = {
          _template: "$RootSections",
          data: [
            {
              _template: "$stack",
              Items: START_ITEMS,
            },
          ],
        };

        const context = createEditorContext(initialConfig);

        mockCreate = context.mockCreate;
        mockUpdate = context.mockUpdate;
        mockRemove = context.mockRemove;
        mockSaveConfig = context.mockSaveConfig;
        mockActiveOperation = update ? mockUpdate : mockCreate;
        mockInactiveOperation = update ? mockCreate : mockUpdate;
        editorContext = context.editorContext;

        renderUseDataSaverHook({
          editorContext,
          initialDocument: null,
        });

        await advanceTimer(INVALIDATION_TIME / 2);

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(0);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);

        // Modify third item (it's either ADD or MODIFY operation)
        editorContext.form.values.data[0].Items[2] = deepClone(
          thirdItemAfterModification
        );

        await advanceTimer(INVALIDATION_TIME / 2 + 1000);

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);
        expect(mockActiveOperation.function).toHaveBeenNthCalledWith(
          1,
          [thirdItemAfterModification.value],
          {
            locale: "en",
          }
        );
      });

      test("without interruptions, all operations successful", async () => {
        await mockActiveOperation.resolve({
          [thirdItemAfterModification.value.id]: {
            id: "new.123",
            value: "Lorem ipsum",
          },
        });

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

        // form.values not yet updated!!! This is important.
        // we can update only after successful save
        // If save is unsuccessful, we don't want to keep new ids in the new config.
        // It's simple. If save was unsuccessful, we want to have the same state as before save. As if save didn't happen at all. It's simpler to understand.
        expect(editorContext.form.values.data[0].Items[2]).toEqual(
          thirdItemAfterModification
        );
        expect(
          mockCreateDocument.mock.calls[0][0].config.data[0].Items[2].value
        ).toEqual({ id: "new.123" });

        // Successful config save
        await mockSaveConfig.resolve();

        const testStateAfterAllOperations = () => {
          expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
          expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
          expect(editorContext.form.values.data[0].Items[2].value.id).toBe(
            "new.123"
          );

          // unnecessary operations were not called
          expect(mockInactiveOperation.function).toHaveBeenCalledTimes(0);
          expect(mockRemove.function).toHaveBeenCalledTimes(0);
        };

        // everything is OK
        testStateAfterAllOperations();

        // even on next ticks no changes
        await advanceTimer(INVALIDATION_TIME);
        testStateAfterAllOperations();
        await advanceTimer(INVALIDATION_TIME);
        testStateAfterAllOperations();
      });

      test("and then moving text (changing its path)", async () => {
        // Move to the first position
        const lastItem = editorContext.form.values.data[0].Items.pop();
        editorContext.form.values.data[0].Items.unshift(lastItem);

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);

        await mockActiveOperation.resolve({
          [thirdItemAfterModification.value.id]: {
            id: "new.123",
            value: "Lorem ipsum",
          },
        });

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

        // Before save is done, we have old form.values
        expect(editorContext.form.values.data[0].Items[0]).toEqual(
          thirdItemAfterModification
        );
        expect(editorContext.form.values.data[0].Items[1].value.id).toBe("123");
        expect(editorContext.form.values.data[0].Items[2].value.id).toBe("345");

        // we save config before change
        expect(
          mockCreateDocument.mock.calls[0][0].config.data[0].Items[0].value
        ).toEqual({ id: "123" });
        expect(
          mockCreateDocument.mock.calls[0][0].config.data[0].Items[1].value
        ).toEqual({ id: "345" });
        expect(
          mockCreateDocument.mock.calls[0][0].config.data[0].Items[2].value
        ).toEqual({ id: "new.123" });

        // Successful config save
        await mockSaveConfig.resolve();

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

        expect(editorContext.form.values.data[0].Items[0].value.id).toBe(
          "new.123"
        );
        expect(editorContext.form.values.data[0].Items[1].value.id).toBe("123");
        expect(editorContext.form.values.data[0].Items[2].value.id).toBe("345");

        // unnecessary operations were not called
        expect(mockInactiveOperation.function).toHaveBeenCalledTimes(0);
        expect(mockRemove.function).toHaveBeenCalledTimes(0);

        // Let's wait for next invalidation
        await advanceTimer(INVALIDATION_TIME);

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(2);

        // now config AFTER change is called
        expect(
          assertDefined(mockUpdateDocument.mock.calls[0][0].config).data[0]
            .Items[0].value
        ).toEqual({ id: "new.123" });
        expect(
          assertDefined(mockUpdateDocument.mock.calls[0][0].config).data[0]
            .Items[1].value
        ).toEqual({ id: "123" });
        expect(
          assertDefined(mockUpdateDocument.mock.calls[0][0].config).data[0]
            .Items[2].value
        ).toEqual({ id: "345" });

        // Successful config save
        await mockSaveConfig.resolve();

        function testLastState() {
          expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
          expect(mockSaveConfig.function).toHaveBeenCalledTimes(2);

          expect(editorContext.form.values.data[0].Items[0].value.id).toBe(
            "new.123"
          );
          expect(editorContext.form.values.data[0].Items[1].value.id).toBe(
            "123"
          );
          expect(editorContext.form.values.data[0].Items[2].value.id).toBe(
            "345"
          );

          // unnecessary operations were not called
          expect(mockInactiveOperation.function).toHaveBeenCalledTimes(0);
          expect(mockRemove.function).toHaveBeenCalledTimes(0);
        }

        testLastState();
        await advanceTimer(INVALIDATION_TIME);
        testLastState();
        await advanceTimer(INVALIDATION_TIME);
        testLastState();
      });

      test("and then removing it", async () => {
        // Move to the first position
        editorContext.form.values.data[0].Items.pop();

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);

        await mockActiveOperation.resolve({
          [thirdItemAfterModification.value.id]: {
            id: "new.123",
            value: "Lorem ipsum",
          },
        });

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

        // we save config from before change
        expect(
          mockCreateDocument.mock.calls[0][0].config.data[0].Items[0].value
        ).toEqual({ id: "123" });
        expect(
          mockCreateDocument.mock.calls[0][0].config.data[0].Items[1].value
        ).toEqual({ id: "345" });
        expect(
          mockCreateDocument.mock.calls[0][0].config.data[0].Items[2].value
        ).toEqual({ id: "new.123" });

        // Successful config save
        await mockSaveConfig.resolve();

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

        // form.values should be same as after change
        expect(editorContext.form.values.data[0].Items[0].value.id).toBe("123");
        expect(editorContext.form.values.data[0].Items[1].value.id).toBe("345");
        expect(editorContext.form.values.data[0].Items[2]).toBeUndefined();

        // Let's wait for next invalidation
        await advanceTimer(INVALIDATION_TIME);

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(2);
        expect(mockRemove.function).toHaveBeenCalledTimes(0);

        // now config AFTER change is called
        expect(
          mockUpdateDocument.mock.calls[0][0].config!.data[0].Items[0].value
        ).toEqual({ id: "123" });
        expect(
          mockUpdateDocument.mock.calls[0][0].config!.data[0].Items[1].value
        ).toEqual({ id: "345" });
        expect(
          mockUpdateDocument.mock.calls[0][0].config!.data[0].Items[2]
        ).toBeUndefined();

        // Successful config save
        await mockSaveConfig.resolve();

        expect(mockRemove.function).toHaveBeenCalledTimes(1);
        expect(mockRemove.function).toHaveBeenNthCalledWith(1, ["new.123"]);

        await mockRemove.resolve();

        function testLastState() {
          expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
          expect(mockSaveConfig.function).toHaveBeenCalledTimes(2);

          expect(editorContext.form.values.data[0].Items[0].value.id).toBe(
            "123"
          );
          expect(editorContext.form.values.data[0].Items[1].value.id).toBe(
            "345"
          );
          expect(editorContext.form.values.data[0].Items[2]).toBeUndefined();

          // unnecessary operations were not called
          expect(mockInactiveOperation.function).toHaveBeenCalledTimes(0);
          expect(mockRemove.function).toHaveBeenCalledTimes(1);
        }

        testLastState();
        await advanceTimer(INVALIDATION_TIME);
        testLastState();
        await advanceTimer(INVALIDATION_TIME);
        testLastState();
      });

      test.skip("and then changing it while it is being added", async () => {
        // Edit item
        const UPDATED_TEXT = "Lorem ipsum dolor sit amet";
        editorContext.form.values.Items[2].value.value = UPDATED_TEXT;

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);

        await mockActiveOperation.resolve({
          [thirdItemAfterModification.value.id]: {
            id: "new.123",
            value: "Lorem ipsum",
          },
        });

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

        // Before save is done, we have old form.values
        expect(editorContext.form.values.Items[0].value.id).toBe("123");
        expect(editorContext.form.values.Items[1].value.id).toBe("345");
        expect(editorContext.form.values.Items[2].value.id).toBe(
          thirdItemAfterModification.value.id
        );

        // we save config before change
        expect(
          mockCreateDocument.mock.calls[0][0].config.Items[0].value
        ).toEqual({ id: "123" });
        expect(
          mockCreateDocument.mock.calls[0][0].config.Items[1].value
        ).toEqual({ id: "345" });
        expect(
          mockCreateDocument.mock.calls[0][0].config.Items[2].value
        ).toEqual({ id: "new.123" });

        // Successful config save
        await mockSaveConfig.resolve();

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(1);
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

        expect(editorContext.form.values.Items[0].value.id).toBe("123");
        expect(editorContext.form.values.Items[1].value.id).toBe("345");
        expect(editorContext.form.values.Items[2].value.id).toBe("new.123");

        // unnecessary operations were not called
        expect(mockInactiveOperation.function).toHaveBeenCalledTimes(0);
        expect(mockRemove.function).toHaveBeenCalledTimes(0);

        // Let's wait for next invalidation
        await advanceTimer(INVALIDATION_TIME);

        // save was not called until update is called
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

        if (update) {
          expect(mockUpdate.function).toHaveBeenCalledTimes(2);
          expect(mockUpdate.function).toHaveBeenNthCalledWith(
            2,
            [{ id: "new.123", value: UPDATED_TEXT }],
            {
              locale: "en",
            }
          );
        } else {
          expect(mockUpdate.function).toHaveBeenCalledTimes(1);
          expect(mockCreate.function).toHaveBeenCalledTimes(1);
          expect(mockUpdate.function).toHaveBeenNthCalledWith(
            1,
            [{ id: "new.123", value: UPDATED_TEXT }],
            {
              locale: "en",
            }
          );
        }

        await mockUpdate.resolve({
          "new.123": { id: "new.123", value: UPDATED_TEXT },
        });

        expect(mockSaveConfig.function).toHaveBeenCalledTimes(2);

        // now config AFTER change is called
        expect(
          mockSaveConfig.function.mock.calls[1][0].en.config!.Items[0].value
        ).toEqual({ id: "123" });
        expect(
          mockSaveConfig.function.mock.calls[1][0].en.config!.Items[1].value
        ).toEqual({ id: "345" });
        expect(
          mockSaveConfig.function.mock.calls[1][0].en.config!.Items[2].value
        ).toEqual({ id: "new.123" });

        // Successful config save
        await mockSaveConfig.resolve();

        function testLastState() {
          if (update) {
            expect(mockUpdate.function).toHaveBeenCalledTimes(2);
            expect(mockCreate.function).toHaveBeenCalledTimes(0);
          } else {
            expect(mockUpdate.function).toHaveBeenCalledTimes(1);
            expect(mockCreate.function).toHaveBeenCalledTimes(1);
          }

          expect(editorContext.form.values.Items[0].value.id).toBe("123");
          expect(editorContext.form.values.Items[1].value.id).toBe("345");
          expect(editorContext.form.values.Items[2].value).toEqual({
            id: "new.123",
            value: UPDATED_TEXT,
          });

          // unnecessary operations were not called
          expect(mockRemove.function).toHaveBeenCalledTimes(0);
        }

        testLastState();
        await advanceTimer(INVALIDATION_TIME);
        testLastState();
        await advanceTimer(INVALIDATION_TIME);
        testLastState();
      });

      test("with unsuccessful create / update operation -> nothing happens, retry later", async () => {
        await mockActiveOperation.reject();

        expect(mockSaveConfig.function).toHaveBeenCalledTimes(0); // save not run in that case!!!
        expect(editorContext.form.values.data[0].Items[2]).toEqual(
          thirdItemAfterModification
        );

        // force next tick, retry
        await advanceTimer(INVALIDATION_TIME);

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(2);
        expect(mockActiveOperation.function).toHaveBeenNthCalledWith(
          2,
          [thirdItemAfterModification.value],
          {
            locale: "en",
          }
        );

        // now successful
        await mockActiveOperation.resolve({
          [thirdItemAfterModification.value.id]: {
            id: "new.123",
            value: "Lorem ipsum",
          },
        });
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1); // save
      });

      test("with successful create / update operation but with incorrect result -> save is not happening", async () => {
        // Result ID can't start with "local."
        await mockActiveOperation.resolve({
          [thirdItemAfterModification.value.id]: {
            id: "local.123",
            value: "Lorem ipsum",
          },
        });
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(0); // save not run in that case!!!
        expect(editorContext.form.values.data[0].Items[2]).toEqual(
          thirdItemAfterModification
        );

        // force next tick, retry
        await advanceTimer(INVALIDATION_TIME);

        // Result ID not present in output object
        await mockActiveOperation.resolve({});
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(0); // save not run in that case!!!
        expect(editorContext.form.values.data[0].Items[2]).toEqual(
          thirdItemAfterModification
        );

        // force next tick, retry
        await advanceTimer(INVALIDATION_TIME);

        // Result is not even object
        await mockActiveOperation.resolve("pies");
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(0); // save not run in that case!!!
        expect(editorContext.form.values.data[0].Items[2]).toEqual(
          thirdItemAfterModification
        );
      });

      // This test is skipped on purpose because it's an edge case that is not handled by the current implementation
      // and it's not important until we enable usage of text CRUD operations.
      test.skip("with successful create / update operation but unsuccessful save, with retry", async () => {
        await mockActiveOperation.resolve({
          [thirdItemAfterModification.value.id]: {
            id: "new.123",
            value: "Lorem ipsum",
          },
        });

        expect(mockSaveConfig.function).toHaveBeenCalledTimes(1); // save not run in that case!!!

        await mockSaveConfig.reject(); // SAVE CONFIG ERROR

        // form values are not updated regardless the fact that save / update was successful
        expect(editorContext.form.values.data[0].Items[0].value.id).toBe("123");
        expect(editorContext.form.values.data[0].Items[1].value.id).toBe("345");
        expect(editorContext.form.values.data[0].Items[2]).toEqual(
          thirdItemAfterModification
        );

        // force next tick, retry
        await advanceTimer(INVALIDATION_TIME);

        expect(mockActiveOperation.function).toHaveBeenCalledTimes(2);
        expect(mockActiveOperation.function).toHaveBeenNthCalledWith(
          2,
          [thirdItemAfterModification.value],
          {
            locale: "en",
          }
        );

        await mockActiveOperation.resolve({
          [thirdItemAfterModification.value.id]: {
            id: "new.777",
            value: "Lorem ipsum",
          },
        });
        expect(mockSaveConfig.function).toHaveBeenCalledTimes(2); // save not run in that case!!!

        expect(
          mockUpdateDocument.mock.calls[0][0].config!.data[0].Items[2].value
        ).toEqual({ id: "new.777" });

        await mockSaveConfig.resolve(); // NOW SUCCESS

        expect(mockInactiveOperation.function).toHaveBeenCalledTimes(0);
        expect(mockRemove.function).toHaveBeenCalledTimes(0);

        expect(editorContext.form.values.data[0].Items[0].value.id).toBe("123");
        expect(editorContext.form.values.data[0].Items[1].value.id).toBe("345");
        expect(editorContext.form.values.data[0].Items[2].value.id).toBe(
          "new.777"
        );
      });
    });
  }

  runTestsForAddOrModify(
    "Adding new text",
    undefined,
    {
      _template: "@easyblocks/text",
      value: {
        id: "local.123",
        value: "Lorem ipsum",
      },
    },
    false
  );

  runTestsForAddOrModify(
    "Modifying existing text",
    {
      _template: "@easyblocks/text",
      value: {
        id: "new.123",
        value: "Blablabla",
      },
    },
    {
      _template: "@easyblocks/text",
      value: {
        id: "new.123",
        value: "Lorem ipsum",
      },
    },
    true
  );

  describe("mode without text CRUD", () => {
    const text1 = {
      _template: "@easyblocks/text",
      value: {
        id: "local.123",
        value: { en: "Lorem ipsum" },
      },
    };

    const text2 = {
      _template: "@easyblocks/text",
      value: {
        id: "local.345",
        value: { en: "Dolor sit amet" },
      },
    };

    const text3 = {
      _template: "@easyblocks/text",
      value: {
        id: "local.xxx",
        value: { en: "Blabla" },
      },
    };

    test("local texts stay local", async () => {
      const mockCreateDocument = mock<
        IApiClient["documents"]["createDocument"]
      >(async () => createTestDocument());
      testApiClient.documents.createDocument = mockCreateDocument;

      const { mockSaveConfig, editorContext } = createEditorContext(
        {
          _template: "$RootSections",
          data: [
            {
              _template: "$stack",
              Items: [text1, text2],
            },
          ],
        },
        true
      );

      renderUseDataSaverHook({
        editorContext,
        initialDocument: null,
      });

      await advanceTimer(INVALIDATION_TIME / 2);

      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);

      await advanceTimer(INVALIDATION_TIME / 2 + 1000);

      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);

      await advanceTimer(INVALIDATION_TIME);

      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);

      const UPDATED_TEXT = { en: "Lorem ipsum dolor sit amet" };
      editorContext.form.values.data[0].Items[0].value.value = UPDATED_TEXT;
      editorContext.form.values.data[0].Items.push(text3);

      await advanceTimer(INVALIDATION_TIME);

      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

      const savedItems =
        mockCreateDocument.mock.calls[0][0].config.data[0].Items;
      const externals = mockSaveConfig.function.mock.calls[0][1];

      expect(savedItems[0].value).toEqual({
        __localized: true,
        ...text1.value,
        value: UPDATED_TEXT,
      });
      expect(savedItems[1].value).toEqual({
        __localized: true,
        ...text2.value,
      });
      expect(savedItems[2].value).toEqual({
        __localized: true,
        ...text3.value,
      });
      expect(externals).toEqual([]);

      await mockSaveConfig.resolve();

      await advanceTimer(INVALIDATION_TIME);
      await advanceTimer(INVALIDATION_TIME);
      await advanceTimer(INVALIDATION_TIME);

      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
    });
  });

  describe("Saving to remote storage", () => {
    const localTextItems = [
      {
        _template: "@easyblocks/text",
        value: {
          id: "local.123",
          value: {
            pl: "pies",
            en: "dog",
          },
        },
      },
      {
        _template: "@easyblocks/text",
        value: {
          id: "local.345",
          value: {
            pl: "kot",
            en: "cat",
          },
        },
      },
    ];

    it("After successful save should call editorContext.save with saved document data", async () => {
      const testDocument = createTestDocument();
      const mockCreateDocument = mock<
        IApiClient["documents"]["createDocument"]
      >(async () => testDocument);
      testApiClient.documents.createDocument = mockCreateDocument;

      const { mockSaveConfig, editorContext } = createEditorContext(
        {
          _template: "$RootSections",
          data: [
            {
              _template: "$stack",
              Items: [...localTextItems],
            },
          ],
        },
        true
      );

      renderUseDataSaverHook({
        editorContext,
        initialDocument: null,
      });

      // Introduce some change to the config
      editorContext.form.values.data[0].Items.pop();

      await advanceTimer(INVALIDATION_TIME * 2);

      expect(mockCreateDocument).toHaveBeenCalledTimes(1);
      expect(mockCreateDocument).toHaveBeenCalledWith<
        Parameters<typeof mockCreateDocument>
      >({
        projectId: "test-project",
        source: "nocms",
        title: "Untitled",
        config: addLocalizedFlag(editorContext.form.values, editorContext),
        rootContainer: "content",
      });

      await mockSaveConfig.resolve();

      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);

      const enSaved = mockSaveConfig.function.mock.calls[0][0].en;
      const plSaved = mockSaveConfig.function.mock.calls[0][0].pl;

      expect(enSaved).toMatchObject<Document>({
        documentId: testDocument.id,
        preview: {
          mode: "content",
          sectionsCount: 1,
        },
        projectId: testDocument.project_id,
        rootContainer: "content",
      });

      expect(doesConfigHasKey(enSaved, "pl")).toBe(false);
      expect(doesConfigHasKey(enSaved, "en")).toBe(true);

      expect(plSaved).toMatchObject<Document>({
        documentId: testDocument.id,
        preview: {
          mode: "content",
          sectionsCount: 1,
        },
        projectId: testDocument.project_id,
        rootContainer: "content",
      });

      expect(doesConfigHasKey(plSaved, "pl")).toBe(true);
      expect(doesConfigHasKey(plSaved, "en")).toBe(false);
    });

    it("fetches latest document from API, silently updates local config and skips save if local version is outdated and there is no local changes", async () => {
      const testDocument = createTestDocumentWithResolvedConfig();

      const { mockSaveConfig, editorContext, initialConfig } =
        createEditorContext(testDocument.config.config, true);

      testDocument.config.config = initialConfig;

      renderUseDataSaverHook({
        editorContext,
        initialDocument: testDocument,
      });

      const newVersion = testDocument.version + 1;

      testApiClient.documents.getDocumentById = jest
        .fn()
        // Pretend that there is a newer version of the document on the server
        .mockResolvedValueOnce({ version: newVersion })
        // Return updated document from the server
        .mockResolvedValueOnce(
          createTestDocumentWithResolvedConfig({
            version: newVersion,
            config: {
              config: {
                _template: "$RootSections",
                data: [
                  {
                    _template: "$stack",
                    Items: [],
                  },
                ],
              },
            },
          })
        );

      editorContext.actions.notify = jest.fn();

      await advanceTimer(INVALIDATION_TIME);

      expect(testApiClient.documents.getDocumentById).toHaveBeenCalledTimes(2);
      expect(editorContext.form.values).toEqual({
        _template: "$RootSections",
        data: [
          {
            _template: "$stack",
            Items: [],
          },
        ],
      });
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);
      expect(editorContext.actions.notify).toHaveBeenCalledTimes(0);
    });

    it("creates new document if initial document's unique source identifier is different than the one given in params", async () => {
      const testDocument = createTestDocumentWithResolvedConfig({
        unique_source_identifier: "test-unique-source-identifier-1",
        config: {
          config: {
            _template: "$RootSections",
            data: [
              {
                _template: "$stack",
                Items: [...textItems],
              },
            ],
          },
        },
      });

      const createDocumentMock = mock<
        IApiClient["documents"]["createDocument"]
      >(async () => ({
        ...testDocument,
        version: testDocument.version + 1,
      }));

      const { editorContext, mockSaveConfig } = createEditorContext(
        testDocument.config.config,
        true
      );

      renderUseDataSaverHook({
        editorContext,
        initialDocument: testDocument,
        uniqueSourceIdentifier: "test-unique-source-identifier-2",
      });

      testApiClient.documents.createDocument = createDocumentMock;

      editorContext.form.values.data[0].Items.pop();
      await advanceTimer(INVALIDATION_TIME);

      expect(createDocumentMock).toHaveBeenCalledTimes(1);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
    });

    it("updates document again with latest version if updating document was unsuccessful because of version mismatch", async () => {
      const mockGetDocumentById = jest.fn();
      testApiClient.documents.getDocumentById = mockGetDocumentById;

      const mockUpdateDocument = jest.fn();
      testApiClient.documents.updateDocument = mockUpdateDocument;

      const { mockSaveConfig, editorContext, initialConfig } =
        createEditorContext(
          {
            _template: "$RootSections",
            data: [
              {
                _template: "$stack",
                Items: [...textItems],
              },
            ],
          },
          true
        );

      const notifyMock = jest.fn();
      editorContext.actions.notify = notifyMock;

      const testDocument = createTestDocumentWithResolvedConfig({
        config: {
          config: deepClone(initialConfig),
        },
        unique_source_identifier: "test-unique-source-identifier",
      });

      renderUseDataSaverHook({
        editorContext,
        initialDocument: testDocument,
        uniqueSourceIdentifier: testDocument.unique_source_identifier!,
      });

      editorContext.form.values.data[0].Items.pop();

      mockGetDocumentById
        .mockResolvedValueOnce({
          version: 0,
        })
        .mockResolvedValueOnce(
          createTestDocumentWithResolvedConfig({
            ...testDocument,
            config: {
              config: addLocalizedFlag(
                editorContext.form.values,
                editorContext
              ),
            },
            version: 1,
          })
        );

      mockUpdateDocument.mockRejectedValueOnce(
        new Error("Document version mismatch")
      );

      await advanceTimer(INVALIDATION_TIME);

      expect(mockGetDocumentById).toHaveBeenCalledTimes(2);
      expect(mockGetDocumentById).toHaveBeenNthCalledWith(1, {
        documentId: testDocument.id,
        projectId: editorContext.project!.id,
        format: "versionOnly",
      });
      expect(mockUpdateDocument).toHaveBeenCalledTimes(1);
      expect(mockGetDocumentById).toHaveBeenNthCalledWith(2, {
        documentId: testDocument.id,
        projectId: editorContext.project!.id,
      });
      expect(mockUpdateDocument).toHaveBeenNthCalledWith<
        Parameters<typeof mockUpdateDocument>
      >(1, {
        documentId: testDocument.id,
        config: expect.any(Object),
        projectId: editorContext.project!.id,
        version: 0,
        uniqueSourceIdentifier: testDocument.unique_source_identifier!,
      });
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenNthCalledWith(
        1,
        "Remote changes detected, local changes have been overwritten."
      );

      editorContext.form.values.data[0].Items.pop();

      mockGetDocumentById.mockResolvedValue({
        version: 1,
      });

      mockUpdateDocument.mockResolvedValue({
        version: 2,
      });

      await advanceTimer(INVALIDATION_TIME * 2);

      expect(mockGetDocumentById).toHaveBeenCalledTimes(3);
      expect(mockUpdateDocument).toHaveBeenCalledTimes(2);
      expect(mockUpdateDocument).toHaveBeenNthCalledWith<
        Parameters<typeof mockUpdateDocument>
      >(2, {
        documentId: testDocument.id,
        config: expect.any(Object),
        projectId: editorContext.project!.id,
        version: 1,
        uniqueSourceIdentifier: testDocument.unique_source_identifier!,
      });
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
    });

    it("updates document instead of creating if creating document was unsuccessful because of non unique source identifier", async () => {
      const mockCreateDocument = mock<
        IApiClient["documents"]["createDocument"]
      >(async ({ uniqueSourceIdentifier }) => {
        throw new Error(
          `Document with unique_source_identifier "${uniqueSourceIdentifier}" already exists.`
        );
      });
      testApiClient.documents.createDocument = mockCreateDocument;

      const mockGetDocumentByUniqueSourceIdentifier = jest
        .fn()
        .mockResolvedValueOnce(
          createTestDocumentWithResolvedConfig({
            config: {
              config: {
                _template: "$RootSections",
                data: [
                  {
                    _template: "$stack",
                    Items: textItems.slice(0, 1),
                  },
                ],
              },
            },
            id: "test-new-document-id",
            version: 1,
          })
        );

      testApiClient.documents.getDocumentByUniqueSourceIdentifier =
        mockGetDocumentByUniqueSourceIdentifier;

      const mockGetDocumentById = jest.fn().mockResolvedValueOnce({
        version: 2,
      });
      testApiClient.documents.getDocumentById = mockGetDocumentById;

      const mockUpdateDocument = mock<
        IApiClient["documents"]["updateDocument"]
      >(async ({ config, version }) =>
        createTestDocumentWithResolvedConfig({
          config: {
            config,
          },
          version: assertDefined(version) + 1,
        })
      );
      testApiClient.documents.updateDocument = mockUpdateDocument;

      const { mockSaveConfig, editorContext } = createEditorContext(
        {
          _template: "$RootSections",
          data: [
            {
              _template: "$stack",
              Items: [...textItems],
            },
          ],
        },
        true
      );

      const notifyMock = jest.fn();
      editorContext.actions.notify = notifyMock;

      renderUseDataSaverHook({
        editorContext,
        initialDocument: null,
        uniqueSourceIdentifier: "test-unique-source-identifier",
      });

      editorContext.form.values.data[0].Items.pop();

      await advanceTimer(INVALIDATION_TIME);

      expect(mockCreateDocument).toHaveBeenCalledTimes(1);
      expect(mockCreateDocument).toHaveBeenNthCalledWith<
        Parameters<typeof mockCreateDocument>
      >(1, {
        config: expect.any(Object),
        projectId: "test-project",
        source: "nocms",
        title: "Untitled",
        uniqueSourceIdentifier: "test-unique-source-identifier",
        rootContainer: "content",
      });
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(0);
      expect(mockGetDocumentByUniqueSourceIdentifier).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenCalledTimes(1);
      expect(notifyMock).toHaveBeenNthCalledWith(
        1,
        "Remote changes detected, local changes have been overwritten."
      );

      editorContext.form.values.data[0].Items.pop();
      await advanceTimer(INVALIDATION_TIME * 2);

      expect(mockGetDocumentById).toHaveBeenCalledTimes(1);
      expect(mockCreateDocument).toHaveBeenCalledTimes(1);
      expect(mockUpdateDocument).toHaveBeenCalledTimes(1);
      expect(mockUpdateDocument).toHaveBeenNthCalledWith<
        Parameters<typeof mockUpdateDocument>
      >(1, {
        documentId: "test-new-document-id",
        config: expect.any(Object),
        projectId: "test-project",
        version: 1,
        uniqueSourceIdentifier: "test-unique-source-identifier",
      });
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
      expect(mockGetDocumentByUniqueSourceIdentifier).toHaveBeenCalledTimes(1);
    });

    it("should not interact with API when running in playground", async () => {
      const { mockSaveConfig, editorContext } = createEditorContext({
        _template: "$RootSections",
        data: [
          {
            _template: "$stack",
            Items: [...textItems],
          },
        ],
      });

      editorContext.isPlayground = true;

      renderUseDataSaverHook({
        editorContext,
        initialDocument: null,
      });

      editorContext.form.values.data[0].Items.pop();

      await advanceTimer(INVALIDATION_TIME);

      expect(testApiClient.documents.getDocumentById).toHaveBeenCalledTimes(0);
      expect(testApiClient.documents.createDocument).toHaveBeenCalledTimes(0);
      expect(mockSaveConfig.function).toHaveBeenCalledTimes(1);
      await mockSaveConfig.resolve();

      editorContext.form.values.data[0].Items.pop();
      await advanceTimer(INVALIDATION_TIME * 2);

      expect(testApiClient.documents.getDocumentById).toHaveBeenCalledTimes(0);
      expect(testApiClient.documents.createDocument).toHaveBeenCalledTimes(0);
      expect(testApiClient.documents.updateDocument).toHaveBeenCalledTimes(0);
      // TODO: Can't make it work...
      // expect(mockSaveConfig.function).toHaveBeenCalledTimes(2);
    });
  });
});

function doesConfigHasKey(config: any, searchedKey: string) {
  if (typeof config === "object" && config !== null) {
    for (const key in config) {
      if (key === searchedKey) {
        return true;
      }
      if (doesConfigHasKey(config[key], searchedKey)) {
        return true;
      }
    }
  }
  if (Array.isArray(config)) {
    for (let i = 0; i < config.length; i++) {
      if (doesConfigHasKey(config[i], searchedKey) === true) {
        return true;
      }
    }
  }

  return false;
}
