import { ConfigComponent } from "@easyblocks/core";
import { splitConfigIntoSingleLocaleConfigs } from "..";

const locales = [
  {
    code: "en",
    isDefault: true,
  },
  {
    code: "pl",
    fallback: "en",
  },
];

const localDog = {
  config: {
    __localized: true,
    id: "local.3",
    value: {
      en: "Dog",
      pl: "Pies",
    },
  },
  pl: {
    id: "local.3",
    value: {
      pl: "Pies",
    },
  },
  en: {
    id: "local.3",
    value: {
      en: "Dog",
    },
  },
};

const externalDog = {
  id: "3",
  value: localDog.config.value,
};

const localCat = {
  config: {
    __localized: true,
    id: "local.1",
    value: {
      en: "Cat",
      pl: "Kot",
    },
  },
  pl: {
    id: "local.1",
    value: {
      pl: "Kot",
    },
  },
  en: {
    id: "local.1",
    value: {
      en: "Cat",
    },
  },
};

const externalCat = {
  id: "1",
  value: localCat.config.value,
};

const localHamster = {
  config: {
    __localized: true,
    id: "local.2",
    value: {
      en: "Hamster",
    },
  },
  en: {
    id: "local.2",
    value: {
      en: "Hamster",
    },
  },
  pl: {
    id: "local.2",
    value: {
      pl: "Hamster",
      __fallback: true,
    },
  },
};

const externalHamster = {
  id: "2",
  value: localHamster.config.value,
};

/**
 * IMPORTANT!
 *
 * One of the crucial parts of this test suite is that cards have textProp that is localizable.
 *
 * We can have sometimes a case
 *
 */
const englishCard1 = {
  config: {
    _template: "SimpleCard",
    _id: "english.card.1",
    someProp: "one",
    textProp: localDog.config,
  },
  en: {
    _template: "SimpleCard",
    _id: "english.card.1",
    someProp: "one",
    textProp: localDog.en,
  },
  pl: {
    _template: "SimpleCard",
    _id: "english.card.1",
    someProp: "one",
    textProp: localDog.pl,
  },
};

const englishCard2 = {
  config: {
    _template: "SimpleCard",
    _id: "english.card.2",
    someProp: "two",
    textProp: localCat.config,
  },
  en: {
    _template: "SimpleCard",
    _id: "english.card.2",
    someProp: "two",
    textProp: localCat.en,
  },
  pl: {
    _template: "SimpleCard",
    _id: "english.card.2",
    someProp: "two",
    textProp: localCat.pl,
  },
};

const polishCard1 = {
  config: {
    _template: "SimpleCard",
    _id: "english.polish.1",
    someProp: "three",
    textProp: localHamster.config,
  },
  en: {
    _template: "SimpleCard",
    _id: "english.polish.1",
    someProp: "three",
    textProp: localHamster.en,
  },
  pl: {
    _template: "SimpleCard",
    _id: "english.polish.1",
    someProp: "three",
    textProp: localHamster.pl,
  },
};

const polishCard2 = {
  config: {
    _template: "SimpleCard",
    _id: "english.polish.2",
    someProp: "four",
    textProp: externalCat,
  },
  en: {
    _template: "SimpleCard",
    _id: "english.polish.2",
    someProp: "four",
    textProp: externalCat,
  },
  pl: {
    _template: "SimpleCard",
    _id: "english.polish.2",
    someProp: "four",
    textProp: externalCat,
  },
};

const config: ConfigComponent = {
  _template: "$LanguageSection",
  _id: "section1",
  textProp: localDog.config,
  textProp2: externalDog,
  otherProp: "one",
  Card1: [
    {
      _template: "$LanguageCard",
      _id: "card1",
      textProp: localCat.config,
      textProp2: externalCat,
      otherProp: "one",
      localisedCards: {
        __localized: true,
        en: [englishCard1.config, englishCard2.config],
      },
    },
  ],
  Card2: [
    {
      _template: "$LanguageCard",
      _id: "card2",
      textProp: localHamster.config,
      textProp2: externalHamster,
      otherProp: "one",
      localisedCards: {
        __localized: true,
        en: [],
        pl: [polishCard1.config],
      },
    },
  ],
  localisedCards: {
    __localized: true,
    en: [englishCard1.config, englishCard2.config],
    pl: [polishCard1.config, polishCard2.config],
  },
};

describe("split", () => {
  test("works for texts", () => {
    const split = splitConfigIntoSingleLocaleConfigs(config, locales);
    expect(split.en.textProp.value).toEqual({ en: "Dog" });
    expect(split.en.textProp2.value).toEqual(externalDog.value);

    expect(split.en.Card1[0].textProp).toEqual(localCat.en);
    expect(split.en.Card1[0].textProp2).toEqual(externalCat);

    expect(split.en.Card2[0].textProp).toEqual(localHamster.en);
    expect(split.en.Card2[0].textProp2).toEqual(externalHamster);

    expect(split.pl.textProp).toEqual(localDog.pl);
    expect(split.pl.textProp2).toEqual(externalDog);

    expect(split.pl.Card1[0].textProp).toEqual(localCat.pl);
    expect(split.pl.Card1[0].textProp2).toEqual(externalCat);

    expect(split.pl.Card2[0].textProp).toEqual(localHamster.pl);
    expect(split.en.Card2[0].textProp2).toEqual(externalHamster);
  });

  test("works for localised collection", () => {
    const split = splitConfigIntoSingleLocaleConfigs(config, locales);
    expect(split.en.localisedCards).toEqual({
      en: [englishCard1.en, englishCard2.en],
    });
    expect(split.pl.localisedCards).toEqual({
      pl: [polishCard1.pl, polishCard2.pl],
    });

    expect(split.en.Card1[0].localisedCards).toEqual({
      en: [englishCard1.en, englishCard2.en],
    });
    expect(split.pl.Card1[0].localisedCards).toEqual({
      pl: [englishCard1.pl, englishCard2.pl],
      __fallback: true,
    });

    expect(split.en.Card2[0].localisedCards).toEqual({ en: [] });
    expect(split.pl.Card2[0].localisedCards).toEqual({ pl: [polishCard1.pl] });
  });

  test("localised text inside localised collection", () => {
    const split = splitConfigIntoSingleLocaleConfigs(
      {
        _id: "root-id-123",
        _template: "root",
        elements: {
          __localized: true,
          en: [
            {
              _id: "localized-element-123",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element-id-123",
                  _template: "element",
                  action: [
                    {
                      _id: "link-id-123",
                      _template: "link",
                      url: {
                        __localized: true,
                        id: "local.url-id-123",
                        value: {
                          en: "English",
                          pl: "Polski",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
          pl: [
            {
              _id: "localized-element-123",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element-id-123",
                  _template: "element",
                  action: [
                    {
                      _id: "link-id-123",
                      _template: "link",
                      url: {
                        __localized: true,
                        id: "local.url-id-123",
                        value: {
                          en: "English",
                          pl: "Polski",
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
      locales
    );

    expect(split).toEqual({
      en: {
        _id: "root-id-123",
        _template: "root",
        elements: {
          en: [
            {
              _id: "localized-element-123",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element-id-123",
                  _template: "element",
                  action: [
                    {
                      _id: "link-id-123",
                      _template: "link",
                      url: { id: "local.url-id-123", value: { en: "English" } },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      pl: {
        _id: "root-id-123",
        _template: "root",
        elements: {
          pl: [
            {
              _id: "localized-element-123",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element-id-123",
                  _template: "element",
                  action: [
                    {
                      _id: "link-id-123",
                      _template: "link",
                      url: { id: "local.url-id-123", value: { pl: "Polski" } },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    });
  });

  test("localised text inside localised collection where fallback is applied for collection, but the english has nested localised field", () => {
    const split = splitConfigIntoSingleLocaleConfigs(
      {
        _id: "root-id-123",
        _template: "root",
        elements: {
          __localized: true,
          en: [
            {
              _id: "localized-element-123",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element-id-123",
                  _template: "element",
                  action: [
                    {
                      _id: "link-id-123",
                      _template: "link",
                      url: {
                        __localized: true,
                        id: "local.url-id-123",
                        value: {
                          en: "English",
                          pl: "Polski",
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
      locales
    );

    expect(split).toEqual({
      en: {
        _id: "root-id-123",
        _template: "root",
        elements: {
          en: [
            {
              _id: "localized-element-123",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element-id-123",
                  _template: "element",
                  action: [
                    {
                      _id: "link-id-123",
                      _template: "link",
                      url: { id: "local.url-id-123", value: { en: "English" } },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      pl: {
        _id: "root-id-123",
        _template: "root",
        elements: {
          __fallback: true,
          pl: [
            {
              _id: "localized-element-123",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element-id-123",
                  _template: "element",
                  action: [
                    {
                      _id: "link-id-123",
                      _template: "link",
                      url: { id: "local.url-id-123", value: { pl: "Polski" } },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    });
  });

  test("localised text inside localised collection where fallback is applied for collection, but the english has nested localised field which also should have fallback applied", () => {
    const split = splitConfigIntoSingleLocaleConfigs(
      {
        _id: "root-id-123",
        _template: "root",
        elements: {
          __localized: true,
          en: [
            {
              _id: "localized-element-123",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element-id-123",
                  _template: "element",
                  action: [
                    {
                      _id: "link-id-123",
                      _template: "link",
                      url: {
                        __localized: true,
                        id: "local.url-id-123",
                        value: {
                          en: "English",
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
      locales
    );

    expect(split).toEqual({
      en: {
        _id: "root-id-123",
        _template: "root",
        elements: {
          en: [
            {
              _id: "localized-element-123",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element-id-123",
                  _template: "element",
                  action: [
                    {
                      _id: "link-id-123",
                      _template: "link",
                      url: { id: "local.url-id-123", value: { en: "English" } },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      pl: {
        _id: "root-id-123",
        _template: "root",
        elements: {
          __fallback: true,
          pl: [
            {
              _id: "localized-element-123",
              _template: "localizedElement",
              elements: [
                {
                  _id: "element-id-123",
                  _template: "element",
                  action: [
                    {
                      _id: "link-id-123",
                      _template: "link",
                      url: {
                        id: "local.url-id-123",
                        value: { pl: "English", __fallback: true },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    });
  });
});
