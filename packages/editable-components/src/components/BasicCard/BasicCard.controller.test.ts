import { basicCardController } from "./BasicCard.controller";
import { BasicCardCompiledValues } from "./BasicCard.types";

const basicCard: BasicCardCompiledValues = {
  Background: [
    {
      _template: "$image",
    },
  ],

  paddingLeft: "30px",
  paddingRight: "31px",
  paddingTop: "32px",
  paddingBottom: "33px",

  paddingLeftExternal: "10px",
  paddingRightExternal: "11px",

  paddingTopExternal: "12px",
  paddingBottomExternal: "13px",

  position: "top-left",
  edgeMarginProtection: true,

  size: "16:9",
  cornerRadius: "0px",
  enableContent: true,
  Stack: [],
};

describe("basic card controller", () => {
  describe("with background defined", () => {
    test("no escape", () => {
      expect(basicCardController(basicCard)).toMatchObject({
        paddingFields: {
          vertical: { start: "internal", end: "internal" },
          horizontal: { start: "internal", end: "internal" },
        },
        padding: {
          left: "30px",
          right: "31px",
          top: "32px",
          bottom: "33px",
        },
      });
    });

    test("escape left, edge protection", () => {
      expect(
        basicCardController({
          ...basicCard,
          edgeMarginProtection: true,
          edgeLeft: true,
          edgeLeftMargin: "50px",
        })
      ).toMatchObject({
        paddingFields: {
          vertical: { start: "internal", end: "internal" },
          horizontal: { start: null, end: "internal" },
        },
        padding: {
          left: "50px",
          right: "31px",
          top: "32px",
          bottom: "33px",
        },
      });
    });

    test("escape left, no edge protection", () => {
      expect(
        basicCardController({
          ...basicCard,
          edgeLeft: true,
          edgeLeftMargin: "50px",
          edgeMarginProtection: false,
        })
      ).toMatchObject({
        paddingFields: {
          vertical: { start: "internal", end: "internal" },
          horizontal: { start: "internal", end: "internal" },
        },
        padding: {
          left: "30px",
          right: "31px",
          top: "32px",
          bottom: "33px",
        },
      });
    });

    test("escape right, edge protection", () => {
      expect(
        basicCardController({
          ...basicCard,
          edgeRight: true,
          edgeRightMargin: "50px",
        })
      ).toMatchObject({
        paddingFields: {
          vertical: { start: "internal", end: "internal" },
          horizontal: { start: "internal", end: null },
        },
        padding: {
          left: "30px",
          right: "50px",
          top: "32px",
          bottom: "33px",
        },
      });
    });

    test("escape right, no edge protection", () => {
      expect(
        basicCardController({
          ...basicCard,
          edgeRight: true,
          edgeRightMargin: "50px",
          edgeMarginProtection: false,
        })
      ).toMatchObject({
        paddingFields: {
          vertical: { start: "internal", end: "internal" },
          horizontal: { start: "internal", end: "internal" },
        },
        padding: {
          left: "30px",
          right: "31px",
          top: "32px",
          bottom: "33px",
        },
      });
    });

    test("escape right+left, edge protection", () => {
      expect(
        basicCardController({
          ...basicCard,
          edgeRight: true,
          edgeRightMargin: "50px",
          edgeLeft: true,
          edgeLeftMargin: "50px",
        })
      ).toMatchObject({
        paddingFields: {
          vertical: { start: "internal", end: "internal" },
          horizontal: { start: null, end: null },
        },
        padding: {
          left: "50px",
          right: "50px",
          top: "32px",
          bottom: "33px",
        },
      });
    });

    test("escape right+left, no edge protection", () => {
      expect(
        basicCardController({
          ...basicCard,
          edgeRight: true,
          edgeRightMargin: "50px",
          edgeLeft: true,
          edgeLeftMargin: "50px",
          edgeMarginProtection: false,
        })
      ).toMatchObject({
        paddingFields: {
          vertical: { start: "internal", end: "internal" },
          horizontal: { start: "internal", end: "internal" },
        },
        padding: {
          left: "30px",
          right: "31px",
          top: "32px",
          bottom: "33px",
        },
      });
    });
  });

  describe("without background", () => {
    describe("positionContext: floating", () => {
      const theCard: BasicCardCompiledValues = {
        ...basicCard,
        Background: [],
      };

      const theResult = {
        paddingFields: {
          horizontal: { start: null, end: null },
          vertical: { start: null, end: null },
        },
        padding: {
          left: "0px",
          right: "0px",
          top: "0px",
          bottom: "0px",
        },
      };

      test("floating mode by default disables all the paddings", () => {
        expect(basicCardController(theCard)).toMatchObject(theResult);
      });
    });

    describe("top and bottom", () => {
      const theResult = {
        paddingFields: {
          horizontal: { start: "external", end: "external" },
          vertical: { start: "internal", end: "internal" },
        },
        padding: {
          top: "32px",
          bottom: "33px",
          left: "10px",
          right: "11px",
        },
      };

      describe("edge protection", () => {
        const theCard: BasicCardCompiledValues = {
          ...basicCard,
          useExternalPaddingLeft: true,
          useExternalPaddingRight: true,
          edgeTop: true,
          edgeBottom: true,
          edgeLeft: true,
          edgeRight: true,
          Background: [],
        };

        test("no escape", () => {
          expect(basicCardController(theCard)).toMatchObject(theResult);
        });

        test("escape left", () => {
          expect(
            basicCardController({
              ...theCard,
              edgeLeft: true,
              edgeLeftMargin: "50px",
            })
          ).toMatchObject({
            paddingFields: {
              horizontal: { start: null, end: "external" },
              vertical: { start: "internal", end: "internal" },
            },
            padding: {
              ...theResult.padding,
              left: "50px",
            },
          });
        });

        test("escape right", () => {
          expect(
            basicCardController({
              ...theCard,
              edgeRight: true,
              edgeRightMargin: "50px",
            })
          ).toMatchObject({
            paddingFields: {
              horizontal: { start: "external", end: null },
              vertical: { start: "internal", end: "internal" },
            },
            padding: {
              ...theResult.padding,
              right: "50px",
            },
          });
        });

        test("escape left+right", () => {
          expect(
            basicCardController({
              ...theCard,
              edgeRight: true,
              edgeRightMargin: "50px",
              edgeLeft: true,
              edgeLeftMargin: "50px",
            })
          ).toMatchObject({
            paddingFields: {
              horizontal: { start: null, end: null },
              vertical: { start: "internal", end: "internal" },
            },
            padding: {
              ...theResult.padding,
              left: "50px",
              right: "50px",
            },
          });
        });
      });

      describe("no edge protection", () => {
        const theCard: BasicCardCompiledValues = {
          ...basicCard,
          useExternalPaddingLeft: true,
          useExternalPaddingRight: true,
          edgeTop: true,
          edgeBottom: true,
          edgeLeft: true,
          edgeRight: true,
          Background: [],
          edgeMarginProtection: false,
        };

        test("escape left", () => {
          expect(
            basicCardController({
              ...theCard,
              edgeLeft: true,
              edgeLeftMargin: "50px",
            })
          ).toMatchObject({
            paddingFields: {
              horizontal: { start: "internal", end: "external" },
              vertical: { start: "internal", end: "internal" },
            },
            padding: {
              top: "32px",
              bottom: "33px",
              left: "30px",
              right: "11px",
            },
          });
        });

        test("escape right", () => {
          expect(
            basicCardController({
              ...theCard,
              edgeRight: true,
              edgeRightMargin: "50px",
            })
          ).toMatchObject({
            paddingFields: {
              horizontal: { start: "external", end: "internal" },
              vertical: { start: "internal", end: "internal" },
            },
            padding: {
              top: "32px",
              bottom: "33px",
              left: "10px",
              right: "31px",
            },
          });
        });

        test("escape left+right", () => {
          expect(
            basicCardController({
              ...theCard,
              edgeRight: true,
              edgeRightMargin: "50px",
              edgeLeft: true,
              edgeLeftMargin: "50px",
            })
          ).toMatchObject({
            paddingFields: {
              horizontal: { start: "internal", end: "internal" },
              vertical: { start: "internal", end: "internal" },
            },
            padding: {
              top: "32px",
              bottom: "33px",
              left: "30px",
              right: "31px",
            },
          });
        });
      });
    });

    describe("positionContext: left", () => {
      describe.each(["left", "right"])(
        "stack position: %p",
        (stackPosition) => {
          const theCard: BasicCardCompiledValues = {
            ...basicCard,
            Background: [],
            position: `top-${stackPosition}`,

            useExternalPaddingTop: true,
            useExternalPaddingBottom: true,
            edgeTop: true,
            edgeBottom: true,
            edgeLeft: false,
            edgeRight: true,
          };

          test("no escape", () => {
            expect(basicCardController(theCard)).toMatchObject({
              paddingFields: {
                vertical: { start: "external", end: "external" },
                horizontal: { start: null, end: "internal" },
              },
              padding: {
                left: "0px",
                right: "31px",
                top: "12px",
                bottom: "13px",
              },
            });
          });

          test("escape left, margin protection", () => {
            expect(
              basicCardController({
                ...theCard,
                edgeLeft: true,
                edgeLeftMargin: "50px",
                edgeMarginProtection: true,
              })
            ).toMatchObject({
              paddingFields: {
                vertical: { start: "external", end: "external" },
                horizontal: { start: null, end: "internal" },
              },
              padding: {
                left: "50px",
                right: "31px",
                top: "12px",
                bottom: "13px",
              },
            });
          });

          test("escape left, no protection", () => {
            expect(
              basicCardController({
                ...theCard,
                edgeLeft: true,
                edgeLeftMargin: "50px",
                edgeMarginProtection: false,
              })
            ).toMatchObject({
              paddingFields: {
                vertical: { start: "external", end: "external" },
                horizontal: { start: "internal", end: "internal" },
              },
              padding: {
                left: "30px",
                right: "31px",
                top: "12px",
                bottom: "13px",
              },
            });
          });
        }
      );

      describe("stack position: center", () => {
        const theCard: BasicCardCompiledValues = {
          ...basicCard,
          Background: [],
          position: "top-center",

          useExternalPaddingTop: true,
          useExternalPaddingBottom: true,
          edgeTop: true,
          edgeBottom: true,
          edgeLeft: false,
          edgeRight: true,
        };

        test("no escape", () => {
          expect(basicCardController(theCard)).toMatchObject({
            paddingFields: {
              vertical: { start: "external", end: "external" },
              horizontal: { both: "internal" },
            },
            padding: {
              left: "30px",
              right: "30px",
              top: "12px",
              bottom: "13px",
            },
          });
        });

        test("escape left, margin protection", () => {
          expect(
            basicCardController({
              ...theCard,
              edgeLeft: true,
              edgeLeftMargin: "50px",
              edgeMarginProtection: true,
            })
          ).toMatchObject({
            paddingFields: {
              vertical: { start: "external", end: "external" },
              horizontal: { both: null },
            },
            padding: {
              left: "max(50px,0px)",
              right: "max(50px,0px)",
              top: "12px",
              bottom: "13px",
            },
          });
        });

        test("escape left, no protection", () => {
          expect(
            basicCardController({
              ...theCard,
              edgeLeft: true,
              edgeLeftMargin: "50px",
              edgeMarginProtection: false,
            })
          ).toMatchObject({
            paddingFields: {
              vertical: { start: "external", end: "external" },
              horizontal: { both: "internal" },
            },
            padding: {
              left: "30px",
              right: "30px",
              top: "12px",
              bottom: "13px",
            },
          });
        });
      });
    });

    /** RIGHT **/

    describe("positionContext: right", () => {
      describe.each(["left", "right"])(
        "stack position: %s",
        (stackPosition) => {
          const theCard: BasicCardCompiledValues = {
            ...basicCard,
            Background: [],
            position: `top-${stackPosition}`,

            useExternalPaddingTop: true,
            useExternalPaddingBottom: true,
            edgeTop: true,
            edgeBottom: true,
            edgeLeft: true,
            edgeRight: false,
          };

          test("no escape", () => {
            expect(basicCardController(theCard)).toMatchObject({
              paddingFields: {
                vertical: { start: "external", end: "external" },
                horizontal: { start: "internal", end: null },
              },
              padding: {
                left: "30px",
                right: "0px",
                top: "12px",
                bottom: "13px",
              },
            });
          });

          test("escape right, margin protection", () => {
            expect(
              basicCardController({
                ...theCard,
                edgeRight: true,
                edgeRightMargin: "50px",
                edgeMarginProtection: true,
              })
            ).toMatchObject({
              paddingFields: {
                vertical: { start: "external", end: "external" },
                horizontal: { start: "internal", end: null },
              },
              padding: {
                left: "30px",
                right: "50px",
                top: "12px",
                bottom: "13px",
              },
            });
          });

          test("escape right, no margin protection", () => {
            expect(
              basicCardController({
                ...theCard,
                edgeRight: true,
                edgeRightMargin: "50px",
                edgeMarginProtection: false,
              })
            ).toMatchObject({
              paddingFields: {
                vertical: { start: "external", end: "external" },
                horizontal: { start: "internal", end: "internal" },
              },
              padding: {
                left: "30px",
                right: "31px",
                top: "12px",
                bottom: "13px",
              },
            });
          });
        }
      );

      // This test uses center-center, compared to top-center in positionContext: left. It's on purpose to test 2 cases.
      describe("stack position: center-center", () => {
        const theCard: BasicCardCompiledValues = {
          ...basicCard,
          Background: [],
          position: "center-center",

          useExternalPaddingTop: true,
          useExternalPaddingBottom: true,
          edgeTop: true,
          edgeBottom: true,
          edgeLeft: true,
          edgeRight: false,
        };

        test("no escape", () => {
          expect(basicCardController(theCard)).toMatchObject({
            paddingFields: {
              vertical: { both: "external" },
              horizontal: { both: "internal" },
            },
            padding: {
              left: "30px",
              right: "30px",
              top: "12px",
              bottom: "12px",
            },
          });
        });

        test("escape right, margin protection", () => {
          expect(
            basicCardController({
              ...theCard,
              edgeRight: true,
              edgeRightMargin: "50px",
              edgeMarginProtection: true,
            })
          ).toMatchObject({
            paddingFields: {
              vertical: { both: "external" },
              horizontal: { both: null },
            },
            padding: {
              left: "max(0px,50px)",
              right: "max(0px,50px)",
              top: "12px",
              bottom: "12px",
            },
          });
        });

        test("escape right, no protection", () => {
          expect(
            basicCardController({
              ...theCard,
              edgeRight: true,
              edgeRightMargin: "50px",
              edgeMarginProtection: false,
            })
          ).toMatchObject({
            paddingFields: {
              vertical: { both: "external" },
              horizontal: { both: "internal" },
            },
            padding: {
              left: "30px",
              right: "30px",
              top: "12px",
              bottom: "12px",
            },
          });
        });
      });
    });
  });
});
