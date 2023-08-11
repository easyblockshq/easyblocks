import { Devices } from "@easyblocks/core";
import { resop2 } from "./resop";
import { InternalRenderableComponentDefinition } from "./types";

const devices: Devices = [
  {
    id: "b1",
    w: 100,
    h: 100,
    breakpoint: 150,
  },
  {
    id: "b2",
    w: 200,
    h: 200,
    breakpoint: 250,
  },
  {
    id: "b3",
    w: 300,
    h: 300,
    breakpoint: 350,
  },
  {
    id: "b4",
    w: 400,
    h: 400,
    breakpoint: 450,
  },
  {
    id: "b5",
    w: 500,
    h: 500,
    breakpoint: null,
  },
];

describe("resop2", () => {
  const testComponentDefinition: InternalRenderableComponentDefinition = {
    id: "$TestComponent",
    schema: [
      {
        prop: "schemaScalarVal",
        type: "text",
      },
      {
        prop: "schemaVal1",
        type: "select$",
        options: ["a", "b", "c", "d", "e", "f", "g", "h"],
      },
      {
        prop: "schemaVal2",
        type: "select$",
        options: ["a", "b", "c", "d", "e", "f", "g", "h"],
      },
      {
        prop: "schemaValSpace",
        type: "space",
      },
      {
        prop: "Card",
        type: "component",
        componentTypes: ["card"],
      },
      {
        prop: "Cards",
        type: "component-collection",
        componentTypes: ["card"],
        itemFields: [
          {
            prop: "schemaItemProp",
            type: "select$",
            options: ["a", "b", "c"],
          },
        ],
      },
      {
        prop: "schemaCustomTypeProp",
        type: "resource",
        resourceType: "customType",
      },
    ],
    tags: [],
  };

  const callback: (val: { [key: string]: any }) => { [key: string]: any } = (
    vals
  ) => {
    return {
      Box1: {
        cssVal: `${vals.schemaVal1} ${vals.schemaVal2} ${vals.justArray.join(
          ""
        )}`,
        ":hover": {
          hoverCssVal: `${vals.schemaVal1}-${vals.schemaVal2}`,
        },
        justArray: vals.justArray,
        justValue: "xxx",
        spaceVal: vals.schemaValSpace * 3,
        array: Array(vals.schemaValSpace).fill(
          `${vals.schemaVal1} ${vals.schemaVal2}`
        ),
      },
      Box2: {
        cssVal2: vals.schemaVal1.repeat(vals.justArray.length),
      },
      Card: {
        contextVal: `${vals.schemaVal1}-${vals.schemaVal2}`,
      },
    };
  };

  describe("when output data has all output values for all breakpoints", () => {
    const input = {
      scalarVal: "test",
      schemaVal1: {
        b1: "a",
        b2: "b",
        b3: "b",
        b4: "b",
        b5: "b",
        $res: true,
      },
      schemaVal2: {
        b1: "a",
        b2: "b",
        b3: "c",
        b4: "d",
        b5: "e",
        $res: true,
      },
      schemaValSpace: {
        b1: 10,
        b2: 20,
        b3: 20,
        b4: 20,
        b5: 20,
        $res: true,
      },
      justArray: ["a", "b", "c"],
    };

    const result = resop2(input, callback, devices, testComponentDefinition);

    test("properly calculates values with all output values different", () => {
      expect(result.Box1.cssVal).toEqual({
        b1: "a a abc",
        b2: "b b abc",
        b3: "b c abc",
        b4: "b d abc",
        b5: "b e abc",
        $res: true,
      });
    });

    test("identical values across breakpoints are not array, just a value", () => {
      expect(result.Box1.justValue).toEqual("xxx");
    });

    test("nesting works", () => {
      expect(result.Box1[":hover"].hoverCssVal).toEqual({
        b1: "a-a",
        b2: "b-b",
        b3: "b-c",
        b4: "b-d",
        b5: "b-e",
        $res: true,
      });
    });

    test("identical arrays across breakpoints keeps being an array (not array of arrays)", () => {
      expect(result.Box1.justArray).toEqual(["a", "b", "c"]);
    });

    test("properly calculates values with some of output values different (but not al - normalization!) ", () => {
      expect(result.Box2.cssVal2).toEqual({ b1: "aaa", b2: "bbb", $res: true });
    });

    test("properly calculates props for non-Boxes", () => {
      expect(result.Card.contextVal).toEqual({
        b1: "a-a",
        b2: "b-b",
        b3: "b-c",
        b4: "b-d",
        b5: "b-e",
        $res: true,
      });
    });

    test("properly calculates space values", () => {
      expect(result.Box1.spaceVal).toEqual({ b1: 30, b2: 60, $res: true });
    });
  });

  const input2 = {
    val1: {
      b1: "a",
      b2: "b",
      b3: "c",
      b4: "d",
      b5: "d",
      $res: true,
    },
  } as const;

  describe("when output is undefined for all breakpoints", () => {
    test("output value is undefined scalar", () => {
      const result = resop2(
        input2,
        (vals) => {
          return {
            output: undefined,
          };
        },
        devices
      );

      expect(result.output).toBe("unset");
    });
  });

  describe("when output is null for all breakpoints", () => {
    test("output value is null scalar", () => {
      const result = resop2(
        input2,
        () => {
          return {
            output: null,
          };
        },
        devices
      );

      expect(result.output).toBe("unset");
    });
  });

  describe("when different properties are defined for different breakpoints", () => {
    test("unset is set correctly", () => {
      const result = resop2(
        input2,
        (vals) => {
          if (vals.val1 > "b") {
            return {
              output1: "greater-than-b",
            };
          } else {
            return {
              output2: "lower-than-b",
            };
          }
        },
        devices
      );

      expect(result.output1).toEqual({
        b2: "unset",
        b3: "greater-than-b",
        $res: true,
      });
      expect(result.output2).toEqual({
        b2: "lower-than-b",
        b3: "unset",
        $res: true,
      });
    });
  });

  describe("when output value is defined for some breakpoints only", () => {
    test("unset is set correctly", () => {
      const result = resop2(
        input2,
        (vals) => {
          return {
            output: vals.val1 > "b" ? 100 : undefined,
          };
        },
        devices
      );

      expect(result.output).toEqual({ b2: "unset", b3: 100, $res: true });
    });
  });

  describe("when different properties are defined for different breakpoints for nested object", () => {
    test("unset is set correctly", () => {
      const result = resop2(
        input2,
        (vals) => {
          if (vals.val1 > "b") {
            return {
              Nested: {
                Output: {
                  output1: "greater-than-b",
                },
              },
            };
          } else {
            return {
              Nested: {
                Output: {
                  output2: "lower-than-b",
                },
              },
            };
          }
        },
        devices
      );

      expect(result.Nested.Output.output1).toEqual({
        b2: "unset",
        b3: "greater-than-b",
        $res: true,
      });
      expect(result.Nested.Output.output2).toEqual({
        b2: "lower-than-b",
        b3: "unset",
        $res: true,
      });
    });
  });

  describe("when output value is defined for some breakpoints only for nested object", () => {
    test("unset is set correctly", () => {
      const result = resop2(
        input2,
        (vals) => {
          return {
            Nested: {
              Output: {
                output: vals.val1 > "b" ? 100 : undefined,
              },
            },
          };
        },
        devices
      );

      expect(result.Nested.Output.output).toEqual({
        b2: "unset",
        b3: 100,
        $res: true,
      });
    });
  });

  describe("when output structure has nesting that appears only on some breakpoints", () => {
    const result = resop2(
      input2,
      (vals) => {
        if (vals.val1 > "b") {
          return {
            Nested: {
              output: vals.val1,
            },
          };
        }

        return {};
      },
      devices
    );

    test("works", () => {
      expect(result.Nested?.output).toMatchObject({
        $res: true,
        b2: "unset",
        b3: "c",
        b4: "d",
      });
    });
  });

  test("fonts with nested media", () => {
    const ComponentWithFontDefinition: InternalRenderableComponentDefinition = {
      id: "$ComponentWithFont",
      schema: [
        {
          prop: "val",
          type: "text",
        },
        {
          prop: "fontVal",
          type: "font",
        },
      ],
      tags: [],
    };

    const b1Font = {
      fontSize: 12,
      "@media": {
        fontSize: 11,
      },
    };

    const b4Font = {
      fontSize: 50,
      "@media": {
        fontSize: 49,
      },
    };

    const input = {
      val: "test",
      fontVal: {
        b1: b1Font,
        b2: b4Font,
        b3: b4Font,
        b4: b4Font,
        b5: b4Font,
        $res: true,
      },
    };

    const result = resop2(
      input,
      (vals) => {
        return {
          Box1: {
            xfont: vals.fontVal,
            standard: vals.fontVal,
          },
        };
      },
      devices,
      ComponentWithFontDefinition
    );

    expect(result.Box1.xfont).toMatchObject({
      $res: true,
      b1: {
        fontSize: 12,
        "@media": {
          fontSize: 11,
        },
      },
      b2: {
        fontSize: 50,
        "@media": {
          fontSize: 49,
        },
      },
    });

    expect(result.Box1.standard).toMatchObject({
      fontSize: {
        $res: true,
        b1: 12,
        b2: 50,
      },
      "@media": {
        fontSize: {
          $res: true,
          b1: 11,
          b2: 49,
        },
      },
    });
  });

  test("subcomponents fields are scalarized only for schema props, item fields are scalarized all (schema prop or not)", () => {
    const callback = jest.fn((vals) => {
      return {};
    });

    const responsiveValue = {
      $res: true,
      b1: 10,
      b2: 40,
      b3: 40,
      b4: 40,
      b5: 40,
    };

    resop2(
      {
        Card: [
          {
            _template: "$SomeCard",
            someProp: responsiveValue,
          },
        ],
        Cards: [
          {
            _template: "$SomeCard",
            someProp: responsiveValue,
            schemaItemProp: responsiveValue,
          },
        ],
      },
      callback,
      devices,
      testComponentDefinition
    );

    expect(callback).toBeCalledTimes(5);

    expect(callback.mock.calls[0][0].Card[0].someProp).toEqual(responsiveValue);
    expect(callback.mock.calls[0][0].Cards[0].someProp).toEqual(10);
    expect(callback.mock.calls[0][0].Cards[0].schemaItemProp).toBe(10);

    expect(callback.mock.calls[1][0].Card[0].someProp).toEqual(responsiveValue);
    expect(callback.mock.calls[1][0].Cards[0].someProp).toEqual(40);
    expect(callback.mock.calls[1][0].Cards[0].schemaItemProp).toBe(40);

    expect(callback.mock.calls[2][0].Card[0].someProp).toEqual(responsiveValue);
    expect(callback.mock.calls[2][0].Cards[0].someProp).toEqual(40);
    expect(callback.mock.calls[2][0].Cards[0].schemaItemProp).toBe(40);

    expect(callback.mock.calls[3][0].Card[0].someProp).toEqual(responsiveValue);
    expect(callback.mock.calls[3][0].Cards[0].someProp).toEqual(40);
    expect(callback.mock.calls[3][0].Cards[0].schemaItemProp).toBe(40);

    expect(callback.mock.calls[4][0].Card[0].someProp).toEqual(responsiveValue);
    expect(callback.mock.calls[4][0].Cards[0].someProp).toEqual(40);
    expect(callback.mock.calls[4][0].Cards[0].schemaItemProp).toBe(40);
  });

  describe("__props, subcomponents", () => {
    describe("__props", () => {
      test("incorrect __props should throw", () => {
        expect(() =>
          resop2(
            input2,
            () => {
              return {
                __props: "xxx",
              };
            },
            devices,
            testComponentDefinition
          )
        ).toThrowErrorMatchingInlineSnapshot(
          `"__props must be object, it is not for breakpoint: b1"`
        );
      });

      test("if prop for each breakpoint is undefined, then it's OK", () => {
        const result = resop2(
          input2,
          () => {
            return {
              __props: {
                myProp: undefined,
              },
            };
          },
          devices,
          testComponentDefinition
        );

        expect(result.__props.myProp).toBeUndefined();
      });

      test("if prop is defined for some breakpoints and not for others, throw", () => {
        expect(() =>
          resop2(
            input2,
            (values, breakpointIndex) => {
              return {
                __props: {
                  myProp: breakpointIndex === "b1" ? undefined : "xxx",
                },
              };
            },
            devices,
            testComponentDefinition
          )
        ).toThrowErrorMatchingInlineSnapshot(
          `"resop: undefined value (breakpoints: b1) for __props.myProp. Template: $TestComponent"`
        );
      });

      test("props are normalized", () => {
        const result = resop2(
          input2,
          (values, breakpointIndex) => {
            return {
              __props: {
                myProp: breakpointIndex === "b1" ? "yyy" : "xxx",
              },
            };
          },
          devices,
          testComponentDefinition
        );
        expect(result.__props.myProp).toEqual({
          $res: true,
          b1: "yyy",
          b2: "xxx",
        });
      });
    });

    describe("subcomponents", () => {
      test("incorrect subcomponent value should throw", () => {
        expect(() =>
          resop2(
            input2,
            () => {
              return {
                Card: "xxx",
              };
            },
            devices,
            testComponentDefinition
          )
        ).toThrowErrorMatchingInlineSnapshot(
          `"resop error: component must be undefined or an object, it is not for device b1 and prop Card. Template: $TestComponent"`
        );
      });

      test("if Component prop for each breakpoint is undefined, then it's OK", () => {
        const result = resop2(
          input2,
          () => {
            return {
              Card: {
                myProp: undefined,
              },
            };
          },
          devices,
          testComponentDefinition
        );

        expect(result.Card.myProp).toBeUndefined();
      });

      test("if component prop is defined for some breakpoints and not for others, throw", () => {
        expect(() =>
          resop2(
            input2,
            (values, breakpointIndex) => {
              return {
                Card: {
                  myProp: breakpointIndex === "b1" ? undefined : "xxx",
                },
              };
            },
            devices,
            testComponentDefinition
          )
        ).toThrowErrorMatchingInlineSnapshot(
          `"resop: undefined value (breakpoints b1) for Card.myProp. Template: $TestComponent"`
        );
      });

      test("component props are not normalized", () => {
        const result = resop2(
          input2,
          (values, breakpointIndex) => {
            return {
              Card: {
                myProp: breakpointIndex === "b1" ? "yyy" : "xxx",
              },
            };
          },
          devices,
          testComponentDefinition
        );
        expect(result.Card.myProp).toEqual({
          $res: true,
          b1: "yyy",
          b2: "xxx",
          b3: "xxx",
          b4: "xxx",
          b5: "xxx",
        });
      });
    });

    describe("item props", () => {
      const input = {
        Cards: [
          { _template: "$Test" },
          { _template: "$Test" },
          { _template: "$Test" },
        ],
      };

      test("non-array item props should throw", () => {
        expect(() =>
          resop2(
            input,
            () => {
              return {
                Cards: { itemProps: "incorrect value" },
              };
            },
            devices,
            testComponentDefinition
          )
        ).toThrowErrorMatchingInlineSnapshot(
          `"resop error: item props must be undefined or an array (Cards). Template: $TestComponent"`
        );
      });

      describe("length verification", () => {
        test("inconsistent lengths should throw", () => {
          expect(() =>
            resop2(
              input,
              (values, breakpointIndex) => {
                return {
                  Cards: {
                    itemProps: breakpointIndex === "b1" ? [{}, {}] : [{}],
                  },
                };
              },
              devices,
              testComponentDefinition
            )
          ).toThrowErrorMatchingInlineSnapshot(
            `"resop: incompatible item props arrays length for component: Cards. Template: $TestComponent"`
          );
        });

        test("item props array length unequal to number of items - should throw", () => {
          expect(() =>
            resop2(
              input,
              (values, breakpointIndex) => {
                return {
                  Cards: { itemProps: [{}, {}, {}, {}] },
                };
              },
              devices,
              testComponentDefinition
            )
          ).toThrowErrorMatchingInlineSnapshot(
            `"resop: item props arrays length incompatible with items length for component: Cards. Template: $TestComponent"`
          );
        });

        test("if item props array is empty, then item props array should have one element", () => {
          const result: any = resop2(
            { Cards: [] },
            (values, breakpointIndex) => {
              return {
                Cards: { itemProps: [{ test: "xxx" }] },
              };
            },
            devices,
            testComponentDefinition
          );

          expect(result.Cards.itemProps[0].test).toEqual({
            $res: true,
            b1: "xxx",
            b2: "xxx",
            b3: "xxx",
            b4: "xxx",
            b5: "xxx",
          });
        });

        test("non-existing itemProps are OK", () => {
          const result: any = resop2(
            input,
            (values, breakpointIndex) => {
              return {
                Cards: {},
              };
            },
            devices,
            testComponentDefinition
          );

          expect(result.Cards.itemProps).toEqual([]);
        });
      });

      test("incorrect item props values should throw", () => {
        expect(() =>
          resop2(
            input,
            () => {
              return {
                Cards: { itemProps: ["xxx", {}, {}] },
              };
            },
            devices,
            testComponentDefinition
          )
        ).toThrowErrorMatchingInlineSnapshot(
          `"resop error: item in itemProps array must be object (Cards.itemProps.0). Template: $TestComponent"`
        );
      });

      test("if item prop for each breakpoint is undefined, then it's OK", () => {
        const result: any = resop2(
          input,
          () => {
            return {
              Cards: {
                itemProps: [
                  { xxx: undefined },
                  { xxx: undefined },
                  { xxx: undefined },
                ],
              },
            };
          },
          devices,
          testComponentDefinition
        );

        expect(result.Cards.itemProps).toEqual([{}, {}, {}]);
      });

      test("if item prop is defined for some breakpoints and not for others, throw", () => {
        expect(() =>
          resop2(
            input,
            (values, breakpointIndex) => {
              const item = {
                prop: breakpointIndex === "b1" ? undefined : "xxx",
              };

              return {
                Cards: {
                  itemProps: [item, item, item],
                },
              };
            },
            devices,
            testComponentDefinition
          )
        ).toThrowErrorMatchingInlineSnapshot(
          `"resop: undefined value (breakpoints b1) for Cards.0.prop. Template: $TestComponent"`
        );
      });

      test("component props are not normalized", () => {
        const resultItem = {
          prop: {
            $res: true,
            b1: "yyy",
            b2: "xxx",
            b3: "xxx",
            b4: "xxx",
            b5: "xxx",
          },
        };

        const result = resop2(
          input,
          (values, breakpointIndex) => {
            const item = {
              prop: breakpointIndex === "b1" ? "yyy" : "xxx",
            };

            return {
              Cards: {
                itemProps: [item, item, item],
              },
            };
          },
          devices,
          testComponentDefinition
        );

        expect(result.Cards.itemProps).toEqual([
          resultItem,
          resultItem,
          resultItem,
        ]);
      });
    });
  });

  describe("external values shouldn't be modified", () => {
    test("potential 'responsive structures' inside of external data are ignored by resop", () => {
      const callback = jest.fn((vals) => {
        return {};
      });

      // This value is external value, but on purpose it is responsive to check whether resop will ignore it anyway!
      const customTypeValue = {
        $res: true,
        b1: {
          src: "image-mobile",
        },
        b4: {
          src: "image-desktop",
        },
      };

      resop2(
        {
          ...input2,
          schemaCustomTypeProp: customTypeValue,
        },
        callback,
        devices,
        testComponentDefinition
      );

      expect(callback).toBeCalledTimes(5);
      expect(callback.mock.calls[0][0].schemaCustomTypeProp).toEqual(
        customTypeValue
      );
      expect(callback.mock.calls[1][0].schemaCustomTypeProp).toEqual(
        customTypeValue
      );
      expect(callback.mock.calls[2][0].schemaCustomTypeProp).toEqual(
        customTypeValue
      );
      expect(callback.mock.calls[3][0].schemaCustomTypeProp).toEqual(
        customTypeValue
      );
      expect(callback.mock.calls[4][0].schemaCustomTypeProp).toEqual(
        customTypeValue
      );
    });

    test("external values that have internal cycles don't fall into infinite recursion", () => {
      const callback = jest.fn((vals) => {
        return {};
      });

      const customTypeValue: Record<string, any> = {};
      customTypeValue.test = customTypeValue; // internal loop

      resop2(
        {
          ...input2,
          customTypeProp: customTypeValue,
        },
        callback,
        devices,
        testComponentDefinition
      );

      expect(true).toBe(true); // if resop2 falls into infinite loop it will never get here
    });
  });
});
