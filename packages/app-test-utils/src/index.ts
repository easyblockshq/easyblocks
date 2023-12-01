import { Devices } from "@easyblocks/core";
import { Form } from "@easyblocks/app-utils";
import { CompilationContextType } from "@easyblocks/core/_internals";

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

export const testImage: CompilationContextType["image"] = {
  resourceType: "image",
  params: {
    mimetypeGroups: ["image"],
  },
  transform: (x) => x,
};

export const testVideo: CompilationContextType["video"] = {
  resourceType: "video",
  params: {
    mimetypeGroups: ["video"],
  },
  transform: (x) => x,
};

export const testCompilationContext: CompilationContextType = {
  definitions: {
    components: [],
    links: [],
    actions: [],
    textModifiers: [],
  },
  devices: testDevices,
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
  types: {},
  rootContainers: [],
  rootContainer: "content",
};

function createForm(initialValues: Record<string, any> = {}) {
  return new Form({
    id: "",
    label: "",
    onSubmit: () => {},
    initialValues,
  });
}

export { createForm };
