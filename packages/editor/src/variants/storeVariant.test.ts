import { ConfigComponent } from "@easyblocks/core";
import { storeVariant } from "./storeVariant";

describe("storeVariant", () => {
  it("Should keep repository unchanged when _variantGroupId does not exist on given config", () => {
    const variantGroup1Id = "variantGroup1";

    const componentVariantUpdated = createConfigComponent({
      _template: "$component",
      _id: "componentVariantA",
      _variantGroupId: undefined,
    });

    const repository = {
      [variantGroup1Id]: [],
    };

    const result = storeVariant(repository, componentVariantUpdated);

    expect(result).toEqual(repository);
  });

  it.each`
    variantGroupId     | repository                                                                   | expectedLength
    ${"variantGroup1"} | ${{ ["variantGroup1"]: [] }}                                                 | ${1}
    ${"variantGroup1"} | ${{ ["variantGroup1"]: [createConfigComponent(), createConfigComponent()] }} | ${3}
  `(
    "Should push new variant if does not exist in repository so far",
    ({ variantGroupId, repository, expectedLength }) => {
      const componentVariantUpdated = createConfigComponent({
        _template: "$component",
        _id: "componentVariantA",
        _variantGroupId: variantGroupId,
        prop1: 1,
      });

      const result = storeVariant(repository, componentVariantUpdated);

      expect(result[variantGroupId]).toHaveLength(expectedLength);
      expect(result[variantGroupId][expectedLength - 1]).toEqual(
        componentVariantUpdated
      );
    }
  );

  it("Should update variant in repository", () => {
    const variantGroup1Id = "variantGroup1";

    const componentVariant = createConfigComponent({
      _template: "$component",
      _id: "componentVariantA",
      _variantGroupId: variantGroup1Id,
      prop1: 0,
    });

    const componentVariantUpdated = createConfigComponent({
      _template: "$component",
      _id: "componentVariantA",
      _variantGroupId: variantGroup1Id,
      prop1: 1,
    });

    const repository = {
      [variantGroup1Id]: [
        createConfigComponent({
          _id: "123",
        }),
        componentVariant,
        createConfigComponent({
          _id: "456",
        }),
      ],
    };

    const result = storeVariant(repository, componentVariantUpdated);

    expect(result[variantGroup1Id]).toHaveLength(3);
    expect(result[variantGroup1Id][1]).toEqual(componentVariantUpdated);
  });
});

function createConfigComponent(
  init: Partial<ConfigComponent> = {}
): ConfigComponent {
  return {
    _template: "",
    ...init,
  };
}
