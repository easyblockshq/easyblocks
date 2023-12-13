import { configTraverse, isTemplate } from "@easyblocks/app-utils";
import { EditorContextType } from "../EditorContext";
import { Template } from "../types";
import { getTemplatesInternal } from "./getTemplates";
import { testEditorContext } from "../utils/tests";

const remoteSection1: Template = {
  type: "section",
  entry: {
    _template: "$Section",
    identifier: "remoteSection1",
    field: 10,
  },
};

const remoteSection2: Template = {
  type: "section",
  entry: {
    _template: "$Section",
    identifier: "remoteSection2",
    field: 20,
    Card: [
      {
        _template: "$Card",
        _master: "masterCard",
        prop: "xxx",
      },
    ],
  },
};

const remoteSectionMaster: Template = {
  // identifier: "remoteSectionMaster",
  type: "section",
  entry: {
    _template: "$Section",
    _master: "masterSection",
    identifier: "remoteSectionMaster",
    field: 30,
  },
};

const remoteCard1: Template = {
  // id: "card1",
  type: "card",
  entry: {
    _template: "$Card",
    prop: "yyy",
  },
  mapTo: "masterCard",
};

const builtinTempltates = [
  remoteSection1,
  remoteSection2,
  remoteSectionMaster,
  remoteCard1,
];

const editorContext: EditorContextType = {
  ...testEditorContext,
  definitions: {
    ...testEditorContext.definitions,
    components: [
      ...testEditorContext.definitions.components,
      {
        id: "$Section",
        tags: ["section"],
        schema: [
          {
            prop: "identifier",
            type: "string",
          },
          {
            prop: "field",
            type: "number",
          },
          {
            prop: "Card",
            type: "component",
            accepts: ["card"],
          },
          {
            prop: "textProp",
            type: "text",
            defaultValue: "Some test lorem ipsum",
          },
        ],
      },
      {
        id: "$Card",
        tags: ["card"],
        schema: [
          {
            prop: "prop",
            type: "string",
          },
        ],
      },
    ],
  },
};

function hasMasterConfigsDeep(arg: any): boolean {
  if (Array.isArray(arg)) {
    return arg.reduce((prev, cur) => prev || hasMasterConfigsDeep(cur), false);
  } else if (typeof arg === "object" && arg !== null) {
    if (arg._master !== undefined) {
      return true;
    }

    let hasMaster = false;
    for (const key in arg) {
      hasMaster = hasMaster || hasMasterConfigsDeep(arg[key]);
    }
    return hasMaster;
  }
  return false;
}

function haveMasterTemplates(templates: Template[]) {
  return templates.reduce(
    (prev, curr) => prev || curr.entry._master !== undefined,
    false
  );
}

describe("useTemplates - user environment", () => {
  test("no config has _master property set", () => {
    const templates = getTemplatesInternal(
      { ...editorContext, isMaster: false },
      [],
      builtinTempltates,
      []
    ).section;

    expect(templates.length).toBe(3); // sanity check
    expect(hasMasterConfigsDeep(templates)).toBe(false);
  });

  test("master templates are mapped", () => {
    const templates = getTemplatesInternal(
      {
        ...editorContext,
        isMaster: false,
      },
      [],
      builtinTempltates,
      []
    ).section.filter(isTemplate);

    const remoteSection2Template = templates.find(
      (template) => template.config.identifier === "remoteSection2"
    );

    expect(remoteSection2Template?.config.Card[0]).toMatchObject(
      remoteCard1.entry
    );
  });

  test("has no master templates in the list", () => {
    const templates = getTemplatesInternal(
      {
        ...editorContext,
        isMaster: false,
      },
      [],
      builtinTempltates,
      []
    ).section.filter(isTemplate);

    expect(haveMasterTemplates(templates)).toBe(false);
  });

  test("there is only one locale set in templates always and it's the main locale", () => {
    const context: EditorContextType = {
      ...editorContext,
      locales: [
        {
          code: "gb",
          isDefault: true,
        },
        {
          code: "de",
          fallback: "gb",
        },
      ],
      isMaster: false,
      contextParams: {
        locale: "de",
      },
    };

    const templates = getTemplatesInternal(
      context,
      [],
      builtinTempltates,
      []
    ).section;

    templates.filter(isTemplate).forEach((template) => {
      configTraverse(
        template.config,
        context,
        ({ path, value, schemaProp }) => {
          if (
            schemaProp.type === "text" ||
            schemaProp.type === "component-collection-localised"
          ) {
            const locales = Object.keys(
              schemaProp.type === "text" ? value.value : value
            );
            expect(locales).toHaveLength(1);
            expect(locales[0]).toBe("gb");
          }
        }
      );
    });
  });
});

describe("useTemplates - master environment", () => {
  test("some configs have _master property set", () => {
    const templates = getTemplatesInternal(
      { ...editorContext, isMaster: true },
      [],
      builtinTempltates,
      []
    ).section;

    expect(templates.length).toBeGreaterThan(2); // more than non-master
    expect(hasMasterConfigsDeep(templates)).toBe(true);
  });

  test("master templates are not mapped", () => {
    const templates = getTemplatesInternal(
      {
        ...editorContext,
        isMaster: true,
      },
      [],
      builtinTempltates,
      []
    ).section.filter(isTemplate);

    const remoteSection2Template = templates.find(
      (template) => template.config.identifier === "remoteSection2"
    );
    expect(remoteSection2Template?.config.Card[0]).toMatchObject(
      remoteSection2.entry.Card[0]
    );
  });

  test("has master templates in the list", () => {
    const templates = getTemplatesInternal(
      {
        ...editorContext,
        isMaster: true,
      },
      [],
      builtinTempltates,
      []
    ).section.filter(isTemplate);

    expect(haveMasterTemplates(templates)).toBe(true);
  });
});
