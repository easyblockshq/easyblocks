/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

import {
  ComponentPickerClosedEvent,
  componentPickerOpened,
  ContextProps,
  findComponentDefinitionById,
  getComponentMainType,
  InternalComponentDefinition,
  isCompoundExternalDataValue,
  isEmptyRenderableContent,
  isResourceSchemaProp,
  isSchemaPropAction,
  isSchemaPropActionTextModifier,
  isSchemaPropCollection,
  isSchemaPropComponent,
  isSchemaPropComponentOrComponentCollection,
  isSchemaPropTextModifier,
  isTrulyResponsiveValue,
  itemInserted,
  ResolvedResourceProp,
  responsiveValueMap,
  splitTemplateName,
} from "@easyblocks/app-utils";
import {
  CompilationMetadata,
  CompiledComponentConfig,
  CompiledCustomComponentConfig,
  CompiledShopstoryComponentConfig,
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentFixedSchemaProp,
  ComponentSchemaProp,
  CustomResourceSchemaProp,
  ExternalData,
  getResourceId,
  getResourceType,
  getResourceValue,
  isLocalTextResource,
  ResourceSchemaProp,
  ResponsiveValue,
  UnresolvedResource,
} from "@easyblocks/core";
import React, { Fragment, ReactElement } from "react";
import Box from "../Box/Box";
import { useEasyblocksExternalData } from "../EasyblocksExternalDataProvider";
import { useEasyblocksMetadata } from "../EasyblocksMetadataProvider";
import { useEasyblocksProviderContext } from "../EasyblocksProvider";
import EditableComponentBuilderEditor from "../EditableComponentBuilder/EditableComponentBuilder";
import EditableComponentBuilderClient from "../EditableComponentBuilder/EditableComponentBuilder.client";
import MissingComponent from "../MissingComponent";
import Placeholder from "../Placeholder";
import { trace } from "./trace";
import { withImpressionTracking } from "./withImpressionTracking";

function buildBoxes(
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
        stitches: meta.easyblocksProviderContext.stitches,
      };

      if (compiled.__action) {
        const actionWrapper = actionWrappers[compiled.__action];

        if (!actionWrapper) {
          throw new Error("Can't find action wrapper: " + compiled.__action);
        }

        return actionWrapper(Box, boxProps);
      }

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

/**
 * the purpose of LinkWrapper is just to move passedProps into componentProps.
 *
 * It's much better DX for developers. All dev must do is pass componentProps to Component and all props are there:
 * - props like "as", "href", etc returned from actionWrapper
 * - "passedProps" from component code <Link data-custom-attr="test" />
 */
function LinkWrapper(props: any) {
  const {
    LinkProvider,
    Component,
    componentProps,
    values,
    passedProps,
    children,
  } = props;

  return React.createElement(LinkProvider, {
    Component,
    componentProps: {
      children,
      ...componentProps, // componentProps.children must be AFTER children, it's more important.
      ...passedProps,
    },
    values,
  });
}

const missingActionInstance = (name: string) => () => {
  console.error(`Missing action instance in ShopstoryProvider for: ${name}`);
};

const missingLinkInstance =
  (name: string) =>
  ({ Component, componentProps, values }: any) => {
    console.error(`Missing link instance in ShopstoryProvider for: ${name}`);
    return <Component {...componentProps} />;
  };

function getComponentDefinition(
  compiled: CompiledComponentConfig,
  runtimeContext: any
) {
  return findComponentDefinitionById(
    splitTemplateName(compiled._template).name,
    // @ts-ignore
    runtimeContext
  );
}

/**
 * Checks whether:
 * 1. component is renderable (if all non-optional externals are defined)
 * 2. is data loading...
 * 3. gets fields that are not defined
 *
 * @param compiled
 * @param runtimeContext
 * @param rendererContext
 */

type RenderabilityStatus = {
  renderable: boolean;
  isLoading: boolean;
  fieldsRequiredToRender: string[];
};

function getRenderabilityStatus(
  compiled: CompiledComponentConfig,
  meta: CompilationMetadata,
  externalData: ExternalData
): RenderabilityStatus {
  const status: RenderabilityStatus = {
    renderable: true,
    isLoading: false,
    fieldsRequiredToRender: [],
  };

  const componentDefinition = getComponentDefinition(compiled, {
    definitions: meta.vars.definitions,
  });

  if (!componentDefinition) {
    return { renderable: false, isLoading: false, fieldsRequiredToRender: [] };
  }

  const mappedSchema = componentDefinition.schema.map((schema) => {
    if (isResourceSchemaProp(schema)) {
      if (
        schema.type === "resource" &&
        (schema.resourceType === "image" || schema.resourceType === "video")
      ) {
        const resourceSchemaProp: CustomResourceSchemaProp = {
          ...schema,
          optional: true,
        };

        return resourceSchemaProp;
      }
    }

    return schema;
  });

  const requiredResourceFields = mappedSchema.filter(
    (resource): resource is CustomResourceSchemaProp => {
      return (
        isResourceSchemaProp(resource) &&
        !resource.optional &&
        resource.type !== "text"
      );
    }
  );

  if (requiredResourceFields.length === 0) {
    return status;
  }

  for (const resourceSchemaProp of requiredResourceFields) {
    const compiledResourceValue = compiled.props[resourceSchemaProp.prop];
    const isResponsiveResource = isTrulyResponsiveValue(compiledResourceValue);
    const resourcesIds = Object.keys(externalData).filter((id) =>
      isResponsiveResource
        ? isResourceDefinedForAnyBreakpoint(id, resourceSchemaProp)
        : id === getResourceId(compiled._id, resourceSchemaProp.prop)
    );
    const resources = resourcesIds.map((id) => externalData[id]);
    // const resourceValues = resources.map((r) => getResourceValue(r));

    // const isLoading =
    //   status.isLoading ||
    //   (resources !== undefined &&
    //     (resources.status === "loading" ||
    //       (resources.status === "success" &&
    //         isEmptyRenderableContent(resourceValues))));
    const isLoading = false;

    status.isLoading = isLoading;

    const isDefined =
      resources.length > 0 &&
      resources.every((r) => "value" in r && r.value); /*&&
      (isRenderableContent(resourceValues)
        ? isNonEmptyRenderableContent(resourceValues)
        : true);*/

    status.renderable = status.renderable && isDefined;

    if (!isDefined) {
      status.fieldsRequiredToRender.push(
        resourceSchemaProp.label || resourceSchemaProp.prop
      );
    }
  }

  return status;

  function isResourceDefinedForAnyBreakpoint(
    externalDataId: string,
    resourceSchemaProp: CustomResourceSchemaProp
  ) {
    return meta.vars.devices
      .map((d) => d.id)
      .some(
        (deviceId) =>
          externalDataId ===
          getResourceId(compiled._id, resourceSchemaProp.prop, deviceId)
      );
  }
}

function getCompiledSubcomponents(
  compiledArray: (
    | CompiledShopstoryComponentConfig
    | CompiledCustomComponentConfig
  )[],
  contextProps: ContextProps,
  schemaProp:
    | ComponentSchemaProp
    | ComponentFixedSchemaProp
    | ComponentCollectionSchemaProp
    | ComponentCollectionLocalisedSchemaProp,
  path: string,
  meta: CompilationMetadata,
  isEditing: boolean
) {
  const originalPath = path;

  if (schemaProp.type === "component-collection-localised") {
    path = path + "." + meta.vars.locale;
  }

  const EditableComponentBuilder = isEditing
    ? EditableComponentBuilderEditor
    : EditableComponentBuilderClient;

  let elements = compiledArray.map((compiledChild, index) => (
    <EditableComponentBuilder
      compiled={compiledChild}
      schemaProp={schemaProp}
      index={index}
      contextProps={contextProps}
      path={`${path}.${index}`}
    />
  ));

  // TODO: this code should be editor-only
  if (
    isEditing &&
    elements.length === 0 &&
    !contextProps.noInline &&
    // We don't want to show add button for this type
    schemaProp.type !== "component-collection-localised"
  ) {
    const componentTypes =
      schemaProp.type === "component-fixed"
        ? [schemaProp.componentType]
        : schemaProp.componentTypes;
    const type = getComponentMainType(componentTypes);
    elements = [
      <Placeholder
        type={type}
        onClick={() => {
          function handleComponentPickerCloseMessage(
            event: ComponentPickerClosedEvent
          ) {
            if (
              event.data.type === "@shopstory-editor/component-picker-closed"
            ) {
              window.removeEventListener(
                "message",
                handleComponentPickerCloseMessage
              );

              if (event.data.payload.config) {
                window.parent.postMessage(
                  itemInserted({
                    name: path,
                    index: 0,
                    block: event.data.payload.config,
                  })
                );
              }
            }
          }

          window.addEventListener("message", handleComponentPickerCloseMessage);

          window.parent.postMessage(componentPickerOpened(originalPath));
        }}
        meta={meta}
      />,
    ];
  }

  if (isSchemaPropComponent(schemaProp)) {
    return elements[0] ?? <Fragment></Fragment>;
  } else {
    return elements;
  }
}

export type ComponentBuilderProps = {
  path: string;
  passedProps?: {
    [key: string]: any; // any extra props passed in components
  };
  compiled: CompiledShopstoryComponentConfig | CompiledCustomComponentConfig;
};

type ComponentBuilderComponent = React.FC<ComponentBuilderProps>;

function ComponentBuilder(props: ComponentBuilderProps): ReactElement | null {
  const { compiled, passedProps, path } = props;
  const easyblocksProvider = useEasyblocksProviderContext();
  const meta = useEasyblocksMetadata();
  const externalData = useEasyblocksExternalData();

  /**
   * Component is build in editing mode only if compiled.__editing is set.
   * This is the result of compilation.
   * The only case when compiled.__editing is set is when we're in Editor and for non-nested components.
   */
  const isEditing = compiled.__editing !== undefined;
  const pathSeparator = path === "" ? "" : ".";

  // Here we know we must render just component, without any wrappers
  const componentDefinition = getComponentDefinition(compiled, {
    definitions: meta.vars.definitions,
  })!;

  const isComponentCustom = !componentDefinition.id.startsWith("$");
  const isButton = componentDefinition.tags.includes("button");

  let component: any;
  if (isComponentCustom) {
    if (isButton) {
      component = easyblocksProvider.buttons[componentDefinition.id];
    } else {
      component = easyblocksProvider.components[componentDefinition.id];
    }
  } else {
    // We first try to find editor version of that component
    if (compiled.__editing) {
      component =
        easyblocksProvider.components[componentDefinition.id + ".editor"];
    }

    // If it still missing, we try to find client version of that component
    if (!component) {
      component =
        easyblocksProvider.components[componentDefinition.id + ".client"];
    }

    if (!component) {
      // In most cases we're going to pick component by its id
      component = easyblocksProvider.components[componentDefinition.id];
    }
  }

  const isMissingComponent = compiled._template === "$MissingComponent";
  const isMissingInstance = component === undefined;
  const isMissing = isMissingComponent || isMissingInstance;

  if (isMissing) {
    console.warn(`Missing "${compiled._template}"`);

    if (!isEditing) {
      return null;
    }

    if (isMissingComponent) {
      return (
        <MissingComponent tags={[]} error={true}>
          Missing
        </MissingComponent>
      );
    } else {
      return (
        <MissingComponent tags={componentDefinition.tags} error={true}>
          Missing
        </MissingComponent>
      );
    }
  }

  const traceEvent = isEditing
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_: unknown) => {}
    : trace(compiled, easyblocksProvider.eventSink ?? (() => {}));

  const Component =
    isEditing || !compiled.tracing?.traceImpressions
      ? component
      : withImpressionTracking(
          {
            callback: traceEvent,
          },
          component
        );

  // Actions and links
  const actions: { [key: string]: any } = {};
  const actionWrappers: { [key: string]: any } = {};

  componentDefinition.schema.forEach((schemaProp) => {
    // if action
    if (isSchemaPropAction(schemaProp)) {
      const actionConfig = compiled.actions[schemaProp.prop][0];

      // If no action
      if (!actionConfig) {
        actionWrappers[schemaProp.prop] = (
          Component: any,
          props: { [key: string]: any }
        ) => {
          return <Component {...props} />;
        };
        actions[schemaProp.prop] = () => {};
      } else {
        const actionDefinition = getComponentDefinition(actionConfig, {
          definitions: meta.vars.definitions,
        });

        if (!actionDefinition) {
          throw new Error(
            "Missing definition for action " + actionConfig._template
          );
        }

        const actionParams: Record<string, any> = {};

        actionDefinition.schema.forEach((schemaProp) => {
          if (isResourceSchemaProp(schemaProp)) {
            const unresolvedResourceValue = actionConfig.props[schemaProp.prop];

            if (isLocalTextResource(unresolvedResourceValue, schemaProp.type)) {
              actionParams[schemaProp.prop] = unresolvedResourceValue.value;
            } else {
              if (isTrulyResponsiveValue(unresolvedResourceValue)) {
                throw new Error(
                  "Unexpected responsive value for resource within custom component"
                );
              }

              const resolvedResourceProp = resolveResource(
                unresolvedResourceValue,
                actionConfig.props._id,
                schemaProp,
                externalData
              );

              actionParams[schemaProp.prop] = resolvedResourceProp?.value;
            }
          } else {
            actionParams[schemaProp.prop] = actionConfig.props[schemaProp.prop];
          }
        });

        // save action (for links too)
        actions[schemaProp.prop] = () => {
          const action =
            meta.easyblocksProviderContext.actions[actionDefinition.id] ??
            missingActionInstance(actionDefinition.id);
          action(actionParams, null);
        };

        // if link action, we must save link provider
        if (actionDefinition.tags.includes("actionLink")) {
          const linkActionDefinition = actionDefinition;

          actionWrappers[schemaProp.prop] = (
            Component: any,
            props: { [key: string]: any }
          ) => {
            return React.createElement(LinkWrapper, {
              LinkProvider:
                meta.easyblocksProviderContext.links[linkActionDefinition.id] ??
                missingLinkInstance(actionDefinition.id),
              Component,
              componentProps: {
                ...props,
                as: "a",
                onClick: (e: any) => {
                  traceEvent("click");
                  if (isEditing) {
                    e.preventDefault();
                    alert(`link action`);
                  }
                },
              },
              values: actionParams,
            });
          };
        } else {
          actionWrappers[schemaProp.prop] = (
            Component: any,
            props: { [key: string]: any }
          ) => {
            return React.createElement(Component, {
              ...props,
              as: "button",
              onClick: (...args: any[]) => {
                traceEvent("click");
                actions[schemaProp.prop]();
                if (props.onClick) {
                  props.onClick(...args);
                }
              },
            });
          };
        }
      }
    }
  });

  const renderabilityStatus = getRenderabilityStatus(
    compiled,
    meta,
    externalData
  );

  if (!renderabilityStatus.renderable) {
    return (
      <MissingComponent tags={componentDefinition.tags}>
        {`Fill following fields to render the component: ${renderabilityStatus.fieldsRequiredToRender.join(
          ", "
        )}`}

        {renderabilityStatus.isLoading && (
          <Fragment>
            <br />
            <br />
            Loading data...
          </Fragment>
        )}
      </MissingComponent>
    );
  }

  // If custom component
  if (isComponentCustom) {
    const componentProps = {
      ...passedProps,
    };

    componentDefinition.schema.forEach((schemaProp) => {
      if (isSchemaPropCollection(schemaProp)) {
        throw new Error(
          "component collection in custom components not yet supported"
        );
      }

      if (isSchemaPropComponent(schemaProp)) {
        const item = compiled.components[schemaProp.prop]?.[0];

        if (!item) {
          componentProps[schemaProp.prop] = undefined;
        } else {
          const contextProps =
            compiled.__editing?.components[schemaProp.prop] || {};
          const compiledArray = compiled.components[schemaProp.prop];

          componentProps[schemaProp.prop] = getCompiledSubcomponents(
            compiledArray,
            contextProps,
            schemaProp,
            `${path}${pathSeparator}${schemaProp.prop}`,
            meta,
            isEditing
          );
        }
      } else if (isResourceSchemaProp(schemaProp)) {
        if (
          isLocalTextResource(compiled.props[schemaProp.prop], schemaProp.type)
        ) {
          componentProps[schemaProp.prop] =
            compiled.props[schemaProp.prop].value;
        } else {
          const resolvedResourceProp = resolveResource(
            compiled.props[schemaProp.prop],
            compiled.props._id,
            schemaProp,
            externalData
          );

          if (isTrulyResponsiveValue(resolvedResourceProp)) {
            throw new Error(
              "Unexpected responsive value for resource within custom component"
            );
          }

          componentProps[schemaProp.prop] = resolvedResourceProp?.value;
        }
      } else {
        componentProps[schemaProp.prop] = compiled.props[schemaProp.prop];
      }
      // TODO: set componentProps.__fromEditor to all the props that are NOT from schema (all passed)
    });

    // for button we wrap with action wrapper
    if (isButton) {
      delete componentProps.action;
      return actionWrappers["action"](Component, componentProps);
    }

    return <Component {...componentProps} />;
  }

  const shopstoryCompiledConfig = compiled as CompiledShopstoryComponentConfig;

  // Shopstory component
  const styled: { [key: string]: any } = buildBoxes(
    shopstoryCompiledConfig.styled,
    "",
    actionWrappers,
    meta
  );

  // Styled
  componentDefinition.schema.forEach((schemaProp) => {
    if (
      isSchemaPropComponentOrComponentCollection(schemaProp) &&
      !isSchemaPropAction(schemaProp) &&
      !isSchemaPropActionTextModifier(schemaProp) &&
      !isSchemaPropTextModifier(schemaProp)
    ) {
      const contextProps =
        shopstoryCompiledConfig.__editing?.components?.[schemaProp.prop] || {};

      const compiledChildren =
        shopstoryCompiledConfig.components[schemaProp.prop];

      styled[schemaProp.prop] = getCompiledSubcomponents(
        compiledChildren,
        contextProps,
        schemaProp,
        `${path}${pathSeparator}${schemaProp.prop}`,
        meta,
        isEditing
      );
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref, ...restPassedProps } = passedProps || {};

  const runtime = {
    eventSink: meta.easyblocksProviderContext.eventSink,
    Image: meta.easyblocksProviderContext.Image,
    stitches: meta.easyblocksProviderContext.stitches,
    resop: meta.easyblocksProviderContext.resop,
    Box,
    devices: meta.vars.devices,
    isEditing,
    locale: meta.vars.locale,
  };

  const componentProps = {
    ...restPassedProps,
    __fromEditor: {
      _id: shopstoryCompiledConfig._id,
      props: mapResourceProps(
        shopstoryCompiledConfig.props,
        shopstoryCompiledConfig._id,
        componentDefinition,
        externalData
      ),
      components: styled,
      actions,
      React,
      __editing: shopstoryCompiledConfig.__editing,
      isEditing,
      path,
      runtime,
    },
  };

  if (isButton) {
    return actionWrappers["action"](Component, componentProps);
  }

  return <Component {...componentProps} />;
}

function mapResourceProps(
  props: Record<string, unknown>,
  configId: string,
  componentDefinition: InternalComponentDefinition,
  externalData: ExternalData
) {
  const resultsProps: Record<string, unknown> = {};

  for (const propName in props) {
    const schemaProp = componentDefinition.schema.find(
      (currentSchema) => currentSchema.prop === propName
    );

    if (schemaProp && isResourceSchemaProp(schemaProp)) {
      const propValue = props[propName] as ResponsiveValue<UnresolvedResource>;

      if (
        schemaProp.type === "text" &&
        (propValue as UnresolvedResource).id?.startsWith("local.")
      ) {
        resultsProps[propName] = propValue;
      } else {
        resultsProps[propName] = resolveResource(
          propValue,
          configId,
          schemaProp,
          externalData
        );
      }
    } else {
      resultsProps[propName] = props[propName];
    }
  }

  return resultsProps;
}

function resolveResource(
  responsiveResource: ResponsiveValue<UnresolvedResource>,
  configId: string,
  schemaProp: ResourceSchemaProp,
  externalData: ExternalData
): ResponsiveValue<ResolvedResourceProp | null> {
  return responsiveValueMap(responsiveResource, (r, breakpointIndex) => {
    const type = getResourceType(schemaProp);

    if (r.id) {
      if (isLocalTextResource(r, "text")) {
        return {
          id: r.id,
          type,
          status: "success",
          value: r.value,
          error: null,
        };
      } else {
        const resourceId = (() => {
          // If resource field has `key` defined and its `id` starts with "$.", it means that it's a reference to the
          // root resource and we need to look for the resource with the same id as the root resource.
          if (r.key && r.id.startsWith("$.")) {
            return r.id;
          }

          // If `breakpointIndex` is defined, it means we're mapping over the truly responsive value and we need to look
          // for the resource with the breakpoint index in its id.
          if (breakpointIndex !== undefined) {
            return `${configId}.${schemaProp.prop}.${breakpointIndex}`;
          }

          // In any other case we look for the resource with the id that matches the id for the resource field.
          return `${configId}.${schemaProp.prop}`;
        })();

        const resource = externalData[resourceId];

        let resourceValue: ReturnType<typeof getResourceValue>;

        if (resource) {
          resourceValue = getResourceValue(resource);
        }

        if (resource === undefined || isEmptyRenderableContent(resourceValue)) {
          return null;
        }

        if ("error" in resource) {
          return {
            id: r.id,
            type,
            status: "error",
            value: undefined,
            error: resource.error,
          };
        }

        if (isCompoundExternalDataValue(resource)) {
          if (!r.key) {
            return null;
          }

          const resolvedResourceValue = resource.value[r.key].value;

          if (!resolvedResourceValue) {
            return null;
          }

          return {
            id: r.id,
            type,
            status: "success",
            value: resolvedResourceValue,
            error: null,
          };
        }

        return {
          id: r.id,
          type,
          status: "success",
          value: resourceValue,
          error: null,
        };
      }
    }

    return null;
  });
}

export default ComponentBuilder;
export type { ComponentBuilderComponent };
