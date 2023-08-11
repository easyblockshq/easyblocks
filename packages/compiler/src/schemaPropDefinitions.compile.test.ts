import {
  CompilationContextType,
  InternalActionComponentDefinition,
  InternalRenderableComponentDefinition,
} from "@easyblocks/app-utils";
import {
  CompiledComponentConfig,
  ConfigComponent,
  Devices,
} from "@easyblocks/core";
import { SetRequired } from "type-fest";
import { CompilationCache } from "./CompilationCache";
import { compileInternal } from "./compileInternal";

type TestComponentConfig = SetRequired<ConfigComponent, "_id">;

test("populates cache for given component if cache is empty", () => {
  const testComponentDefinition: InternalRenderableComponentDefinition = {
    id: "$TestComponent",
    schema: [
      {
        prop: "prop1",
        type: "string",
      },
    ],
    tags: [],
  };

  const testCompilationContext = createTestCompilationContext({
    components: [testComponentDefinition],
  });

  const cache = new CompilationCache();

  const result = compileInternal(
    {
      _template: "$TestComponent",
      _id: "xxx",
      prop1: "Test",
    },
    testCompilationContext,
    cache
  );

  expect(cache.count).toBe(1);
  expect(cache.get("xxx")).toEqual<ReturnType<CompilationCache["get"]>>({
    values: {
      _template: "$TestComponent",
      _id: "xxx",
      prop1: "Test",
    },
    compiledConfig: result.compiled,
    compiledValues: {
      _template: "$TestComponent",
      _id: "xxx",
      prop1: "Test",
    },
    valuesAfterAuto: {
      _template: "$TestComponent",
      _id: "xxx",
      prop1: "Test",
    },
    contextProps: {},
  });
});

test("reuses cache if it contains cached result for given component", () => {
  const testComponentDefinition: InternalRenderableComponentDefinition = {
    id: "$TestComponent",
    schema: [
      {
        prop: "prop1",
        type: "string",
      },
    ],
    tags: [],
  };

  const testCompilationContext = createTestCompilationContext({
    components: [testComponentDefinition],
  });

  const testConfig: TestComponentConfig = {
    _template: "$TestComponent",
    _id: "xxx",
    prop1: "Test",
  };

  const cache = new CompilationCache([
    [
      "xxx",
      {
        values: {
          _id: testConfig._id,
          prop1: "Test",
          _itemProps: {},
        },
        contextProps: {},
        compiledConfig: {
          _id: testConfig._id,
          _template: testConfig._template,
          actions: {},
          components: {},
          props: {},
          styled: {},
          textModifiers: {},
        },
        compiledValues: {
          _id: testConfig._id,
          _template: testConfig._template,
          prop1: "Test",
        },
        valuesAfterAuto: {
          _id: testConfig._id,
          _template: testConfig._template,
          prop1: "Test",
        },
      },
    ],
  ]);

  const result = compileInternal(testConfig, testCompilationContext, cache);

  expect(cache.count).toBe(1);
  expect(result.compiled).toBe<CompiledComponentConfig>(
    cache.get("xxx")!.compiledConfig
  );
});

test("change of schema prop value of nested component triggers only recompilation of that component", () => {
  const testComponentDefinition1: InternalRenderableComponentDefinition = {
    id: "$TestComponent1",
    schema: [
      {
        prop: "prop1",
        type: "string",
      },
    ],
    tags: [],
  };

  const testComponentDefinition2: InternalRenderableComponentDefinition = {
    id: "$TestComponent2",
    schema: [
      {
        prop: "Component",
        type: "component",
        componentTypes: [testComponentDefinition1.id],
      },
    ],
    tags: [],
  };

  const testComponentDefinition3: InternalRenderableComponentDefinition = {
    id: "$TestComponent3",
    schema: [
      {
        prop: "Component",
        type: "component",
        componentTypes: [testComponentDefinition2.id],
      },
    ],
    tags: [],
  };

  const testConfig: TestComponentConfig = {
    _template: "$TestComponent3",
    _id: "xxx",
    Component: [
      {
        _template: "$TestComponent2",
        _id: "yyy",
        Component: [
          {
            _template: "$TestComponent1",
            _id: "zzz",
            prop1: "Test",
          },
        ],
      },
    ],
  };

  const testCompilationContext = createTestCompilationContext({
    components: [
      testComponentDefinition1,
      testComponentDefinition2,
      testComponentDefinition3,
    ],
  });

  const cache = new CompilationCache();

  compileInternal(testConfig, testCompilationContext, cache);

  const cacheEntryComponent3 = cache.get("xxx");
  const cacheEntryComponent2 = cache.get("yyy");
  const cacheEntryComponent1 = cache.get("zzz");

  const updatedTestConfig: TestComponentConfig = {
    ...testConfig,
    Component: [
      {
        ...testConfig.Component[0],
        Component: [
          {
            ...testConfig.Component[0].Component[0],
            prop1: "Another test",
          },
        ],
      },
    ],
  };

  const result = compileInternal(
    updatedTestConfig,
    testCompilationContext,
    cache
  );

  expect(cacheEntryComponent3).toEqual(cache.get("xxx"));
  expect(cacheEntryComponent2).toEqual(cache.get("yyy"));
  expect(cacheEntryComponent1).not.toEqual(cache.get("zzz"));
  expect(cache.get("zzz")).toEqual<ReturnType<CompilationCache["get"]>>({
    compiledConfig:
      result.compiled.components.Component[0].components.Component[0],
    valuesAfterAuto: {
      _template: "$TestComponent1",
      _id: "zzz",
      prop1: "Another test",
    },
    compiledValues: {
      _template: "$TestComponent1",
      _id: "zzz",
      prop1: "Another test",
    },
    contextProps: {},
    values: {
      _template: "$TestComponent1",
      _id: "zzz",
      prop1: "Another test",
    },
  });
});

test("change of _itemProps triggers recompilation of the component that owns them", () => {
  const testComponentDefinition1: InternalRenderableComponentDefinition = {
    id: "$TestComponent1",
    schema: [
      {
        prop: "prop1",
        type: "string",
      },
    ],
    tags: [],
  };

  const testComponentDefinition2: InternalRenderableComponentDefinition = {
    id: "$TestComponent2",
    schema: [
      {
        prop: "Components",
        type: "component-collection",
        componentTypes: [testComponentDefinition1.id],
        itemFields: [
          {
            prop: "itemProp1",
            type: "boolean",
          },
        ],
      },
    ],
    tags: [],
  };

  const testCompilationContext = createTestCompilationContext({
    components: [testComponentDefinition1, testComponentDefinition2],
  });

  const testConfig: TestComponentConfig = {
    _template: "$TestComponent2",
    _id: "xxx",
    Components: [
      {
        _template: "$TestComponent1",
        _id: "yyy",
        prop1: "Test",
        _itemProps: {
          $TestComponent2: {
            Components: {
              itemProp1: false,
            },
          },
        },
      },
    ],
  };

  const cache = new CompilationCache();

  compileInternal(testConfig, testCompilationContext, cache);

  expect(cache.count).toBe(2);
  expect(cache.get("xxx")?.values).toEqual({
    _id: "xxx",
    Components: [
      {
        _id: "yyy",
        _template: "$TestComponent1",
        itemProp1: false,
      },
    ],
    _template: "$TestComponent2",
  });

  const cacheEntryComponent1 = cache.get("yyy");

  expect(cacheEntryComponent1?.values).toEqual({
    _template: "$TestComponent1",
    _id: "yyy",
    prop1: "Test",
    index: 0,
    length: 1,
  });

  const testConfig2: TestComponentConfig = {
    _template: "$TestComponent2",
    _id: "xxx",
    Components: [
      {
        _template: "$TestComponent1",
        _id: "yyy",
        prop1: "Test",
        _itemProps: {
          $TestComponent2: {
            Components: {
              itemProp1: true,
            },
          },
        },
      },
    ],
  };

  compileInternal(testConfig2, testCompilationContext, cache);

  expect(cache.count).toBe(2);
  expect(cache.get("xxx")?.values).toEqual({
    _template: "$TestComponent2",
    _id: "xxx",
    Components: [
      {
        _id: "yyy",
        _template: "$TestComponent1",
        itemProp1: true,
      },
    ],
  });
  expect(cache.get("yyy")).toEqual(cacheEntryComponent1);
});

test("change of context props triggers recompilation of component consuming them", () => {
  const testComponentDefinition1: InternalRenderableComponentDefinition = {
    id: "$TestComponent1",
    schema: [
      {
        prop: "prop1",
        type: "boolean",
      },
    ],
    tags: [],
  };

  const testComponentDefinition2: InternalRenderableComponentDefinition = {
    id: "$TestComponent2",
    schema: [
      {
        prop: "Component",
        type: "component",
        componentTypes: [testComponentDefinition1.id],
      },
      {
        prop: "prop1",
        type: "boolean",
      },
    ],
    styles: (values: { prop1: boolean }) => {
      return {
        Component: {
          contextProp1: values.prop1,
        },
      };
    },
    tags: [],
  };

  const testCompilationContext = createTestCompilationContext({
    components: [testComponentDefinition1, testComponentDefinition2],
  });

  const testConfig: TestComponentConfig = {
    _template: "$TestComponent2",
    _id: "xxx",
    prop1: true,
    Component: [
      {
        _template: "$TestComponent1",
        _id: "yyy",
        prop1: false,
      },
    ],
  };

  const cache = new CompilationCache();

  compileInternal(testConfig, testCompilationContext, cache);

  expect(cache.count).toBe(2);
  expect(cache.get("xxx")?.values).toEqual({
    _template: "$TestComponent2",
    _id: "xxx",
    prop1: true,
    Component: [
      {
        _id: "yyy",
        _template: "$TestComponent1",
      },
    ],
  });
  expect(cache.get("yyy")?.values).toEqual({
    _template: "$TestComponent1",
    _id: "yyy",
    prop1: false,
    contextProp1: {
      $res: true,
      d1: true,
    },
  });
});

test("action is recompiled even if the owner component didn't change", () => {
  const testActionDefinition: InternalActionComponentDefinition = {
    id: "$TestAction",
    schema: [
      {
        prop: "prop1",
        type: "string",
      },
    ],
    tags: ["action"],
  };

  const testComponentDefinition: InternalRenderableComponentDefinition = {
    id: "$TestComponent",
    schema: [
      {
        prop: "prop1",
        type: "component",
        componentTypes: ["action"],
      },
    ],
    tags: [],
  };

  const testCompilationContext = createTestCompilationContext({
    actions: [testActionDefinition],
    components: [testComponentDefinition],
  });

  const cache = new CompilationCache();

  const result1 = compileInternal(
    {
      _template: "$TestComponent",
      _id: "xxx",
      prop1: [
        {
          _template: "$TestAction",
          _id: "yyy",
          prop1: "Test",
        },
      ],
    },
    testCompilationContext,
    cache
  );

  expect(cache.count).toBe(1);
  expect(result1.compiled.actions.prop1[0].props).toEqual({
    prop1: "Test",
  });

  const result2 = compileInternal(
    {
      _template: "$TestComponent",
      _id: "xxx",
      prop1: [
        {
          _template: "$TestAction",
          _id: "yyy",
          prop1: "Another test",
        },
      ],
    },
    testCompilationContext,
    cache
  );

  expect(cache.count).toBe(1);
  expect(result2.compiled.actions.prop1[0].props).toEqual({
    prop1: "Another test",
  });
});

function createTestCompilationContext({
  actions = [],
  components = [],
  devices = [
    {
      breakpoint: 1024,
      h: 768,
      id: "d1",
      w: 1024,
      isMain: true,
    },
  ],
}: {
  actions?: Array<InternalActionComponentDefinition>;
  components?: Array<InternalRenderableComponentDefinition>;
  devices?: Devices;
}): CompilationContextType {
  return {
    contextParams: {
      locale: "en",
    },
    definitions: {
      actions,
      components,
      links: [],
      textModifiers: [],
    },
    devices,
    image: {
      resourceType: "testAsset",
      transform: () => {
        throw new Error();
      },
    },
    mainBreakpointIndex: "",
    theme: {} as any,
    resourceTypes: {},
    video: {
      resourceType: "testAsset",
      transform: () => {
        throw new Error();
      },
    },
    imageVariants: [],
    rootContainer: "content",
    rootContainers: [],
    videoVariants: [],
  };
}
