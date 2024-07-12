import { assertDefined } from "@easyblocks/utils";
import { InternalRenderableComponentDefinition } from "../_internals";
import { resop2 } from "./resop";
import {
  Devices,
  NoCodeComponentStylesFunctionInput,
  ScalarOrCollection,
} from "../types";
import { buildBox } from "./buildBox";
import CryptoJS from "crypto-js";

const DEFAULT_FONT_VALUES = {
  fontWeight: "initial",
  fontStyle: "initial",
  lineHeight: "initial",
};

export function buildTextRoot(input: {
  values: { font: any; color: any; align: any };
  params: any;
  isEditing: boolean;
  devices: Devices;
  definition: InternalRenderableComponentDefinition;
}) {
  const result = build({
    ...input,
    definition: {
      ...input.definition,
      styles: ({ values }) => {
        return {
          styled: {
            Result: {
              ...DEFAULT_FONT_VALUES,
              ...values.font,
              color: values.color,
              textAlign: values.align,
            },
          },
        };
      },
    },
  });

  return result.props.__styled.Result;
}

export function buildTextPart(input: {
  values: { font: any; color: any };
  params: any;
  isEditing: boolean;
  devices: Devices;
  definition: InternalRenderableComponentDefinition;
}) {
  const result = build({
    ...input,
    definition: {
      ...input.definition,
      styles: ({ values }) => {
        return {
          styled: {
            Result: {
              ...DEFAULT_FONT_VALUES,
              ...values.font,
              color: values.color,
            },
          },
        };
      },
    },
  });

  return result.props.__styled.Result;
}

export function build(input: {
  values: any;
  params: any;
  isEditing: boolean;
  devices: Devices;
  definition: InternalRenderableComponentDefinition;
}) {
  const { values, params, devices, isEditing, definition } = input;

  const { props, components, styled } = resop2(
    { values, params },
    ({ values, params }, breakpointIndex) => {
      if (!definition.styles) {
        return {};
      }

      const device = assertDefined(
        devices.find((device) => device.id === breakpointIndex),
        `Missing device "${breakpointIndex}"`
      );

      const stylesInput: NoCodeComponentStylesFunctionInput = {
        values,
        params,
        isEditing,
        device,
      };

      return definition.styles(stylesInput);
    },
    devices,
    definition
  );

  const styledCompiled: Record<string, any> = {};

  for (const key in styled) {
    let styles: ScalarOrCollection<Record<string, any>> = styled[key];

    if (Array.isArray(styles)) {
      styles = styles.map((v) => {
        return { ...v, __isBox: true };
      });
    } else {
      styles = { ...styles, __isBox: true };
    }

    // If box
    styledCompiled[key] = buildBoxes(styles, devices);
  }

  return { props: { ...props, __styled: styledCompiled }, components };
}

function addStylesHash(styles: Record<PropertyKey, any>) {
  if ("__hash" in styles) {
    delete styles["__hash"];
  }

  const hash = CryptoJS.SHA1(JSON.stringify(styles));
  styles.__hash = hash.toString();
  return styles;
}

function buildBoxes(value: any, devices: Devices): any {
  if (Array.isArray(value)) {
    return value.map((x: any) => buildBoxes(x, devices));
  } else if (typeof value === "object" && value !== null) {
    if (value.__isBox) {
      return addStylesHash(buildBox(value, devices));
    }

    const ret: Record<string, any> = {};
    for (const key in value) {
      ret[key] = buildBoxes(value[key], devices);
    }
    return ret;
  }
  return value;
}
