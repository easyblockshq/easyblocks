import {
  CompiledComponentConfig,
  NoCodeComponentEntry,
  Devices,
} from "../types";
import { SetRequired } from "type-fest";
import { CompilationCache } from "./CompilationCache";
import { compileInternal } from "./compileInternal";
import {
  InternalRenderableComponentDefinition,
  CompilationContextType,
} from "./types";

type TestComponentConfig = SetRequired<NoCodeComponentEntry, "_id">;

test("populates cache for given component if cache is empty", () => {
  const testComponentDefinition: InternalRenderableComponentDefinition = {
    id: "$TestComponent",
    schema: [
      {
        prop: "prop1",
        type: "string",
      },
    ],
  };

  const testCompilationContext = createTestCompilationContext({
    components: [testComponentDefinition],
  });

  const cache = new CompilationCache();

  const result = compileInternal(
    {
      _component: "$TestComponent",
      _id: "xxx",
      prop1: "Test",
    },
    testCompilationContext,
    cache
  );

  expect(cache.count).toBe(1);
  expect(cache.get("xxx")).toEqual<ReturnType<CompilationCache["get"]>>({
    values: {
      values: {
        _component: "$TestComponent",
        _id: "xxx",
        prop1: "Test",
      },
      params: {
        $width: {
          $res: true,
          d1: 1024,
        },
        $widthAuto: {
          $res: true,
          d1: false,
        },
      },
    },
    compiledConfig: result.compiled,
    compiledValues: {
      _component: "$TestComponent",
      _id: "xxx",
      prop1: "Test",
    },
    valuesAfterAuto: {
      values: {
        _component: "$TestComponent",
        _id: "xxx",
        prop1: "Test",
      },
      params: {
        $width: {
          $res: true,
          d1: 1024,
        },
        $widthAuto: {
          $res: true,
          d1: false,
        },
      },
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
  };

  const testCompilationContext = createTestCompilationContext({
    components: [testComponentDefinition],
  });

  const testConfig: TestComponentConfig = {
    _component: "$TestComponent",
    _id: "xxx",
    prop1: "Test",
  };

  const cache = new CompilationCache([
    [
      "xxx",
      {
        values: {
          values: {
            _id: testConfig._id,
            _component: testConfig._component,
            prop1: "Test",
          },
          params: {
            $width: {
              $res: true,
              d1: 1024,
            },
            $widthAuto: {
              $res: true,
              d1: false,
            },
          },
        },
        contextProps: {},
        compiledConfig: {
          _id: testConfig._id,
          _component: testConfig._component,
          components: {},
          props: {},
          styled: {},
        },
        compiledValues: {
          _id: testConfig._id,
          _component: testConfig._component,
          prop1: "Test",
        },
        valuesAfterAuto: {
          values: {
            _id: testConfig._id,
            _component: testConfig._component,
            prop1: "Test",
          },
          params: {
            $width: {
              $res: true,
              d1: 1024,
            },
            $widthAuto: {
              $res: true,
              d1: false,
            },
          },
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
  };

  const testComponentDefinition2: InternalRenderableComponentDefinition = {
    id: "$TestComponent2",
    schema: [
      {
        prop: "Component",
        type: "component",
        accepts: [testComponentDefinition1.id],
      },
    ],
  };

  const testComponentDefinition3: InternalRenderableComponentDefinition = {
    id: "$TestComponent3",
    schema: [
      {
        prop: "Component",
        type: "component",
        accepts: [testComponentDefinition2.id],
      },
    ],
  };

  const testConfig: TestComponentConfig = {
    _component: "$TestComponent3",
    _id: "xxx",
    Component: [
      {
        _component: "$TestComponent2",
        _id: "yyy",
        Component: [
          {
            _component: "$TestComponent1",
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
    compiledConfig: (
      result.compiled.components.Component[0] as CompiledComponentConfig
    ).components.Component[0] as CompiledComponentConfig,
    valuesAfterAuto: {
      values: {
        _component: "$TestComponent1",
        _id: "zzz",
        prop1: "Another test",
      },
      params: {
        $width: {
          $res: true,
          d1: 1024,
        },
        $widthAuto: {
          $res: true,
          d1: false,
        },
      },
    },
    compiledValues: {
      _component: "$TestComponent1",
      _id: "zzz",
      prop1: "Another test",
    },
    contextProps: {},
    values: {
      values: {
        _component: "$TestComponent1",
        _id: "zzz",
        prop1: "Another test",
      },
      params: {
        $width: {
          $res: true,
          d1: 1024,
        },
        $widthAuto: {
          $res: true,
          d1: false,
        },
      },
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
  };

  const testComponentDefinition2: InternalRenderableComponentDefinition = {
    id: "$TestComponent2",
    schema: [
      {
        prop: "Components",
        type: "component-collection",
        accepts: [testComponentDefinition1.id],
        itemFields: [
          {
            prop: "itemProp1",
            type: "boolean",
          },
        ],
      },
    ],
  };

  const testCompilationContext = createTestCompilationContext({
    components: [testComponentDefinition1, testComponentDefinition2],
  });

  const testConfig: TestComponentConfig = {
    _component: "$TestComponent2",
    _id: "xxx",
    Components: [
      {
        _component: "$TestComponent1",
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
    params: {
      $width: {
        $res: true,
        d1: 1024,
      },
      $widthAuto: {
        $res: true,
        d1: false,
      },
    },
    values: {
      _id: "xxx",
      Components: [
        {
          _id: "yyy",
          _component: "$TestComponent1",
          itemProp1: false,
        },
      ],
      _component: "$TestComponent2",
    },
  });

  const cacheEntryComponent1 = cache.get("yyy");

  expect(cacheEntryComponent1?.values).toEqual({
    values: {
      _component: "$TestComponent1",
      _id: "yyy",
      prop1: "Test",
    },
    params: {
      $width: {
        $res: true,
        d1: 1024,
      },
      $widthAuto: {
        $res: true,
        d1: false,
      },
    },
  });

  const testConfig2: TestComponentConfig = {
    _component: "$TestComponent2",
    _id: "xxx",
    Components: [
      {
        _component: "$TestComponent1",
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
    values: {
      _component: "$TestComponent2",
      _id: "xxx",
      Components: [
        {
          _id: "yyy",
          _component: "$TestComponent1",
          itemProp1: true,
        },
      ],
    },
    params: {
      $width: {
        $res: true,
        d1: 1024,
      },
      $widthAuto: {
        $res: true,
        d1: false,
      },
    },
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
  };

  const testComponentDefinition2: InternalRenderableComponentDefinition = {
    id: "$TestComponent2",
    schema: [
      {
        prop: "Component",
        type: "component",
        accepts: [testComponentDefinition1.id],
      },
      {
        prop: "prop1",
        type: "boolean",
      },
    ],
    styles: ({ values }) => {
      return {
        components: {
          Component: {
            contextProp1: values.prop1,
          },
        },
      };
    },
  };

  const testCompilationContext = createTestCompilationContext({
    components: [testComponentDefinition1, testComponentDefinition2],
  });

  const testConfig: TestComponentConfig = {
    _component: "$TestComponent2",
    _id: "xxx",
    prop1: true,
    Component: [
      {
        _component: "$TestComponent1",
        _id: "yyy",
        prop1: false,
      },
    ],
  };

  const cache = new CompilationCache();

  compileInternal(testConfig, testCompilationContext, cache);

  expect(cache.count).toBe(2);
  expect(cache.get("xxx")?.values).toEqual({
    values: {
      _component: "$TestComponent2",
      _id: "xxx",
      prop1: true,
      Component: [
        {
          _id: "yyy",
          _component: "$TestComponent1",
        },
      ],
    },
    params: {
      $width: {
        $res: true,
        d1: 1024,
      },
      $widthAuto: {
        $res: true,
        d1: false,
      },
    },
  });
  expect(cache.get("yyy")?.values).toEqual({
    values: {
      _component: "$TestComponent1",
      _id: "yyy",
      prop1: false,
    },
    params: {
      contextProp1: {
        $res: true,
        d1: true,
      },
      $width: {
        $res: true,
        d1: 1024,
      },
      $widthAuto: {
        $res: true,
        d1: false,
      },
    },
  });
});

function createTestCompilationContext({
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
  components?: Array<InternalRenderableComponentDefinition>;
  devices?: Devices;
}): CompilationContextType {
  return {
    contextParams: {
      locale: "en",
    },
    definitions: {
      components,
    },
    devices,
    mainBreakpointIndex: "",
    theme: {} as any,
    types: {},
    locales: [{ code: "en-US", isDefault: true }],
    rootComponent: {
      id: "$RootComponent",
      schema: [],
    },
  };
}
