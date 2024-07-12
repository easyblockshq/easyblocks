import {
  isSchemaPropCollection,
  isSchemaPropComponent,
} from "./compiler/schema";
import { responsiveValueForceGet } from "./responsiveness";
import { Config, Devices, SchemaProp } from "./types";

function scalarizeNonComponentProp(
  value: any,
  breakpoint: string,
  schemaProp?: SchemaProp
) {
  if (schemaProp) {
    // This function should never be called with component type
    if (schemaProp.type.startsWith("component")) {
      throw new Error("unreachable");
    }

    // Text values aren't responsive
    if (schemaProp.type === "text") {
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
          schemaProp
        );
      } else {
        scalarizedChild[key] = scalarizeNonComponentProp(value, breakpoint);
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
   * 1. It has _component, _id, etc.
   * 2. All the props from schema that are *not* components are compiled and are available.
   * 3. All the props from schema that are components have only _component and _id (exception below)
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
        ret[prop] = config[prop];
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
          schemaProp
        );
      }
    } else {
      // context props automatically get scalarized
      ret[prop] = scalarizeNonComponentProp(config[prop], breakpoint);
    }
  }

  return ret;
}
