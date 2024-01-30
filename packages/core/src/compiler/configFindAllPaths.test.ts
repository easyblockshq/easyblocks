import { testCompilationContext } from "../testUtils";
import { NoCodeComponentEntry } from "../types";
import { configFindAllPaths } from "./configFindAllPaths";
import { CompilationContextType } from "./types";

const compilationContext: CompilationContextType = {
  ...testCompilationContext,
  definitions: {
    components: [
      {
        id: "$TestComponent1",
        schema: [
          {
            type: "component",
            prop: "Component",
            accepts: ["$TestComponent2"],
          },
          {
            type: "component-collection",
            prop: "Components",
            accepts: ["$TestComponent2"],
          },
        ],
        tags: [],
      },
      {
        id: "$TestComponent2",
        schema: [],
        tags: [],
      },
    ],
    actions: [],
    links: [],
    textModifiers: [],
  },
};

const testConfig: NoCodeComponentEntry = {
  _id: "",
  _component: "$TestComponent1",
  Component: [
    {
      _component: "$TestComponent2",
    },
  ],
  Components: [
    {
      _component: "$TestComponent2",
    },
    {
      _component: "$TestComponent2",
    },
    {
      _component: "$TestComponent2",
    },
  ],
};

test("finds all paths for $TestComponent2", () => {
  expect(
    configFindAllPaths(
      testConfig,
      compilationContext,
      (config): config is NoCodeComponentEntry => {
        return config._component === "$TestComponent2";
      }
    )
  ).toEqual(["Component.0", "Components.0", "Components.1", "Components.2"]);
});
