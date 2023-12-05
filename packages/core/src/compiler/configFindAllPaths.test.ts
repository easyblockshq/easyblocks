import { CompilationContextType } from "../types";
import { testCompilationContext } from "../test-utils";
import { configFindAllPaths } from "./configFindAllPaths";
import { ConfigComponent } from "@easyblocks/core";

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

const testConfig: ConfigComponent = {
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
      (config): config is { _template: "$TestComponent2" } => {
        return config._template === "$TestComponent2";
      }
    )
  ).toEqual(["Component.0", "Components.0", "Components.1", "Components.2"]);
});
