import React, { useMemo } from "react";
import { createStitches } from "@stitches/core";
import { Devices } from "../types";
import { getBoxStyles } from "./getBoxStyles";

const boxStyles = {
  boxSizing: "border-box",
  minWidth: "0px",
  margin: 0,
  padding: 0,
  border: 0,
  listStyle: "none",
};

const easyblocksStitchesInstances: any[] = [];

export function easyblocksGetCssText() {
  return easyblocksStitchesInstances
    .map((stitches) => stitches.getCssText())
    .join(" ");
}

export function easyblocksGetStyleTag() {
  return (
    <style
      id="stitches"
      dangerouslySetInnerHTML={{ __html: easyblocksGetCssText() }}
    />
  );
}

export function getStitchesInstance() {
  if (easyblocksStitchesInstances.length === 0) {
    easyblocksStitchesInstances.push(createStitches({}));
  }

  return easyblocksStitchesInstances[0];
}

export function generateClassNames(styles: any, devices: Devices) {
  /**
   * Why parse+stringify?
   *
   * Because if we remove them some nested objects in styles (like media queries etc) don't work (although they exist in the object).
   * Why? My bet is this: Stitches uses CSSOM to inject styles. Maybe (for some weird reason, maybe even browser bug) if some part of the object is not in iframe scope but in parent window scope then it's somehow ignored? Absolutely no idea right now, happy this works.
   */
  const correctedStyles = getBoxStyles(
    JSON.parse(JSON.stringify(styles)),
    devices
  );

  const stitches = getStitchesInstance();

  const generateBoxClass = stitches.css(boxStyles);
  const generateClassName = stitches.css(correctedStyles);

  return [generateBoxClass(), generateClassName()];
}

type BoxProps = {
  __compiled: any;
  __name?: string;
  devices: Devices;
  [key: string]: any;
};

const Box = React.forwardRef<HTMLElement, BoxProps>((props, ref) => {
  /**
   * passedProps - the props given in component code like <MyBox data-id="abc" /> (data-id is in passedProps)
   * restProps - the props given by Shopstory (like from actionWrapper)
   *
   * They are merged into "realProps".
   *
   * I know those names sucks, this needs to be cleaned up.
   */

  const { __compiled, __name, passedProps, devices, ...restProps } = props;

  const { __as, ...styles } = __compiled;
  const realProps = { ...restProps, ...passedProps };

  const { as, itemWrappers, className, ...restPassedProps } = realProps;

  const classes = useMemo(() => {
    return generateClassNames(styles, devices);
  }, [styles.__hash]);

  return React.createElement(
    as || __as || "div",
    {
      ref,
      ...restPassedProps,
      className: [...classes, className].filter(Boolean).join(" "),
      "data-testid": __name,
    },
    props.children
  );
});

export function buildBoxes(
  compiled: any,
  name: string,
  actionWrappers: { [key: string]: any },
  meta: any
): any {
  if (Array.isArray(compiled)) {
    return compiled.map((x: any, index: number) =>
      buildBoxes(x, `${name}.${index}`, actionWrappers, meta)
    );
  } else if (typeof compiled === "object" && compiled !== null) {
    if (compiled.__isBox) {
      const boxProps = {
        __compiled: compiled,
        __name: name,
        devices: meta.vars.devices,
      };

      return <Box {...boxProps} />;
    }

    const ret: Record<string, any> = {};

    for (const key in compiled) {
      ret[key] = buildBoxes(compiled[key], key, actionWrappers, meta);
    }
    return ret;
  }
  return compiled;
}

export function defaultTransformProps(props: any, meta: any) {
  const { __styled, ...originalProps } = props;

  const newProps: { [key: string]: any } = buildBoxes(
    props.__styled,
    "",
    {},
    meta
  );

  return {
    ...originalProps,
    ...newProps,
  };
}
