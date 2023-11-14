import {
  CompilationContextType,
  DEFAULT_DEVICES,
  InternalRenderableComponentDefinition,
} from "@easyblocks/app-utils";
import { ConfigComponent, Locale, LocalisedConfigs } from "@easyblocks/core";
import { testEditorContext } from "../../utils/tests";
import { syncConfigForLocales } from "./syncConfigForLocales";

/**
 * What do we sync?
 * - all "text" fields. That's it. No matter if in $text, in custom component, action, etc.
 */

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
    ],
  },
  {
    id: "MyLanguageCard",
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
    ],
  },
];

const englishLocalDog = {
  id: "local.3",
  value: "Dog",
};

const englishExternalDog = {
  id: "3",
  value: "Dog",
};

const englishLocalCat = {
  id: "local.1",
  value: "Cat",
};

const englishExternalCat = {
  id: "1",
  value: "Cat",
};

const englishLocalHamster = {
  id: "local.2",
  value: "Hamster",
};

const englishExternalHamster = {
  id: "2",
  value: "Hamster",
};

const polishLocalDog = {
  id: "local.3",
  value: "Pies",
  fallback: "Dog",
};

const polishExternalDog = {
  id: "3",
  value: "Pies",
  fallback: "Dog",
};

const polishLocalCat = {
  id: "local.1",
  value: "Kot",
  fallback: "Cat",
};

const polishExternalCat = {
  id: "1",
  value: "Kot",
  fallback: "Cat",
};

const polishLocalHamster = {
  id: "local.2",
  value: "Chomik",
  fallback: "Hamster",
};

const polishExternalHamster = {
  id: "2",
  value: "Chomik",
  fallback: "Hamster",
};

const compilationContext: CompilationContextType = {
  ...testEditorContext,
  devices: DEFAULT_DEVICES,
  definitions: {
    ...testEditorContext.definitions,
    components: coreComponents,
  },
};

const polishContentWithOnes: ConfigComponent = {
  _template: "$LanguageSection",
  _id: "section1",
  textProp: polishLocalDog,
  textProp2: polishExternalDog,
  otherProp: "one",
  Card1: [
    {
      _template: "$LanguageCard",
      _id: "card1",
      textProp: polishLocalCat,
      textProp2: polishExternalCat,
      otherProp: "one",
    },
  ],
  Card2: [
    {
      _template: "MyLanguageCard",
      _id: "card2",
      textProp: polishLocalHamster,
      textProp2: polishExternalHamster,
      otherProp: "one",
    },
  ],
};

const polishContentWithTwos = {
  ...polishContentWithOnes,
  otherProp: "two",
  Card1: [
    {
      ...polishContentWithOnes.Card1[0],
      otherProp: "two",
    },
  ],
  Card2: [
    {
      ...polishContentWithOnes.Card2[0],
      otherProp: "two",
    },
  ],
};

const englishContentWithOnes: ConfigComponent = {
  _template: "$LanguageSection",
  _id: "section1",
  textProp: englishLocalDog,
  textProp2: englishExternalDog,
  otherProp: "one",
  Card1: [
    {
      _template: "$LanguageCard",
      _id: "card1",
      textProp: englishLocalCat,
      textProp2: englishExternalCat,
      otherProp: "one",
    },
  ],
  Card2: [
    {
      _template: "MyLanguageCard",
      _id: "card2",
      textProp: englishLocalHamster,
      textProp2: englishExternalHamster,
      otherProp: "one",
    },
  ],
};

const englishContentWithTwos = {
  ...englishContentWithOnes,
  otherProp: "two",
  Card1: [
    {
      ...englishContentWithOnes.Card1[0],
      otherProp: "two",
    },
  ],
  Card2: [
    {
      ...englishContentWithOnes.Card2[0],
      otherProp: "two",
    },
  ],
};

const configsWithOnes: LocalisedConfigs = {
  en: englishContentWithOnes,
  pl: polishContentWithOnes,
};

const locales: Locale[] = [
  {
    code: "en",
    isDefault: true,
  },
  {
    code: "pl",
    fallback: "en",
  },
];

describe("syncConfigForLanguage", () => {
  test("works with value changes", () => {
    const syncedConfigs = syncConfigForLocales(
      configsWithOnes,
      "en",
      locales,
      englishContentWithTwos,
      compilationContext
    );

    expect(syncedConfigs).toEqual({
      pl: polishContentWithTwos,
      en: englishContentWithTwos,
    });
  });

  test("works with reference source changes (two cards changed places with each other)", () => {
    const changedContent: ConfigComponent = {
      ...englishContentWithTwos,
      Card1: englishContentWithTwos.Card2,
      Card2: englishContentWithTwos.Card1,
    };

    const syncedConfigs = syncConfigForLocales(
      configsWithOnes,
      "en",
      locales,
      changedContent,
      compilationContext
    );

    expect(syncedConfigs).toEqual({
      pl: {
        ...polishContentWithTwos,
        Card1: [...polishContentWithTwos.Card2],
        Card2: [...polishContentWithTwos.Card1],
      },
      en: {
        ...englishContentWithTwos,
        Card1: [...englishContentWithTwos.Card2],
        Card2: [...englishContentWithTwos.Card1],
      },
    });
  });

  test("properly handles content deletion", () => {
    const changedContent: ConfigComponent = {
      ...englishContentWithTwos,
      Card2: [],
    };

    const syncedConfigs = syncConfigForLocales(
      configsWithOnes,
      "en",
      locales,
      changedContent,
      compilationContext
    );

    expect(syncedConfigs).toEqual({
      pl: {
        ...polishContentWithTwos,
        Card2: [],
      },
      en: {
        ...englishContentWithTwos,
        Card2: [],
      },
    });
  });

  test("properly handles content addition", () => {
    const configsWithOnesWithoutCard2 = {
      pl: {
        ...polishContentWithOnes,
        Card2: [],
      },
      en: {
        ...englishContentWithOnes,
        Card2: [],
      },
    };

    const syncedConfigs = syncConfigForLocales(
      configsWithOnesWithoutCard2,
      "en",
      locales,
      englishContentWithTwos,
      compilationContext
    );

    expect(syncedConfigs).toEqual({
      pl: {
        ...polishContentWithTwos,
        Card2: [
          {
            ...polishContentWithTwos.Card2[0],
            textProp: {
              ...polishLocalHamster,
              value: null,
            },
            textProp2: {
              ...polishExternalHamster,
              value: null,
            },
          },
        ],
      },
      en: {
        ...englishContentWithTwos,
      },
    });
  });

  test("properly handles content addition when new content was added in language that is not default. In such case default language should be empty string.", () => {
    const configsWithOnesWithoutCard2 = {
      pl: {
        ...polishContentWithOnes,
        Card2: [],
      },
      en: {
        ...englishContentWithOnes,
        Card2: [],
      },
    };

    const syncedConfigs = syncConfigForLocales(
      configsWithOnesWithoutCard2,
      "pl",
      locales,
      polishContentWithTwos,
      compilationContext
    );

    expect(syncedConfigs).toEqual({
      pl: {
        ...polishContentWithTwos,
        Card2: [
          {
            ...polishContentWithTwos.Card2[0],
            textProp: {
              ...polishLocalHamster,
              fallback: undefined, // Fallback is empty because value for English is null!!!
            },
            textProp2: {
              ...polishExternalHamster,
              fallback: undefined,
            },
          },
        ],
      },
      en: {
        ...englishContentWithTwos,
        Card2: [
          {
            ...englishContentWithTwos.Card2[0],
            textProp: {
              ...englishLocalHamster,
              value: null, // English value is null because this text was added in different language
            },
            textProp2: {
              ...englishExternalHamster,
              value: null,
            },
          },
        ],
      },
    });
  });
});
