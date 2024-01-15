import { testCompilationContext } from "../testUtils";
import { ComponentConfig } from "../types";
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

const testConfig: ComponentConfig = {
  _id: "",
  _template: "$TestComponent1",
  Component: [
    {
      _template: "$TestComponent2",
    },
  ],
  Components: [
    {
      _template: "$TestComponent2",
    },
    {
      _template: "$TestComponent2",
    },
    {
      _template: "$TestComponent2",
    },
  ],
};

test("finds all paths for $TestComponent2", () => {
  expect(
    configFindAllPaths(
      testConfig,
      compilationContext,
      (config): config is ComponentConfig => {
        return config._template === "$TestComponent2";
      }
    )
  ).toEqual(["Component.0", "Components.0", "Components.1", "Components.2"]);
});
