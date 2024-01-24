import { Devices } from "@easyblocks/core";
import {
  CompilationCache,
  createTestCompilationContext,
} from "@easyblocks/core/_internals";
import { EditorContextType } from "../../EditorContext";
import { Form } from "../../form";

export const testDevices: Devices = [
  {
    id: "b1",
    w: 100,
    h: 100,
    breakpoint: 150,
  },
  {
    id: "b2",
    w: 200,
    h: 200,
    breakpoint: 250,
  },
  {
    id: "b3",
    w: 300,
    h: 300,
    breakpoint: 350,
  },
  {
    id: "b4",
    w: 400,
    h: 400,
    breakpoint: 450,
  },
  {
    id: "b5",
    w: 500,
    h: 500,
    breakpoint: null,
  },
];

const testCompilationContext = createTestCompilationContext();

export const testEditorContext: EditorContextType = {
  ...testCompilationContext,
  syncTemplates: () => {},
  isAdminMode: false,
  breakpointIndex: "b1",
  setBreakpointIndex: (b) => null,
  devices: testDevices,
  templates: [],
  contextParams: {
    locale: "en",
  },
  theme: {
    colors: {},
    fonts: {},
    space: {},
    numberOfItemsInRow: {},
    aspectRatios: {},
    icons: {},
    containerWidths: {},
    boxShadows: {},
  },
  mainBreakpointIndex: "b4",
  focussedField: [],
  setFocussedField: () => {},
  form: new Form({} as any),
  actions: {
    openTemplateModal: () => {},
    notify: () => {},
    openComponentPicker: () => {
      return new Promise(() => {});
    },
    insertItem: () => {},
    runChange: () => {},
    duplicateItems: () => {},
    moveItems: () => {},
    removeItems: () => {},
    replaceItems: () => {},
    pasteItems: () => {},
    logSelectedItems: () => {},
  },
  save: async () => {},
  locales: [
    {
      code: "en",
      isDefault: true,
    },
    {
      code: "pl",
      fallback: "en",
    },
  ],
  compilationCache: new CompilationCache(),
};

/**
 * Wrapper for `jest.fn` function, but with types which automatically infer parameters type and return type.
 * This is more handy for cases where the mocked function has its dedicated type.
 */
export function mock<Implementation extends (...args: any) => any>(
  implementation: Implementation
): jest.Mock<ReturnType<Implementation>, Parameters<Implementation>> {
  return jest.fn<ReturnType<Implementation>, Parameters<Implementation>>(
    implementation
  );
}
