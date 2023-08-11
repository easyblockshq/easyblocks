import { testEditorContext } from "../../../../utils/tests";
import { responsiveFieldController } from "./responsiveFieldController";

const editorContext = { ...testEditorContext };

describe("Responsive field controller", () => {
  test("returns valid controller object for single name field", () => {
    const values = {
      test: {
        $res: true,
        b1: "value",
      },
    };

    const controller = responsiveFieldController({
      field: {
        name: "test",
        component: "responsive2",
        subComponent: "text",
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      formValues: values,
      valuesAfterAuto: values,
      onChange: jest.fn(),
      editorContext,
    });

    expect(controller).toEqual({
      field: {
        name: "test",
        component: "text",
        subComponent: "text",
        format: expect.any(Function),
        parse: expect.any(Function),
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      isResponsive: true,
      isSet: true,
      reset: expect.any(Function),
      toggleOffAuto: expect.any(Function),
    });
  });

  test("returns valid controller object for single name field with non responsive value", () => {
    const values = {
      test: "value",
    };

    const controller = responsiveFieldController({
      field: {
        name: "test",
        component: "responsive2",
        subComponent: "text",
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      formValues: values,
      valuesAfterAuto: values,
      onChange: jest.fn(),
      editorContext,
    });

    expect(controller).toEqual({
      field: {
        name: "test",
        component: "text",
        subComponent: "text",
        format: expect.any(Function),
        parse: expect.any(Function),
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      isResponsive: false,
      isSet: false,
      reset: expect.any(Function),
      toggleOffAuto: expect.any(Function),
    });
  });

  test("returns valid controller object for field with multiple names when all values are the same", () => {
    const values = {
      test1: {
        $res: true,
        b1: "value",
      },
      test2: {
        $res: true,
        b1: "value",
      },
    };

    const controller = responsiveFieldController({
      field: {
        name: ["test1", "test2"],
        component: "responsive2",
        subComponent: "text",
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      formValues: values,
      valuesAfterAuto: values,
      onChange: jest.fn(),
      editorContext,
    });

    expect(controller).toEqual({
      field: {
        name: ["test1", "test2"],
        component: "text",
        subComponent: "text",
        format: expect.any(Function),
        parse: expect.any(Function),
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      isResponsive: true,
      isSet: true,
      reset: expect.any(Function),
      toggleOffAuto: expect.any(Function),
    });
  });

  test("returns valid controller object for field with multiple names when not every value set", () => {
    const values = {
      test1: {
        $res: true,
        b1: "value",
      },
      test2: {
        $res: true,
      },
    };

    const controller = responsiveFieldController({
      field: {
        name: ["test1", "test2"],
        component: "responsive2",
        subComponent: "text",
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      formValues: values,
      valuesAfterAuto: values,
      onChange: jest.fn(),
      editorContext,
    });

    expect(controller).toEqual({
      field: {
        name: ["test1", "test2"],
        component: "text",
        subComponent: "text",
        format: expect.any(Function),
        parse: expect.any(Function),
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      isResponsive: true,
      isSet: false,
      reset: expect.any(Function),
      toggleOffAuto: expect.any(Function),
    });
  });

  test("returns valid controller object for single name field when hasAuto is set and value is empty", () => {
    const values = {
      test: {
        $res: true,
      },
    };

    const controller = responsiveFieldController({
      field: {
        name: "test",
        component: "responsive2",
        subComponent: "select",
        hasAuto: true,
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      formValues: values,
      valuesAfterAuto: values,
      onChange: jest.fn(),
      editorContext,
    });

    expect(controller).toEqual({
      field: {
        name: "test",
        component: "select",
        subComponent: "select",
        format: expect.any(Function),
        parse: expect.any(Function),
        schemaProp: {
          type: "string",
          prop: "schema",
        },
        hasAuto: true,
      },
      isResponsive: true,
      isSet: false,
      reset: expect.any(Function),
      toggleOffAuto: expect.any(Function),
    });
  });

  describe("field.format", () => {
    test("returns value at the current breakpoint if no format specified in field", () => {
      const values = {
        test: {
          $res: true,
          b1: "value",
        },
      };

      const controller = responsiveFieldController({
        field: {
          name: "test",
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
        },
        formValues: values,
        valuesAfterAuto: values,
        onChange: jest.fn(),
        editorContext,
      });

      expect(
        controller.field.format!(
          { $res: true, b1: "some value" },
          "test",
          controller.field
        )
      ).toBe("some value");
    });

    /**
     * Commenting out this test case it seems impossible to reach currently.
     */
    // test("returns default value when value at the current breakpoint is empty", () => {
    //   const controller = responsiveFieldController({
    //     field: {
    //       name: "test",
    //       component: "responsive2",
    //       subComponent: "text",
    //       defaultValue: "default",
    //       schemaProp: {
    //         type: "string",
    //         prop: "schema",
    //       },
    //     },
    //     formValues: {
    //       test: { $res: true },
    //     },
    //     onChange: jest.fn(),
    //     editorContext,
    //   });
    //
    //   expect(
    //     controller.field.format!({ $res: true }, "test", controller.field)
    //   ).toBe("default");
    // });

    test("returns null for select sub component when if value at the current breakpoint is empty and hasAuto is set", () => {
      const values = {
        test: { $res: true, b1: "value", b3: "some value" },
      };

      const controller = responsiveFieldController({
        field: {
          name: "test",
          component: "responsive2",
          subComponent: "select",
          hasAuto: true,
          schemaProp: {
            type: "string",
            prop: "schema",
          },
        },
        formValues: values,
        valuesAfterAuto: values,
        onChange: jest.fn(),
        editorContext: { ...editorContext, breakpointIndex: "b2" },
      });

      expect(
        controller.field.format!(
          { $res: true, b3: "some value" },
          "test",
          controller.field
        )
      ).toBe(null);
    });

    test("returns value at the current breakpoint formatted using the format from field if specified", () => {
      const controller = responsiveFieldController({
        field: {
          name: "test",
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
          format: (value: any) => value.b1.ref,
        },
        formValues: {},
        valuesAfterAuto: {},
        onChange: jest.fn(),
        editorContext,
      });

      expect(
        controller.field.format!(
          { $res: true, b1: { ref: "ref", value: "value" } },
          "test",
          controller.field
        )
      ).toBe("ref");
    });
  });

  describe("field.parse", () => {
    test("returns value at the current breakpoint if no parse specified in field", () => {
      const controller = responsiveFieldController({
        field: {
          name: "test",
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
        },
        formValues: {},
        valuesAfterAuto: {},
        onChange: jest.fn(),
        editorContext,
      });

      expect(
        controller.field.parse!(
          { $res: true, b1: "some value" },
          "test",
          controller.field
        )
      ).toEqual({ $res: true, b1: "some value" });
    });

    test("returns value at the current breakpoint parsed using the parse from field if specified", () => {
      const values = {
        test: {
          $res: true,
          b1: "value",
        },
      };

      const controller = responsiveFieldController({
        field: {
          name: "test",
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
          parse: (value: any) => ({
            ref: "ref",
            value: value.b1.b1,
          }),
        },
        formValues: values,
        valuesAfterAuto: values,
        onChange: jest.fn(),
        editorContext,
      });

      expect(
        controller.field.parse!(
          { $res: true, b1: "value" },
          "test",
          controller.field
        )
      ).toEqual({
        ref: "ref",
        value: "value",
      });
    });
  });

  describe("reset", () => {
    test("resets value of field for current breakpoint when value is defined for more than one breakpoint", () => {
      const testFormValues = {
        test: {
          $res: true,
          b3: "value",
          b4: "other value",
        },
      };

      const onChangeMock = jest.fn();

      const controller = responsiveFieldController({
        field: {
          name: "test",
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
        },
        formValues: testFormValues,
        valuesAfterAuto: testFormValues,
        onChange: onChangeMock,
        editorContext: { ...editorContext, breakpointIndex: "b4" },
      });

      controller.reset();

      expect(onChangeMock).toHaveBeenCalledWith([{ $res: true, b3: "value" }]);
    });

    test("resets value of multiple fields for current breakpoint when value is defined for more than one breakpoint", () => {
      const onChangeMock = jest.fn();

      const values = {
        test1: {
          $res: true,
          b3: "value1",
          b4: "other value1",
        },
        test2: {
          $res: true,
          b3: "value2",
          b4: "other value2",
        },
      };

      const controller = responsiveFieldController({
        field: {
          name: ["test1", "test2"],
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
        },
        formValues: values,
        valuesAfterAuto: values,
        onChange: onChangeMock,
        editorContext: { ...editorContext, breakpointIndex: "b4" },
      });

      controller.reset();

      expect(onChangeMock).toHaveBeenCalledWith([
        { $res: true, b3: "value1" },
        { $res: true, b3: "value2" },
      ]);
    });

    test("resets value of multiple fields for current breakpoint when value is defined only for one breakpoint", () => {
      const onChangeMock = jest.fn();

      const values = {
        test1: {
          $res: true,
          b1: "value",
        },
        test2: {
          $res: true,
          b1: "value",
        },
      };

      const controller = responsiveFieldController({
        field: {
          name: ["test1", "test2"],
          defaultValue: "default",
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
        },
        formValues: values,
        valuesAfterAuto: values,
        onChange: onChangeMock,
        editorContext,
      });

      controller.reset();

      expect(onChangeMock).toHaveBeenCalledWith(["default", "default"]);
    });

    test("resets value of field for current breakpoint when value is defined only for one breakpoint", () => {
      const onChangeMock = jest.fn();

      const values = {
        test: {
          $res: true,
          b1: "value",
        },
      };

      const controller = responsiveFieldController({
        field: {
          name: "test",
          defaultValue: "default",
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
        },
        formValues: values,
        valuesAfterAuto: values,
        onChange: onChangeMock,
        editorContext,
      });

      controller.reset();

      expect(onChangeMock).toHaveBeenCalledWith(["default"]);
    });
  });

  describe("toggleOffAuto", () => {
    test("toggles off auto value and sets auto value", () => {
      const onChangeMock = jest.fn();

      const values = {
        test: {
          $res: true,
          b4: "other value",
        },
      };

      const valuesAfterAuto = {
        test: {
          $res: true,
          b3: "auto value",
          b4: "other value",
        },
      };

      const controller = responsiveFieldController({
        field: {
          name: "test",
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
        },
        formValues: values,
        valuesAfterAuto: valuesAfterAuto,
        onChange: onChangeMock,
        editorContext: { ...editorContext, breakpointIndex: "b3" },
      });

      controller.toggleOffAuto();

      expect(onChangeMock).toHaveBeenCalledWith([
        { $res: true, b3: "auto value", b4: "other value" },
      ]);
    });

    test("toggles off auto value and sets closest value if auto is undefined", () => {
      const onChangeMock = jest.fn();

      const values = {
        test: {
          $res: true,
          b4: "other value",
        },
      };

      const valuesAfterAuto = {
        test: {
          $res: true,
          b1: "auto value",
          b2: "auto value",
          b3: "auto value",
          b4: "other value",
          b5: "other value",
        },
      };

      const controller = responsiveFieldController({
        field: {
          name: "test",
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
        },
        formValues: values,
        valuesAfterAuto: valuesAfterAuto,
        onChange: onChangeMock,
        editorContext: { ...editorContext, breakpointIndex: "b2" },
      });

      controller.toggleOffAuto();

      expect(onChangeMock).toHaveBeenCalledWith([
        { $res: true, b2: "auto value", b4: "other value" },
      ]);
    });

    test("toggles off auto value and sets value auto value for field with multiple name", () => {
      const onChangeMock = jest.fn();

      const values = {
        test1: {
          $res: true,
          b4: "other value",
        },
        test2: {
          $res: true,
          b4: "other value",
        },
      };

      const valuesAfterAuto = {
        test1: {
          $res: true,
          b3: "auto value",
          b4: "other value",
        },
        test2: {
          $res: true,
          b3: "auto value",
          b4: "other value",
        },
      };

      const controller = responsiveFieldController({
        field: {
          name: ["test1", "test2"],
          component: "responsive2",
          subComponent: "text",
          schemaProp: {
            type: "string",
            prop: "schema",
          },
        },
        formValues: values,
        valuesAfterAuto: valuesAfterAuto,
        onChange: onChangeMock,
        editorContext: { ...editorContext, breakpointIndex: "b3" },
      });

      controller.toggleOffAuto();

      expect(onChangeMock).toHaveBeenCalledWith([
        { $res: true, b3: "auto value", b4: "other value" },
        { $res: true, b3: "auto value", b4: "other value" },
      ]);
    });
  });

  test("toggles off auto value and sets value from higher breakpoint for field with multiple name when values are mixed", () => {
    const onChangeMock = jest.fn();

    const values = {
      test1: {
        $res: true,
        b4: "other value",
      },
      test2: {
        $res: true,
        b4: "another value",
      },
    };

    const valuesAfterAuto = {
      test1: {
        $res: true,
        b1: "other value",
        b2: "other value",
        b3: "other value",
        b4: "other value",
        b5: "other value",
      },
      test2: {
        $res: true,
        b1: "another value",
        b2: "another value",
        b3: "another value",
        b4: "another value",
        b5: "another value",
      },
    };

    const controller = responsiveFieldController({
      field: {
        name: ["test1", "test2"],
        component: "responsive2",
        subComponent: "text",
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      formValues: values,
      valuesAfterAuto: valuesAfterAuto,
      onChange: onChangeMock,
      editorContext: { ...editorContext, breakpointIndex: "b3" },
    });

    controller.toggleOffAuto();

    expect(onChangeMock).toHaveBeenCalledWith([
      { $res: true, b3: "other value", b4: "other value" },
      { $res: true, b3: "other value", b4: "another value" },
    ]);
  });

  test("toggles off auto value and sets auto value for field with multiple name when one value is set", () => {
    const onChangeMock = jest.fn();

    const values = {
      test1: {
        $res: true,
        b4: "other value",
      },
      test2: {
        $res: true,
        b3: "another value",
        b4: "another value",
      },
    };

    const controller = responsiveFieldController({
      field: {
        name: ["test1", "test2"],
        component: "responsive2",
        subComponent: "text",
        schemaProp: {
          type: "string",
          prop: "schema",
        },
      },
      formValues: values,
      valuesAfterAuto: values,
      onChange: onChangeMock,
      editorContext: { ...editorContext, breakpointIndex: "b3" },
    });

    controller.toggleOffAuto();

    expect(onChangeMock).toHaveBeenCalledWith([
      { $res: true, b3: "another value", b4: "other value" },
      { $res: true, b3: "another value", b4: "another value" },
    ]);
  });
});
