import {
  Devices,
  ResponsiveValue,
  SchemaProp,
  TrulyResponsiveValue,
} from "@easyblocks/core";
import { responsiveValueForceGet } from "./responsive/responsiveValueGet";
import { responsiveValueNormalize } from "./responsive/responsiveValueNormalize";
import {
  isResourceSchemaProp,
  isSchemaPropActionTextModifier,
  isSchemaPropCollection,
  isSchemaPropComponent,
  isSchemaPropComponentOrComponentCollection,
  isSchemaPropTextModifier,
} from "./schema";
import type {
  InternalComponentDefinition,
  UnwrapResponsiveValue,
} from "./types";

type Config = { [key: string]: any };

/**
 *  Input like: { breakpoint1: sth, breakpoint2: sth, breakpoint3: sth, ... }
 */
function squashCSSResults(
  scalarValues: { [key: string]: any },
  devices: Devices,
  disableNesting?: boolean
): any {
  // Let's check whether scalarValues represent object (for nesting) or a scalar value.
  let objectsNum = 0;
  let noObjectsNum = 0;
  let arraysNum = 0;

  for (const breakpointName in scalarValues) {
    const val = scalarValues[breakpointName];

    if (Array.isArray(val) && !disableNesting) {
      arraysNum++;
    } else if (
      typeof val === "object" &&
      val !== null &&
      !Array.isArray(val) &&
      !disableNesting
    ) {
      objectsNum++;
    } else if (val !== null && val !== undefined) {
      noObjectsNum++;
    }
  }

  // Only one flag can be > 0!!! Otherwise breakpoints return incompatible types
  if (
    (objectsNum > 0 && (noObjectsNum > 0 || arraysNum > 0)) ||
    (arraysNum > 0 && (noObjectsNum > 0 || objectsNum > 0)) ||
    (noObjectsNum > 0 && (arraysNum > 0 || objectsNum > 0))
  ) {
    throw new Error(
      "This shouldn't happen. Mismatched types for different breakpoints!!!"
    );
  }

  if (arraysNum > 0) {
    let biggestArrayLength = 0;

    for (const breakpoint in scalarValues) {
      biggestArrayLength = Math.max(
        biggestArrayLength,
        scalarValues[breakpoint].length
      ); // {...allKeysObject, ...scalarValues[breakpoint]};
    }

    const ret: any[] = [];

    for (let i = 0; i < biggestArrayLength; i++) {
      const newScalarValues: { [key: string]: any } = {};

      for (const breakpoint in scalarValues) {
        let value: any = undefined;

        if (scalarValues[breakpoint]) {
          value = scalarValues[breakpoint][i];
        }

        newScalarValues[breakpoint] = value;
      }

      ret[i] = squashCSSResults(newScalarValues, devices);
    }

    return ret;
  }

  // If object -> recursion
  if (objectsNum > 0) {
    // allKeys is the object that has all the keys from all the scalar configs
    let allKeysObject: { [key: string]: null } = {};

    /**
     * Scalar values are like:
     *
     * {
     *    b1: { a: 10, b: 20 }
     *    b2: { a: 100, c: 300 }
     * }
     */

    for (const breakpoint in scalarValues) {
      allKeysObject = { ...allKeysObject, ...scalarValues[breakpoint] };
    }

    // scalarValues.forEach(scalarConfig => {
    //     allKeysObject = {...allKeysObject, ...scalarConfig};
    // });

    const allKeys = Object.keys(allKeysObject);
    const ret: Config = {};

    /**
     * All keys are like: ['a', 'b', 'c']
     *
     * All used keys across all breakpoints
     */

    allKeys.forEach((key) => {
      const newScalarValues: { [key: string]: any } = {};

      for (const breakpoint in scalarValues) {
        let value: any = undefined;

        if (scalarValues[breakpoint]) {
          value = scalarValues[breakpoint][key];
        }

        newScalarValues[breakpoint] = value;
      }
      /**
       * newScalarValues values are like:
       *
       * For key 'a':
       * {
       *      b1: 10,
       *      b2: 100
       * }
       *
       * For key 'b':
       * {
       *     b1: 20,
       *     b2: undefined
       * }
       *
       */

      /**
       * For fonts we don't want nesting + recursion. We want entire object to be passed to results.
       *
       * Later, renderer must know how to render xfont property :)
       *
       * Otherwise, media query conflicts arise and bad values are set.
       */
      ret[key] = squashCSSResults(newScalarValues, devices, key === "xfont");
    });

    return ret;
  }

  // Here we are sure we have scalar value, not some object to be nested. We must do 2 things:
  // - add "unset" instead of null / undefined
  // - create ResponsiveValue and normalize

  for (const key in scalarValues) {
    if (scalarValues[key] === undefined || scalarValues[key] === null) {
      scalarValues[key] = "unset";
    }
  }

  // Values (non-objects -> no nesting)
  return responsiveValueNormalize({ ...scalarValues, $res: true }, devices);
}

function scalarizeNonComponentProp(
  value: any,
  breakpoint: string,
  devices: Devices,
  schemaProp?: SchemaProp
) {
  if (schemaProp) {
    // This function should never be called with component type
    if (schemaProp.type.startsWith("component")) {
      throw new Error("unreachable");
    }

    // image and video are responsive
    if (schemaProp.type === "image" || schemaProp.type === "video") {
      return responsiveValueForceGet(value, breakpoint);
    }

    // resources should be ignored (not to run scalarise on value which we don't control)
    if (isResourceSchemaProp(schemaProp)) {
      return value;
    }

    // other props are potentially responsive, so let's run responsiveValueGet
    return responsiveValueForceGet(value, breakpoint);
  }

  // for context props we just treat them as responsive
  return responsiveValueForceGet(value, breakpoint);
}

function scalarizeCollection(
  configs: Config[],
  breakpoint: string,
  devices: Devices,
  itemFieldsSchema: SchemaProp[]
) {
  return configs.map((child: any) => {
    const scalarizedChild: Record<string, any> = { ...child };

    for (const [key, value] of Object.entries(scalarizedChild)) {
      const schemaProp = itemFieldsSchema.find((itemFieldSchemaProp) => {
        return itemFieldSchemaProp.prop === key;
      });

      if (schemaProp) {
        scalarizedChild[schemaProp.prop] = scalarizeNonComponentProp(
          value,
          breakpoint,
          devices,
          schemaProp
        );
      } else {
        scalarizedChild[key] = scalarizeNonComponentProp(
          value,
          breakpoint,
          devices
        );
      }
    }

    return scalarizedChild;
  });
}

export function scalarizeConfig(
  config: Config,
  breakpoint: string,
  devices: Devices,
  schema: SchemaProp[]
): any {
  const ret: Record<string, any> = {};

  /**
   * There is a bit of chaos here. To understand what is happening, we must know what "Config" is in context of resop.
   *
   * Config is not a "real" config we're using in the Shopstory in almost all places. We're dealing here with "intermediate compiled config" used during compilation. What it means:
   * 1. It has _template, _id, etc.
   * 2. All the props from schema that are *not* components are compiled and are available.
   * 3. All the props from schema that are components have only _template and _id (exception below)
   * 4. component-collections has child Configs that have item props that are also compiled and are added *to the root level of the config*. They're simply context props. (IMPORTANT! -> localised is already non-localised ;p)
   * 5. context props from compilation are also added to the config.
   *
   * PROBLEM:
   *
   * As long as we know the component "own props" (we have schema) and item props, we have no idea about context props types. It means that we can only blindly apply responsiveValueGet on them.
   *
   * SOLUTION:
   *
   * context props should be typed. Each editable component should have schema of own props and of context props.
   *
   */
  for (const prop in config) {
    const schemaProp = schema.find((x) => x.prop === prop);

    // If schemaProp is defined, it means "own prop". Otherwise it must be a context prop (they're not "typed" yet and we don't have any information what types of context props we have)
    if (schemaProp) {
      // subcomponents don't get scalarized
      if (isSchemaPropComponent(schemaProp)) {
        // Text modifiers are components for now and in contrast to real components, we need to compile its values.
        if (
          isSchemaPropActionTextModifier(schemaProp) ||
          isSchemaPropTextModifier(schemaProp)
        ) {
          const modifierConfig = config[prop][0];

          if (modifierConfig) {
            const scalarModifierValues: Record<string, any> = {};

            for (const modifierKey in modifierConfig) {
              if (Array.isArray(modifierConfig[modifierKey])) {
                scalarModifierValues[modifierKey] = [];

                modifierConfig[modifierKey].forEach(
                  (values: Record<string, any>, index: number) => {
                    scalarModifierValues[modifierKey][index] = {};

                    for (const nestedModifierKey in values) {
                      scalarModifierValues[modifierKey][index][
                        nestedModifierKey
                      ] = scalarizeNonComponentProp(
                        modifierConfig[modifierKey][index][nestedModifierKey],
                        breakpoint,
                        devices
                      );
                    }
                  }
                );
              } else {
                scalarModifierValues[modifierKey] = scalarizeNonComponentProp(
                  modifierConfig[modifierKey],
                  breakpoint,
                  devices
                );
              }
            }

            ret[prop] = [scalarModifierValues];
          } else {
            ret[prop] = config[prop];
          }
        } else {
          ret[prop] = config[prop];
        }
      }
      // component collection should have item props scalarized. We know the types of item props!
      // component collection localised is already dealing with value that is NON-LOCALISED (it was flattened earlier)
      else if (isSchemaPropCollection(schemaProp)) {
        ret[prop] = scalarizeCollection(
          config[prop],
          breakpoint,
          devices,
          schemaProp.itemFields || []
        );
      } else {
        ret[prop] = scalarizeNonComponentProp(
          config[prop],
          breakpoint,
          devices,
          schemaProp
        );
      }
    } else {
      // context props automatically get scalarized
      ret[prop] = scalarizeNonComponentProp(config[prop], breakpoint, devices);
    }
  }

  return ret;
}

type Scalar<Input extends Record<string, ResponsiveValue<unknown>>> = {
  [key in keyof Input]: UnwrapResponsiveValue<Input[key]>;
};

type Responsify<T extends Record<string, unknown>> = {
  [key in keyof T]: T[key] extends Record<string, unknown>
    ? Responsify<T[key]>
    : ResponsiveValue<T[key]>;
};

function getUndefinedBreakpoints(
  resVal: TrulyResponsiveValue<any>,
  devices: Devices
) {
  const undefinedBreakpoints: string[] = [];
  devices.forEach((device) => {
    if (resVal[device.id] === undefined) {
      undefinedBreakpoints.push(device.id);
    }
  });
  return undefinedBreakpoints;
}

function hasDefinedBreakpoints(
  resVal: TrulyResponsiveValue<any>,
  devices: Devices
) {
  const undefinedBreakpoints = getUndefinedBreakpoints(resVal, devices);
  return undefinedBreakpoints.length < devices.length;
}

export function resop2<
  Input extends Record<string, ResponsiveValue<unknown>>,
  ScalarResult extends Record<string, unknown>
>(
  config: Input,
  callback: (
    scalarInput: Scalar<Input>,
    breakpointIndex: string
  ) => ScalarResult,
  devices: Devices,
  componentDefinition?: InternalComponentDefinition
): Responsify<ScalarResult> {
  const schema = componentDefinition?.schema ?? [];

  // Decompose config into scalar configs
  const scalarConfigs: Record<string, Scalar<Input>> = {};

  devices.forEach((device) => {
    scalarConfigs[device.id] = scalarizeConfig(
      config,
      device.id,
      devices,
      schema
    );
  });

  const scalarOutputs: Record<string, any> = {};

  // run callback for scalar configs
  devices.forEach((device) => {
    scalarOutputs[device.id] = callback(scalarConfigs[device.id], device.id);
  });

  /**
   * Let's first squash all __props, components and item props
   */

  const componentPropNames: Record<string, Set<string>> = {};
  const componentItemPropsNamesAndLength: Record<
    string,
    { lengths: Set<number>; names: Set<string> }
  > = {};
  const propNames: Set<string> = new Set();

  // Let's add keys
  schema.forEach((schemaProp) => {
    if (isSchemaPropComponentOrComponentCollection(schemaProp)) {
      componentPropNames[schemaProp.prop] = new Set();
    }
    if (isSchemaPropCollection(schemaProp)) {
      componentItemPropsNamesAndLength[schemaProp.prop] = {
        lengths: new Set(),
        names: new Set(),
      };
    }
  });

  // Let's find all output prop names
  devices.forEach((device) => {
    // prop names
    const propsObject = scalarOutputs[device.id].__props ?? {};
    if (typeof propsObject !== "object" || propsObject === null) {
      throw new Error(
        `__props must be object, it is not for breakpoint: ${device.id}`
      );
    }

    for (const propName in propsObject) {
      propNames.add(propName);
    }

    // component prop names
    schema.forEach((schemaProp) => {
      if (isSchemaPropComponentOrComponentCollection(schemaProp)) {
        const componentObject: Record<string, any> =
          scalarOutputs[device.id][schemaProp.prop] ?? {};

        if (typeof componentObject !== "object" || componentObject === null) {
          throw new Error(
            `resop error: component must be undefined or an object, it is not for device ${device.id} and prop ${schemaProp.prop}. Template: ${componentDefinition?.id}`
          );
        }

        for (const key in componentObject) {
          if (key === "itemProps") {
            continue;
          }
          componentPropNames[schemaProp.prop].add(key);
        }

        if (isSchemaPropCollection(schemaProp)) {
          const itemPropsArray = componentObject.itemProps ?? [];

          if (!Array.isArray(itemPropsArray)) {
            throw new Error(
              `resop error: item props must be undefined or an array (${schemaProp.prop}). Template: ${componentDefinition?.id}`
            );
          }

          itemPropsArray.forEach((itemObject: any, index: number) => {
            if (typeof itemObject !== "object" || itemObject === null) {
              throw new Error(
                `resop error: item in itemProps array must be object (${schemaProp.prop}.itemProps.${index}). Template: ${componentDefinition?.id}`
              );
            }

            for (const key in itemObject) {
              componentItemPropsNamesAndLength[schemaProp.prop].names.add(key);
            }
          });

          componentItemPropsNamesAndLength[schemaProp.prop].lengths.add(
            itemPropsArray.length
          );
        }
      }
    });
  });

  // Let's verify array lengths
  for (const componentName in componentItemPropsNamesAndLength) {
    const lengths = componentItemPropsNamesAndLength[componentName].lengths;
    if (lengths.size > 1) {
      throw new Error(
        `resop: incompatible item props arrays length for component: ${componentName}. Template: ${componentDefinition?.id}`
      );
    }

    const length = Array.from(lengths)[0];

    // If non-zero length, then there are extra requirements
    if (length > 0) {
      const itemsLength = (config as any)[componentName].length;

      if (itemsLength === 0 ? length > 1 : itemsLength !== length) {
        throw new Error(
          `resop: item props arrays length incompatible with items length for component: ${componentName}. Template: ${componentDefinition?.id}`
        );
      }
    }
  }

  // Let's compress
  const output: Record<string, any> = {
    __props: {},
  };

  // squash props
  propNames.forEach((propName) => {
    const squashedValue: TrulyResponsiveValue<any> = {
      $res: true,
    };

    devices.forEach((device) => {
      squashedValue[device.id] = scalarOutputs[device.id]?.__props?.[propName];
    });

    if (hasDefinedBreakpoints(squashedValue, devices)) {
      const undefinedBreakpoints = getUndefinedBreakpoints(
        squashedValue,
        devices
      );
      if (undefinedBreakpoints.length > 0) {
        throw new Error(
          `resop: undefined value (breakpoints: ${undefinedBreakpoints}) for __props.${propName}. Template: ${componentDefinition?.id}`
        );
      }
      output.__props[propName] = responsiveValueNormalize(
        squashedValue,
        devices
      ); // props should be normalized
    }
  });

  // Squash components
  for (const componentName in componentPropNames) {
    output[componentName] = {};

    componentPropNames[componentName].forEach((componentPropName) => {
      const squashedValue: TrulyResponsiveValue<any> = {
        $res: true,
      };
      devices.forEach((device) => {
        squashedValue[device.id] =
          scalarOutputs[device.id][componentName]?.[componentPropName];
      });

      if (hasDefinedBreakpoints(squashedValue, devices)) {
        const undefinedBreakpoints = getUndefinedBreakpoints(
          squashedValue,
          devices
        );
        if (undefinedBreakpoints.length > 0) {
          throw new Error(
            `resop: undefined value (breakpoints ${undefinedBreakpoints}) for ${componentName}.${componentPropName}. Template: ${componentDefinition?.id}`
          );
        }
        output[componentName][componentPropName] = squashedValue;
      }
    });
  }

  // Squash item props
  for (const componentName in componentItemPropsNamesAndLength) {
    output[componentName].itemProps = [];

    const length = Array.from(
      componentItemPropsNamesAndLength[componentName].lengths
    )[0];

    for (let i = 0; i < length; i++) {
      output[componentName].itemProps[i] = {};

      componentItemPropsNamesAndLength[componentName].names.forEach(
        (itemPropName) => {
          const squashedValue: TrulyResponsiveValue<any> = {
            $res: true,
          };

          devices.forEach((device) => {
            squashedValue[device.id] =
              scalarOutputs[device.id][componentName]?.itemProps?.[i]?.[
                itemPropName
              ];
          });

          if (hasDefinedBreakpoints(squashedValue, devices)) {
            const undefinedBreakpoints = getUndefinedBreakpoints(
              squashedValue,
              devices
            );
            if (undefinedBreakpoints.length > 0) {
              throw new Error(
                `resop: undefined value (breakpoints ${undefinedBreakpoints}) for ${componentName}.${i}.${itemPropName}. Template: ${componentDefinition?.id}`
              );
            }
            output[componentName].itemProps[i][itemPropName] = squashedValue;
          }
        }
      );
    }
  }

  delete scalarOutputs.__props;
  schema.forEach((schemaProp) => {
    if (isSchemaPropComponentOrComponentCollection(schemaProp)) {
      delete scalarOutputs[schemaProp.prop];
    }
  });

  const result = {
    ...squashCSSResults(scalarOutputs, devices),
    ...output,
  };

  return result;
}
