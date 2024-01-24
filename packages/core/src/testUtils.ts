import { dotNotationSet } from "@easyblocks/utils";
import { EasyblocksBackend } from "./EasyblocksBackend";
import { createCompilationContext } from "./compiler/createCompilationContext";
import { Devices } from "./types";

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

function createFormMock(initialValues: Record<PropertyKey, any> = {}) {
  return {
    reset() {
      this.values = initialValues;
    },
    values: initialValues,
    change(path: string, value: any) {
      if (path === "") {
        this.values = value;
        return;
      }

      dotNotationSet(this.values, path, value);
    },
  };
}

function createTestCompilationContext() {
  return createCompilationContext(
    {
      backend: new EasyblocksBackend({ accessToken: "" }),
      locales: [{ code: "en", isDefault: true }],
      components: [{ id: "TestComponent", schema: [] }],
    },
    { locale: "en" },
    "TestComponent"
  );
}

export { createFormMock, createTestCompilationContext };
