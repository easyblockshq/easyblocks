import {
  DEFAULT_DEVICES,
  EditorContextType,
  InternalRenderableComponentDefinition,
  splitConfigIntoSingleLocaleConfigs,
} from "@easyblocks/app-utils";
import { ComponentConfig } from "@easyblocks/core";
import { deepClone } from "@easyblocks/utils";
import { testEditorContext } from "../tests";
import { addLocalizedFlag } from "./addLocalizedFlag";
import { mergeSingleLocaleConfigsIntoConfig } from "./mergeConfigs";

const coreComponents: InternalRenderableComponentDefinition[] = [
  {
    id: "$LanguageSection",
    tags: ["section"],
    styles: null,
    schema: [
      {
        prop: "textProp",
        type: "text",
      },
      {
        prop: "textProp2",
        type: "text",
      },
      {
        prop: "otherProp",
        type: "select",
        options: ["one", "two", "three", "four", "five"],
      },
      {
        prop: "Card1",
        type: "component",
        accepts: ["card"],
      },
      {
        prop: "Card2",
        type: "component",
        accepts: ["card"],
      },
      {
        prop: "localisedCards",
        type: "component-collection-localised",
        accepts: ["card"],
      },
    ],
  },
  {
    id: "$LanguageCard",
    tags: ["card"],
    styles: null,
    schema: [
      {
        prop: "textProp",
        type: "text",
      },
      {
        prop: "textProp2",
        type: "text",
      },
      {
        prop: "otherProp",
        type: "select",
        options: ["one", "two", "three", "four", "five"],
      },
      {
        prop: "localisedCards",
        type: "component-collection-localised",
        accepts: ["card"],
      },
    ],
  },
  {
    id: "SimpleCard",
    tags: ["card"],
    styles: null,
    schema: [
      {
        prop: "someProp",
        type: "select",
        options: ["one", "two", "three", "four", "five"],
      },
    ],
  },
];

const localDog = {
  id: "local.3",
  value: {
    en: "Dog",
    pl: "Pies",
  },
};

const externalDog = {
  id: "3",
  value: localDog.value,
};

const localCat = {
  id: "local.1",
  value: {
    en: "Cat",
    pl: "Kot",
  },
};

const externalCat = {
  id: "1",
  value: localCat.value,
};

const localHamster = {
  id: "local.2",
  value: {
    en: "Hamster",
  },
};

const externalHamster = {
  id: "2",
  value: localHamster.value,
};

const editorContext: EditorContextType = {
  ...testEditorContext,
  devices: DEFAULT_DEVICES,
  definitions: {
    components: coreComponents,
    links: [],
    actions: [],
    textModifiers: [],
  },
};

const englishCard1 = {
  _template: "SimpleCard",
  _id: "english.card.1",
  someProp: "one",
};
const englishCard2 = {
  _template: "SimpleCard",
  _id: "english.card.2",
  someProp: "two",
};
const polishCard1 = {
  _template: "SimpleCard",
  _id: "english.polish.1",
  someProp: "three",
};
const polishCard2 = {
  _template: "SimpleCard",
  _id: "english.polish.2",
  someProp: "four",
};

const config: ComponentConfig = {
  _template: "$LanguageSection",
  _id: "section1",
  textProp: localDog,
  textProp2: externalDog,
  otherProp: "one",
  Card1: [
    {
      _template: "$LanguageCard",
      _id: "card1",
      textProp: localCat,
      textProp2: externalCat,
      otherProp: "one",
      localisedCards: {
        en: [englishCard1, englishCard2],
      },
    },
  ],
  Card2: [
    {
      _template: "$LanguageCard",
      _id: "card2",
      textProp: localHamster,
      textProp2: externalHamster,
      otherProp: "one",
      localisedCards: {
        en: [],
        pl: [polishCard1],
      },
    },
  ],
  localisedCards: {
    en: [englishCard1, englishCard2],
    pl: [polishCard1, polishCard2],
  },
};
describe("merge", () => {
  test("works", () => {
    const split = splitConfigIntoSingleLocaleConfigs(
      addLocalizedFlag(config, editorContext),
      editorContext.locales
    );
    const merged = mergeSingleLocaleConfigsIntoConfig(split, editorContext);

    expect(merged).toEqual(config);
  });

  test("merge works with undefined properties and undefined subcomponents, undefined values are preserved in merged config", () => {
    const configWithUndefinedSubcomponentsAndTexts = {
      _template: "$LanguageSection",
      _id: "section1",
    };

    const configs = {
      en: configWithUndefinedSubcomponentsAndTexts,
      pl: configWithUndefinedSubcomponentsAndTexts,
    };

    const merged = mergeSingleLocaleConfigsIntoConfig(configs, editorContext);

    expect(merged).toEqual(configWithUndefinedSubcomponentsAndTexts);
  });

  test("Should not add non-existing localized values for `text` elements (eg. path 'a.en-US.b.[0].prop' will not exist on 'de-DE' config)", () => {
    const ctx = deepClone(editorContext);
    ctx.definitions.components = [
      {
        id: "root",
        tags: [],
        styles: null,
        schema: [
          {
            prop: "elements",
            type: "component-collection-localised",
            accepts: ["localizedElement"],
          },
        ],
      },
      {
        id: "localizedElement",
        tags: [],
        styles: null,
        schema: [
          {
            prop: "elements",
            type: "component-collection",
            accepts: ["element"],
          },
        ],
      },
      {
        id: "element",
        tags: [],
        styles: null,
        schema: [
          {
            prop: "action",
            type: "component",
            accepts: ["actionLink"],
            visible: true,
          },
        ],
      },
      {
        id: "link",
        label: "Link",
        schema: [
          {
            prop: "url",
            type: "text",
            defaultValue: "Esperanto",
          },
        ],
        tags: ["actionLink"],
      },
    ];

    const split = {
      "en-US": {
        _id: "root",
        _template: "root",
        elements: {
          "en-US": [
            {
              _id: "localized-element-id_en-US",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element_id_en-US",
                  _template: "element",
                  action: [
                    {
                      _id: "link_en-US",
                      _template: "link",
                      url: {
                        id: "local.url_id_en-US",
                        value: {
                          "en-US": "English",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      "de-DE": {
        _id: "root",
        _template: "root",
        elements: {
          "de-DE": [
            {
              _id: "localized_element_id_de-DE",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element_is_de-DE",
                  _template: "element",
                  action: [
                    {
                      _id: "link_id_de-DE",
                      _template: "link",
                      url: {
                        id: "local.url_id_de-DE",
                        value: {
                          "de-DE": "Deutsch",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    const merged = mergeSingleLocaleConfigsIntoConfig(split, ctx);

    expect(merged).toEqual({
      _id: "root",
      _template: "root",
      elements: {
        "en-US": [
          {
            _id: "localized-element-id_en-US",
            _template: "localizedElement",
            elements: [
              {
                _id: "element_id_en-US",
                _template: "element",
                action: [
                  {
                    _id: "link_en-US",
                    _template: "link",
                    url: {
                      id: "local.url_id_en-US",
                      value: {
                        "en-US": "English",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
        "de-DE": [
          {
            _id: "localized_element_id_de-DE",
            _template: "localizedElement",
            elements: [
              {
                _id: "element_is_de-DE",
                _template: "element",
                action: [
                  {
                    _id: "link_id_de-DE",
                    _template: "link",
                    url: {
                      id: "local.url_id_de-DE",
                      value: {
                        "de-DE": "Deutsch",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });

  test.each([
    {
      tamperConfig: (configs: { [locale: string]: ComponentConfig }) => {
        delete configs.pl.Card1;
      },
    },
    {
      tamperConfig: (configs: { [locale: string]: ComponentConfig }) => {
        configs.en.otherProp = "five";
      },
    },
  ])(
    "Should throw error when configs have different structure - except of localized props, those are ignored",
    ({ tamperConfig }) => {
      expect(() => {
        const split = splitConfigIntoSingleLocaleConfigs(
          addLocalizedFlag(config, editorContext),
          editorContext.locales
        );
        tamperConfig(split);
        mergeSingleLocaleConfigsIntoConfig(split, editorContext);
      }).toThrow(
        "You probably changed the value of the config for just one language"
      );
    }
  );
});
