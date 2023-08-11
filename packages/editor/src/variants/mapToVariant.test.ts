import { mapToVariant } from "./mapToVariant";

describe("mapToVariant", () => {
  it("Should map config array", () => {
    const configBeforeApplyingVariants = [
      {
        _variantGroupId: "group1",
        _id: "1.3",
        _template: "$component",
        _audience: "ALL_AUDIENCES",
      },
      {
        _variantGroupId: "group2",
        _id: "2.3",
        _template: "$component",
        _audience: "ALL_AUDIENCES",
      },
    ];
    const expectedConfig = [
      {
        _variantGroupId: "group1",
        _id: "1.2",
        _template: "$component",
        _audience: "FAMILY_AND_FRIENDS",
      },
      {
        _variantGroupId: "group2",
        _id: "2.1",
        _template: "$component",
        _audience: "ADULTS",
      },
    ];

    const getVariant = jest
      .fn()
      .mockReturnValueOnce({
        _variantGroupId: "group1",
        _id: "1.2",
        _template: "$component",
        _audience: "FAMILY_AND_FRIENDS",
      })
      .mockReturnValueOnce({
        _variantGroupId: "group2",
        _id: "2.1",
        _template: "$component",
        _audience: "ADULTS",
      });

    const configAfterVariantsApplied = mapToVariant(getVariant, {
      value: configBeforeApplyingVariants,
      schemaProp: {
        prop: "prop",
        type: "component-collection",
        componentTypes: [],
      },
    });

    expect(getVariant).toHaveBeenCalledTimes(2);
    expect(configAfterVariantsApplied).toEqual(expectedConfig);
  });

  it("Should map config object", () => {
    const configBeforeApplyingVariants = {
      _variantGroupId: "group1",
      _id: "1.3",
      _template: "$component",
      _audience: "ALL_AUDIENCES",
    };

    const expectedConfig = {
      _variantGroupId: "group1",
      _id: "1.2",
      _template: "$component",
      _audience: "FAMILY_AND_FRIENDS",
    };

    const getVariant = jest.fn().mockReturnValueOnce({
      _variantGroupId: "group1",
      _id: "1.2",
      _template: "$component",
      _audience: "FAMILY_AND_FRIENDS",
    });

    const configAfterVariantsApplied = mapToVariant(getVariant, {
      value: configBeforeApplyingVariants,
      schemaProp: { prop: "prop", type: "component", componentTypes: [] },
    });

    expect(getVariant).toHaveBeenCalledTimes(1);
    expect(configAfterVariantsApplied).toEqual(expectedConfig);
  });

  it("Should not map if config is not component or component collection", () => {
    const getVariant = jest.fn();

    const config = {
      _id: "1.2",
      _template: "$component",
    };

    const result = mapToVariant(getVariant, {
      value: config,
      schemaProp: { prop: "prop", type: "string" },
    });

    expect(getVariant).not.toHaveBeenCalled();
    expect(result).toEqual(config);
  });
});
