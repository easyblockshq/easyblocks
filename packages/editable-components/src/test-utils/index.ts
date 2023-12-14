import { CompilationContextType } from "@easyblocks/core/_internals";
import { Devices } from "@easyblocks/core";
import { builtinEditableComponentsDefinitions } from "../schemas";

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

export const testCompilationContext: CompilationContextType = {
  definitions: {
    components: [...builtinEditableComponentsDefinitions],
    links: [],
    actions: [],
    textModifiers: [],
  },
  devices: testDevices,
  types: {},
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
  },
  mainBreakpointIndex: "b4",
};
