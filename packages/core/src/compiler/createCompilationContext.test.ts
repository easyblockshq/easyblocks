import { EasyblocksBackend } from "../EasyblocksBackend";
import { Config } from "../types";
import { createCompilationContext } from "./createCompilationContext";

const basicConfig: Config = {
  backend: new EasyblocksBackend({ accessToken: "" }),
};

const defaults = {
  xs: {
    id: "xs",
    w: 375,
    h: 667,
    breakpoint: 568,
    label: "Mobile",
  },
  sm: {
    id: "sm",
    w: 667,
    h: 375,
    breakpoint: 768,
    label: "Mobile SM h",
    hidden: true,
  },
  md: {
    id: "md",
    w: 768,
    h: 1024,
    breakpoint: 992,
    label: "Tablet",
  },
  lg: {
    id: "lg",
    w: 1024,
    h: 768,
    breakpoint: 1280,
    label: "TabletH",
    hidden: true,
  },
  xl: {
    id: "xl",
    w: 1366,
    h: 768,
    breakpoint: 1600,
    label: "Desktop",
    isMain: true,
  },
  "2xl": {
    id: "2xl",
    w: 1920,
    h: 920,
    label: "Large desktop",
    breakpoint: null,
  },
};

describe("breakpoints", () => {
  test("no devices outputs default", () => {
    const result = createCompilationContext(
      basicConfig,
      { locale: "en-US" },
      "content"
    );
    expect(result.devices).toHaveLength(6);
    expect(result.devices[0]).toEqual(defaults.xs);
    expect(result.devices[1]).toEqual(defaults.sm);
    expect(result.devices[2]).toEqual(defaults.md);
    expect(result.devices[3]).toEqual(defaults.lg);
    expect(result.devices[4]).toEqual(defaults.xl);
    expect(result.devices[5]).toEqual(defaults["2xl"]);
  });

  test("devices properly overrides properties for selected breakpoints", () => {
    const result = createCompilationContext(
      {
        ...basicConfig,
        devices: {
          xs: {
            w: 300,
            h: 400,
            startsFrom: 10, // should be ignored
          },
          lg: {
            w: 1440,
            h: 800,
            startsFrom: 1300,
          },
        },
      },
      {
        locale: "en-US",
      },
      "content"
    );

    expect(result.devices[0]).toEqual({
      ...defaults.xs,
      w: 300,
      h: 400,
    });

    expect(result.devices[1]).toEqual(defaults.sm);
    expect(result.devices[2]).toEqual({
      ...defaults.md,
      breakpoint: 1300,
    });
    expect(result.devices[3]).toEqual({
      ...defaults.lg,
      w: 1440,
      h: 800,
    });
    expect(result.devices[4]).toEqual(defaults.xl);

    expect(result.devices[5]).toEqual(defaults["2xl"]);
  });
});

describe("max widths", () => {
  test("no devices outputs default", () => {
    const result = createCompilationContext(
      {
        ...basicConfig,
        tokens: {
          containerWidths: [{ id: "small", value: 800 }],
        },
      },
      { locale: "en-US" },
      "content"
    );

    expect(result.theme.containerWidths.small).toMatchObject({
      type: "dev",
      value: "800",
    });
  });
});
