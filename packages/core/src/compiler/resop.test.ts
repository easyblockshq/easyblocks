import { Devices } from "@easyblocks/core";
import { resop2 } from "./resop";
import { InternalRenderableComponentDefinition } from "./types";
import { ScalarOrCollection } from "../types";

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
        type: "select",
        responsive: true,
        params: { options: ["a", "b", "c", "d", "e", "f", "g", "h"] },
      },
      {
        prop: "schemaVal2",
        type: "select",
        responsive: true,
        params: { options: ["a", "b", "c", "d", "e", "f", "g", "h"] },
      },
      {
        prop: "schemaValSpace",
        type: "space",
      },
      {
        prop: "Card",
        type: "component",
        accepts: ["card"],
      },
      {
        prop: "Cards",
        type: "component-collection",
        accepts: ["card"],
        itemFields: [
          {
            prop: "schemaItemProp",
            type: "select",
            responsive: true,
            params: {
              options: ["a", "b", "c"],
            },
          },
        ],
      },
      {
        prop: "schemaCustomTypeProp",
        type: "customType",
      },
    ],
  };

  const callback: (val: { [key: string]: any }) => { [key: string]: any } = (
    vals
  ) => {
    return {
      styled: {
        Box1: {
          cssVal: `${vals.values.schemaVal1} ${
            vals.values.schemaVal2
          } ${vals.values.justArray.join("")}`,
          ":hover": {
            hoverCssVal: `${vals.values.schemaVal1}-${vals.values.schemaVal2}`,
          },
          justArray: vals.values.justArray,
          justValue: "xxx",
          spaceVal: vals.values.schemaValSpace * 3,
          array: Array(vals.values.schemaValSpace).fill(
            `${vals.values.schemaVal1} ${vals.values.schemaVal2}`
          ),
        },
        Box2: {
          cssVal2: vals.values.schemaVal1.repeat(vals.values.justArray.length),
        },
      },
      components: {
        Card: {
          contextVal: `${vals.values.schemaVal1}-${vals.values.schemaVal2}`,
        },
      },
    };
  };

  // This type only narrows result of `styles.styled` property
  function scalar<T>(
    value: ScalarOrCollection<T>
  ): Exclude<ScalarOrCollection<T>, Array<T>> {
    return value as Exclude<ScalarOrCollection<T>, Array<T>>;
  }

  describe("when output data has all output values for all breakpoints", () => {
    const input = {
      values: {
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
      },
      params: {},
    };

    const result = resop2(input, callback, devices, testComponentDefinition);

    test("properly calculates values with all output values different", () => {
      expect(scalar(result.styled.Box1).cssVal).toEqual({
        b1: "a a abc",
        b2: "b b abc",
        b3: "b c abc",
        b4: "b d abc",
        b5: "b e abc",
        $res: true,
      });
    });

    test("identical values across breakpoints are not array, just a value", () => {
      expect(scalar(result.styled.Box1).justValue).toEqual("xxx");
    });

    test("nesting works", () => {
      expect(result.styled.Box1[":hover"].hoverCssVal).toEqual({
        b1: "a-a",
        b2: "b-b",
        b3: "b-c",
        b4: "b-d",
        b5: "b-e",
        $res: true,
      });
    });

    test("identical arrays across breakpoints keeps being an array (not array of arrays)", () => {
      expect(scalar(result.styled.Box1).justArray).toEqual(["a", "b", "c"]);
    });

    test("properly calculates values with some of output values different (but not al - normalization!) ", () => {
      expect(scalar(result.styled.Box2).cssVal2).toEqual({
        b1: "aaa",
        b2: "bbb",
        $res: true,
      });
    });

    test("properly calculates props for non-Boxes", () => {
      expect(result.components.Card.contextVal).toEqual({
        b1: "a-a",
        b2: "b-b",
        b3: "b-c",
        b4: "b-d",
        b5: "b-e",
        $res: true,
      });
    });

    test("properly calculates space values", () => {
      expect(scalar(result.styled.Box1).spaceVal).toEqual({
        b1: 30,
        b2: 60,
        $res: true,
      });
    });
  });

  const input2 = {
    values: {
      val1: {
        b1: "a",
        b2: "b",
        b3: "c",
        b4: "d",
        b5: "d",
        $res: true,
      },
    },
    params: {},
  };

  describe("when output is undefined for all breakpoints", () => {
    test("output value is undefined scalar", () => {
      const result = resop2(
        input2,
        (vals) => {
          return {
            styled: {
              output: undefined as any,
            },
          };
        },
        devices
      );

      expect(result.styled.output).toBe("unset");
    });
  });

  describe("when output is null for all breakpoints", () => {
    test("output value is null scalar", () => {
      const result = resop2(
        input2,
        () => {
          return {
            styled: {
              output: null as any,
            },
          };
        },
        devices
      );

      expect(result.styled.output).toBe("unset");
    });
  });

  describe("when different properties are defined for different breakpoints", () => {
    test("unset is set correctly", () => {
      const result = resop2(
        input2,
        (vals) => {
          if (vals.values.val1 > "b") {
            return {
              styled: {
                output1: "greater-than-b",
              } as any,
            };
          } else {
            return {
              styled: {
                output2: "lower-than-b" as any,
              },
            };
          }
        },
        devices
      );

      expect(result.styled.output1).toEqual({
        b2: "unset",
        b3: "greater-than-b",
        $res: true,
      });
      expect(result.styled.output2).toEqual({
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
            styled: {
              output: vals.values.val1 > "b" ? 100 : (undefined as any),
            },
          };
        },
        devices
      );

      expect(result.styled.output).toEqual({
        b2: "unset",
        b3: 100,
        $res: true,
      });
    });
  });

  describe("when different properties are defined for different breakpoints for nested object", () => {
    test("unset is set correctly", () => {
      const result = resop2(
        input2,
        (vals) => {
          if (vals.values.val1 > "b") {
            return {
              styled: {
                Nested: {
                  Output: {
                    output1: "greater-than-b",
                  },
                },
              },
            };
          } else {
            return {
              styled: {
                Nested: {
                  Output: {
                    output2: "lower-than-b",
                  },
                },
              },
            };
          }
        },
        devices
      );

      expect(scalar(result.styled.Nested).Output.output1).toEqual({
        b2: "unset",
        b3: "greater-than-b",
        $res: true,
      });
      expect(scalar(result.styled.Nested).Output.output2).toEqual({
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
            styled: {
              Nested: {
                Output: {
                  output: vals.values.val1 > "b" ? 100 : undefined,
                },
              },
            },
          };
        },
        devices
      );

      expect(scalar(result.styled.Nested).Output.output).toEqual({
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
        if (vals.values.val1 > "b") {
          return {
            styled: {
              Nested: {
                output: vals.values.val1,
              },
            },
          };
        }

        return {};
      },
      devices
    );

    test("works", () => {
      expect(scalar(result.styled.Nested).output).toMatchObject({
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
      values: {
        val: "test",
        fontVal: {
          b1: b1Font,
          b2: b4Font,
          b3: b4Font,
          b4: b4Font,
          b5: b4Font,
          $res: true,
        },
      },
      params: {},
    };

    const result = resop2(
      input,
      (vals) => {
        return {
          styled: {
            Box1: {
              xfont: vals.values.fontVal,
              standard: vals.values.fontVal,
            },
          },
        };
      },
      devices,
      ComponentWithFontDefinition
    );

    expect(scalar(result.styled.Box1).xfont).toMatchObject({
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

    expect(scalar(result.styled.Box1).standard).toMatchObject({
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
        values: {
          Card: [
            {
              _component: "$SomeCard",
              someProp: responsiveValue,
            },
          ],
          Cards: [
            {
              _component: "$SomeCard",
              someProp: responsiveValue,
              schemaItemProp: responsiveValue,
            },
          ],
        },
        params: {},
      },
      callback,
      devices,
      testComponentDefinition
    );

    expect(callback).toBeCalledTimes(5);

    expect(callback.mock.calls[0][0].values.Card[0].someProp).toEqual(
      responsiveValue
    );
    expect(callback.mock.calls[0][0].values.Cards[0].someProp).toEqual(10);
    expect(callback.mock.calls[0][0].values.Cards[0].schemaItemProp).toBe(10);

    expect(callback.mock.calls[1][0].values.Card[0].someProp).toEqual(
      responsiveValue
    );
    expect(callback.mock.calls[1][0].values.Cards[0].someProp).toEqual(40);
    expect(callback.mock.calls[1][0].values.Cards[0].schemaItemProp).toBe(40);

    expect(callback.mock.calls[2][0].values.Card[0].someProp).toEqual(
      responsiveValue
    );
    expect(callback.mock.calls[2][0].values.Cards[0].someProp).toEqual(40);
    expect(callback.mock.calls[2][0].values.Cards[0].schemaItemProp).toBe(40);

    expect(callback.mock.calls[3][0].values.Card[0].someProp).toEqual(
      responsiveValue
    );
    expect(callback.mock.calls[3][0].values.Cards[0].someProp).toEqual(40);
    expect(callback.mock.calls[3][0].values.Cards[0].schemaItemProp).toBe(40);

    expect(callback.mock.calls[4][0].values.Card[0].someProp).toEqual(
      responsiveValue
    );
    expect(callback.mock.calls[4][0].values.Cards[0].someProp).toEqual(40);
    expect(callback.mock.calls[4][0].values.Cards[0].schemaItemProp).toBe(40);
  });

  describe("props, subcomponents", () => {
    describe("props", () => {
      test("incorrect props should throw", () => {
        expect(() =>
          resop2(
            input2,
            () => {
              return {
                props: "xxx" as any,
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
              props: {
                myProp: undefined,
              },
            };
          },
          devices,
          testComponentDefinition
        );

        expect(result.props.myProp).toBeUndefined();
      });

      test("if prop is defined for some breakpoints and not for others, throw", () => {
        expect(() =>
          resop2(
            input2,
            (values, breakpointIndex) => {
              return {
                props: {
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
              props: {
                myProp: breakpointIndex === "b1" ? "yyy" : "xxx",
              },
            };
          },
          devices,
          testComponentDefinition
        );
        expect(result.props.myProp).toEqual({
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
                components: {
                  Card: "xxx" as any,
                },
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
              components: {
                Card: {
                  myProp: undefined,
                },
              },
            };
          },
          devices,
          testComponentDefinition
        );

        expect(result.components.Card.myProp).toBeUndefined();
      });

      test("if component prop is defined for some breakpoints and not for others, throw", () => {
        expect(() =>
          resop2(
            input2,
            (values, breakpointIndex) => {
              return {
                components: {
                  Card: {
                    myProp: breakpointIndex === "b1" ? undefined : "xxx",
                  },
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
              components: {
                Card: {
                  myProp: breakpointIndex === "b1" ? "yyy" : "xxx",
                },
              },
            };
          },
          devices,
          testComponentDefinition
        );
        expect(result.components.Card.myProp).toEqual({
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
        values: {
          Cards: [
            { _component: "$Test" },
            { _component: "$Test" },
            { _component: "$Test" },
          ],
        },
        params: {},
      };

      test("non-array item props should throw", () => {
        expect(() =>
          resop2(
            input,
            () => {
              return {
                components: {
                  Cards: { itemProps: "incorrect value" } as any,
                },
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
                  components: {
                    Cards: {
                      itemProps: breakpointIndex === "b1" ? [{}, {}] : [{}],
                    },
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
                  components: {
                    Cards: { itemProps: [{}, {}, {}, {}] },
                  },
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
            { values: { Cards: [] }, params: {} },
            (values, breakpointIndex) => {
              return {
                components: {
                  Cards: { itemProps: [{ test: "xxx" }] },
                },
              };
            },
            devices,
            testComponentDefinition
          );

          expect(result.components.Cards.itemProps[0].test).toEqual({
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
                components: {
                  Cards: {},
                },
              };
            },
            devices,
            testComponentDefinition
          );

          expect(result.components.Cards.itemProps).toEqual([]);
        });
      });

      test("incorrect item props values should throw", () => {
        expect(() =>
          resop2(
            input,
            () => {
              return {
                components: {
                  Cards: { itemProps: ["xxx", {}, {}] },
                },
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
              components: {
                Cards: {
                  itemProps: [
                    { xxx: undefined },
                    { xxx: undefined },
                    { xxx: undefined },
                  ],
                },
              },
            };
          },
          devices,
          testComponentDefinition
        );

        expect(result.components.Cards.itemProps).toEqual([{}, {}, {}]);
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
                components: {
                  Cards: {
                    itemProps: [item, item, item],
                  },
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
              components: {
                Cards: {
                  itemProps: [item, item, item],
                },
              },
            };
          },
          devices,
          testComponentDefinition
        );

        expect(result.components.Cards.itemProps).toEqual([
          resultItem,
          resultItem,
          resultItem,
        ]);
      });
    });
  });

  describe("external values shouldn't be modified", () => {
    test("external values that have internal cycles don't fall into infinite recursion", () => {
      const callback = jest.fn((vals) => {
        return {};
      });

      const customTypeValue: Record<string, any> = {};
      customTypeValue.test = customTypeValue; // internal loop

      resop2(
        {
          ...input2,
          values: {
            ...input2.values,
            schemaCustomTypeProp: customTypeValue,
          },
        },
        callback,
        devices,
        testComponentDefinition
      );

      expect(true).toBe(true); // if resop2 falls into infinite loop it will never get here
    });
  });
});
