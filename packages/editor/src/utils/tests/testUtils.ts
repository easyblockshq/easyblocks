import { Form } from "@easyblocks/app-utils";
import { Devices, ExternalFieldCustom } from "@easyblocks/core";
import { CompilationCache } from "@easyblocks/core/_internals";
import { schemas } from "@easyblocks/editable-components";
import { EditorContextType } from "../../EditorContext";

const getImageFromId = (id: string) => ({
  alt: id,
  url: id,
  aspectRatio: 1,
  srcset: [
    {
      w: 100,
      h: 100,
      url: id,
    },
  ],
  mimeType: "image/jpeg",
});

export const testEmptyWidget: ExternalFieldCustom = {
  type: "custom",
  component: () => {},
};

export const testTypes: EditorContextType["types"] = {
  image: {
    defaultFetch: async (resources) => {
      return resources.map((resource) => {
        return {
          ...resource,
          value: getImageFromId(resource.id),
        };
      });
    },
    widget: testEmptyWidget,
  },
  video: {
    defaultFetch: async (resources) => {
      return resources.map((resource) => {
        return {
          ...resource,
          value: {
            alt: resource.id,
            url: resource.id,
            aspectRatio: 1,
          },
        };
      });
    },
    widget: testEmptyWidget,
  },
  product: {
    fetch: async (resources) => {
      return resources.map((resource) => {
        return {
          ...resource,
          value: { id: resource.id, sku: resource.id },
        };
      });
    },
    widget: testEmptyWidget,
  },
};

export const testImage: EditorContextType["image"] = {
  resourceType: "image",
  params: {
    mimetypeGroups: ["image"],
  },
  transform: (x) => x,
};

export const testVideo: EditorContextType["video"] = {
  resourceType: "video",
  params: {
    mimetypeGroups: ["video"],
  },
  transform: (x) => x,
};

export const testText: EditorContextType["text"] = {
  fetch: async (resources) => {
    return resources.map((resource) => {
      if (resource.id === "incorrect") {
        return {
          ...resource,
          value: undefined,
          error: new Error("Incorrect text!"),
        };
      }

      return {
        ...resource,
        value: { en: `!${resource.id}` },
      };
    });
  },
  create: async () => {
    return {};
  },
  update: async () => {
    return {};
  },
  remove: async () => {
    return;
  },
};

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

export const testEditorContext: EditorContextType = {
  syncTemplates: () => {},
  isAdminMode: false,
  definitions: {
    components: [...schemas],
    links: [],
    actions: [],
    textModifiers: [],
  },
  breakpointIndex: "b1",
  setBreakpointIndex: (b) => null,
  devices: testDevices,
  types: testTypes,
  image: testImage,
  video: testVideo,
  text: testText,
  templates: {},
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
    getTemplates: () => [],
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
  resources: [],
  compilationCache: new CompilationCache(),
  imageVariants: [],
  imageVariantsDisplay: [],
  videoVariants: [],
  videoVariantsDisplay: [],
  rootContainer: "content",
  rootContainers: [],
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
