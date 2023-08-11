import { testCompilationContext } from "../../test-utils";
import { CompiledComponentStylesToolkit } from "../../types";
import { $sectionWrapperStyles } from "./SectionWrapper.styles";
import { SectionWrapperCompiledValues } from "./SectionWrapper.types";

const basicSectionWrapper: SectionWrapperCompiledValues = {
  headerMode: "none",
  containerMargin: "100px",
  containerMaxWidth: "none",
  escapeMargin: false,
  Background__: [],
  Component: [
    {
      _template: "$BannerCard",
    },
  ],
  hide: false,
  layout1Stack: "left",
  layout2Stacks: "left-right",
  layout2StacksVerticalAlign: "center",
  headerStacksGap: "12px",
  headerSectionGap: "12px",
  footerSectionGap: "12px",
  HeaderStack: [],
  HeaderSecondaryStack: [],
  padding: "24px",
};

const params: CompiledComponentStylesToolkit = {
  $width: 1920,
  $widthAuto: false,
  compilationContext: testCompilationContext,
  device: {
    id: "xl",
    w: 1920,
    h: 900,
    breakpoint: null,
  },
};

describe("section wrapper Component parameters", () => {
  describe("non grid sections", () => {
    describe("no max width", () => {
      test("escapeMargin = false", () => {
        const result: any = $sectionWrapperStyles(basicSectionWrapper, params);
        expect(result.Component.$width).toBe(1920 - 100 - 100);
        expect(result.Component.edgeLeft).toBe(false);
        expect(result.Component.edgeRight).toBe(false);
        expect(result.Component.edgeLeftMargin).toBe(null);
        expect(result.Component.edgeRightMargin).toBe(null);
      });

      test("escapeMargin = true", () => {
        const result: any = $sectionWrapperStyles(
          { ...basicSectionWrapper, escapeMargin: true },
          params
        );
        expect(result.Component.$width).toBe(1920);
        expect(result.Component.edgeLeft).toBe(true);
        expect(result.Component.edgeRight).toBe(true);
        expect(result.Component.edgeLeftMargin).toBe("100px");
        expect(result.Component.edgeRightMargin).toBe("100px");
      });
    });

    describe("max width", () => {
      test("escapeMargin = false, max width larger than width", () => {
        const result: any = $sectionWrapperStyles(
          {
            ...basicSectionWrapper,
            escapeMargin: false,
            containerMaxWidth: "2000",
          },
          params
        );
        expect(result.Component.$width).toBe(1920 - 100 - 100);
        expect(result.Component.edgeLeft).toBe(false);
        expect(result.Component.edgeRight).toBe(false);
        expect(result.Component.edgeLeftMargin).toBe(null);
        expect(result.Component.edgeRightMargin).toBe(null);
      });
      test("escapeMargin = false, max width smaller than width", () => {
        const result: any = $sectionWrapperStyles(
          {
            ...basicSectionWrapper,
            escapeMargin: false,
            containerMaxWidth: "800",
          },
          params
        );
        expect(result.Component.$width).toBe(800);
        expect(result.Component.edgeLeft).toBe(false);
        expect(result.Component.edgeRight).toBe(false);
        expect(result.Component.edgeLeftMargin).toBe(null);
        expect(result.Component.edgeRightMargin).toBe(null);
      });
      test("escapeMargin = true, max width larger than width", () => {
        const result: any = $sectionWrapperStyles(
          {
            ...basicSectionWrapper,
            escapeMargin: true,
            containerMaxWidth: "2000",
          },
          params
        );
        expect(result.Component.$width).toBe(1920);
        expect(result.Component.edgeLeft).toBe(true);
        expect(result.Component.edgeRight).toBe(true);
        expect(result.Component.edgeLeftMargin).toBe("100px");
        expect(result.Component.edgeRightMargin).toBe("100px");
      });
      test("escapeMargin = true, max width smaller than width", () => {
        const result: any = $sectionWrapperStyles(
          {
            ...basicSectionWrapper,
            escapeMargin: false,
            containerMaxWidth: "800",
          },
          params
        );
        expect(result.Component.$width).toBe(800);
        expect(result.Component.edgeLeft).toBe(false);
        expect(result.Component.edgeRight).toBe(false);
        expect(result.Component.edgeLeftMargin).toBe(null);
        expect(result.Component.edgeRightMargin).toBe(null);
      });
    });
  });

  describe("grid section", () => {
    describe("no max width", () => {
      test("escapeMargin = false", () => {
        const result: any = $sectionWrapperStyles(
          {
            ...basicSectionWrapper,
            escapeMargin: false,
            Component: [{ _template: "$GridCard" }],
          },
          params
        );
        expect(result.Component.$width).toBe(1920);
        expect(result.Component.edgeLeft).toBe(true);
        expect(result.Component.edgeRight).toBe(true);
        expect(result.Component.edgeLeftMargin).toBe("100px");
        expect(result.Component.edgeRightMargin).toBe("100px");
        expect(result.Component.escapeMargin).toBe(false);
        expect(result.Component.maxWidth).toBe(null);
      });

      test("escapeMargin = true", () => {
        const result: any = $sectionWrapperStyles(
          {
            ...basicSectionWrapper,
            escapeMargin: true,
            Component: [{ _template: "$GridCard" }],
          },
          params
        );
        expect(result.Component.$width).toBe(1920);
        expect(result.Component.edgeLeft).toBe(true);
        expect(result.Component.edgeRight).toBe(true);
        expect(result.Component.edgeLeftMargin).toBe("100px");
        expect(result.Component.edgeRightMargin).toBe("100px");
        expect(result.Component.escapeMargin).toBe(true);
        expect(result.Component.maxWidth).toBe(null);
      });
    });

    describe("max width", () => {
      test("escapeMargin = false, max width larger than width", () => {
        const result: any = $sectionWrapperStyles(
          {
            ...basicSectionWrapper,
            Component: [{ _template: "$GridCard" }],
            escapeMargin: false,
            containerMaxWidth: "2000",
          },
          params
        );
        expect(result.Component.$width).toBe(1920);
        expect(result.Component.edgeLeft).toBe(true);
        expect(result.Component.edgeRight).toBe(true);
        expect(result.Component.edgeLeftMargin).toBe("100px");
        expect(result.Component.edgeRightMargin).toBe("100px");
        expect(result.Component.escapeMargin).toBe(false);
        expect(result.Component.maxWidth).toBe(2000);
      });
      test("escapeMargin = false, max width smaller than width", () => {
        const result: any = $sectionWrapperStyles(
          {
            ...basicSectionWrapper,
            Component: [{ _template: "$GridCard" }],
            escapeMargin: false,
            containerMaxWidth: "800",
          },
          params
        );
        expect(result.Component.$width).toBe(1920);
        expect(result.Component.edgeLeft).toBe(true);
        expect(result.Component.edgeRight).toBe(true);
        expect(result.Component.edgeLeftMargin).toBe("100px");
        expect(result.Component.edgeRightMargin).toBe("100px");
        expect(result.Component.escapeMargin).toBe(false);
        expect(result.Component.maxWidth).toBe(800);
      });
      test("escapeMargin = true, max width larger than width", () => {
        const result: any = $sectionWrapperStyles(
          {
            ...basicSectionWrapper,
            Component: [{ _template: "$GridCard" }],
            escapeMargin: true,
            containerMaxWidth: "2000",
          },
          params
        );
        expect(result.Component.$width).toBe(1920);
        expect(result.Component.edgeLeft).toBe(true);
        expect(result.Component.edgeRight).toBe(true);
        expect(result.Component.edgeLeftMargin).toBe("100px");
        expect(result.Component.edgeRightMargin).toBe("100px");
        expect(result.Component.escapeMargin).toBe(true);
        expect(result.Component.maxWidth).toBe(2000);
      });
      test("escapeMargin = true, max width smaller than width", () => {
        const result: any = $sectionWrapperStyles(
          {
            ...basicSectionWrapper,
            Component: [{ _template: "$GridCard" }],
            escapeMargin: true,
            containerMaxWidth: "800",
          },
          params
        );
        expect(result.Component.$width).toBe(1920);
        expect(result.Component.edgeLeft).toBe(true);
        expect(result.Component.edgeRight).toBe(true);
        expect(result.Component.edgeLeftMargin).toBe("100px");
        expect(result.Component.edgeRightMargin).toBe("100px");
        expect(result.Component.escapeMargin).toBe(true);
        expect(result.Component.maxWidth).toBe(800);
      });
    });
  });
});
