import { ConfigComponent } from "@easyblocks/core";
import { getVariant } from "./getVariant";
import { firstMatchingVariantFor } from "./matchers";

describe("getVariant", () => {
  enum AUDIENCES {
    ALL_AUDIENCES = "ALL_AUDIENCES",
    FAMILY_AND_FRIENDS = "FAMILY_AND_FRIENDS",
    KIDS = "KIDS",
    ADULTS = "ADULTS",
    EMEA = "EMEA",
  }

  const variantGroup1Id = "variantGroup1";

  const componentOriginal = createConfigComponent({
    _template: "$component",
    _id: "componentOriginal",
    _variantGroupId: variantGroup1Id,
  });

  const componentVariantA = createConfigComponent({
    _template: "$component",
    _id: "componentVariantA",
    _audience: AUDIENCES.FAMILY_AND_FRIENDS,
  });

  const componentVariantB = createConfigComponent({
    _template: "$component",
    _id: "componentVariantB",
    _audience: AUDIENCES.KIDS,
  });

  const componentVariantC = createConfigComponent({
    _template: "$component",
    _id: "componentVariantC",
    _audience: AUDIENCES.ADULTS,
  });

  const componentWithoutVariants = createConfigComponent({
    _template: "$component",
    _id: "component2.0",
  });

  const repository = {
    [variantGroup1Id]: [
      componentVariantC,
      componentVariantB,
      componentVariantA,
    ],
  };

  it.each`
    originalComponent           | activeAudiences                                                     | expectedVariant             | expectedId
    ${componentOriginal}        | ${[]}                                                               | ${componentOriginal}        | ${componentOriginal._id}
    ${componentOriginal}        | ${[AUDIENCES.EMEA]}                                                 | ${componentOriginal}        | ${componentOriginal._id}
    ${componentOriginal}        | ${[AUDIENCES.FAMILY_AND_FRIENDS]}                                   | ${componentVariantA}        | ${componentVariantA._id}
    ${componentOriginal}        | ${[AUDIENCES.KIDS]}                                                 | ${componentVariantB}        | ${componentVariantB._id}
    ${componentOriginal}        | ${[AUDIENCES.ADULTS]}                                               | ${componentVariantC}        | ${componentVariantC._id}
    ${componentOriginal}        | ${[AUDIENCES.KIDS, AUDIENCES.ADULTS, AUDIENCES.FAMILY_AND_FRIENDS]} | ${componentVariantC}        | ${componentVariantC._id}
    ${componentOriginal}        | ${[AUDIENCES.ADULTS, AUDIENCES.KIDS, AUDIENCES.FAMILY_AND_FRIENDS]} | ${componentVariantC}        | ${componentVariantC._id}
    ${componentOriginal}        | ${[AUDIENCES.ADULTS, AUDIENCES.FAMILY_AND_FRIENDS, AUDIENCES.KIDS]} | ${componentVariantC}        | ${componentVariantC._id}
    ${componentWithoutVariants} | ${[AUDIENCES.ALL_AUDIENCES]}                                        | ${componentWithoutVariants} | ${componentWithoutVariants._id}
    ${undefined}                | ${[AUDIENCES.ALL_AUDIENCES]}                                        | ${undefined}                | ${undefined}
  `(
    "Should return $expectedId for $activeAudiences",
    ({ originalComponent, activeAudiences, expectedVariant }) => {
      const variant = getVariant(
        repository,
        firstMatchingVariantFor(activeAudiences),
        originalComponent
      );
      expect(variant).toEqual(expectedVariant);
    }
  );

  it.each`
    originalComponent    | repository   | activeAudiences     | expectedVariant      | expectedId
    ${componentOriginal} | ${undefined} | ${[]}               | ${componentOriginal} | ${componentOriginal._id}
    ${componentOriginal} | ${[]}        | ${[AUDIENCES.EMEA]} | ${componentOriginal} | ${componentOriginal._id}
  `(
    "Should return $originalComponent when repository is empty",
    ({ originalComponent, repository, activeAudiences }) => {
      const variant = getVariant(
        repository,
        firstMatchingVariantFor(activeAudiences),
        originalComponent
      );
      expect(variant).toEqual(originalComponent);
    }
  );
});

function createConfigComponent(
  init: Partial<ConfigComponent> = {}
): ConfigComponent {
  return {
    _template: "",
    ...init,
  };
}
