/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
"use client";
import {
  ComponentPickerClosedEvent,
  componentPickerOpened,
  ContextProps,
  findComponentDefinitionById,
  getComponentMainType,
  InternalComponentDefinition,
  isCompoundExternalDataValue,
  isEmptyRenderableContent,
  isExternalSchemaProp,
  isSchemaPropActionTextModifier,
  isSchemaPropComponent,
  isSchemaPropComponentOrComponentCollection,
  isSchemaPropTextModifier,
  itemInserted,
  responsiveValueGetDefinedValue,
  responsiveValueMap,
  responsiveValueReduce,
  splitTemplateName,
} from "@easyblocks/app-utils";
import {
  CompilationMetadata,
  CompiledComponentConfig,
  CompiledCustomComponentConfig,
  CompiledLocalTextReference,
  CompiledShopstoryComponentConfig,
  ComponentCollectionLocalisedSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentSchemaProp,
  Devices,
  ExternalData,
  ExternalReference,
  ExternalReferenceNonEmpty,
  ExternalSchemaProp,
  getExternalReferenceLocationKey,
  getExternalValue,
  isLocalTextReference,
  LocalReference,
  LocalTextReference,
  ResponsiveValue,
  UnresolvedResource,
} from "@easyblocks/core";
import React, { Fragment, ReactElement } from "react";
import Box from "../Box/Box";
import { useEasyblocksExternalData } from "../EasyblocksExternalDataProvider";
import { useEasyblocksMetadata } from "../EasyblocksMetadataProvider";
import {
  EasyblocksProviderContextValue,
  useEasyblocksProviderContext,
} from "../EasyblocksProvider";
import EditableComponentBuilderClient from "../EditableComponentBuilder/EditableComponentBuilder.client";
import EditableComponentBuilderEditor from "../EditableComponentBuilder/EditableComponentBuilder.editor";
import MissingComponent from "../MissingComponent";
import Placeholder from "../Placeholder";

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
  fieldsRequiredToRender: Set<string>;
};

function getRenderabilityStatus(
  compiled: CompiledComponentConfig,
  meta: CompilationMetadata,
  externalData: ExternalData
): RenderabilityStatus {
  const status: RenderabilityStatus = {
    renderable: true,
    isLoading: false,
    fieldsRequiredToRender: new Set<string>(),
  };

  const componentDefinition = getComponentDefinition(compiled, {
    definitions: meta.vars.definitions,
  });

  if (!componentDefinition) {
    return {
      renderable: false,
      isLoading: false,
      fieldsRequiredToRender: new Set<string>(),
    };
  }

  const requiredExternalFields = componentDefinition.schema.filter(
    (schemaProp): schemaProp is ExternalSchemaProp => {
      return isExternalSchemaProp(schemaProp) && !schemaProp.optional;
    }
  );

  if (requiredExternalFields.length === 0) {
    return status;
  }

  for (const resourceSchemaProp of requiredExternalFields) {
    const externalReference: ResponsiveValue<ExternalReference> =
      compiled.props[resourceSchemaProp.prop];

    const fieldStatus = getFieldStatus(
      externalReference,
      externalData,
      compiled._id,
      resourceSchemaProp.prop,
      meta.vars.devices
    );

    status.isLoading = status.isLoading || fieldStatus.isLoading;
    status.renderable = status.renderable && fieldStatus.renderable;

    if (!fieldStatus.renderable && !fieldStatus.isLoading) {
      status.fieldsRequiredToRender.add(
        resourceSchemaProp.label || resourceSchemaProp.prop
      );
    }
  }

  return status;
}

function getCompiledSubcomponents(
  id: string,
  compiledArray: (
    | CompiledShopstoryComponentConfig
    | CompiledCustomComponentConfig
    | ReactElement
  )[],
  contextProps: ContextProps,
  schemaProp:
    | ComponentSchemaProp
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

  if (schemaProp.noInline) {
    const elements = compiledArray.map((compiledChild, index) =>
      "_template" in compiledChild ? (
        <ComponentBuilder path={`${path}.${index}`} compiled={compiledChild} />
      ) : (
        compiledChild
      )
    );

    if (isSchemaPropComponent(schemaProp)) {
      return elements[0];
    } else {
      return elements;
    }
  }

  const EditableComponentBuilder = isEditing
    ? EditableComponentBuilderEditor
    : EditableComponentBuilderClient;

  let elements = compiledArray.map((compiledChild, index) =>
    "_template" in compiledChild ? (
      <EditableComponentBuilder
        compiled={compiledChild}
        schemaProp={schemaProp}
        index={index}
        length={compiledArray.length}
        contextProps={contextProps}
        path={`${path}.${index}`}
      />
    ) : (
      compiledChild
    )
  );

  // TODO: this code should be editor-only
  if (
    isEditing &&
    elements.length === 0 &&
    !contextProps.noInline &&
    // We don't want to show add button for this type
    schemaProp.type !== "component-collection-localised"
  ) {
    const type = getComponentMainType(schemaProp.accepts);

    elements = [
      <Placeholder
        id={id}
        path={path}
        type={type}
        appearance={(schemaProp as ComponentSchemaProp).placeholderAppearance}
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
  const { compiled, passedProps, path, ...restProps } = props;

  const allPassedProps: Record<string, any> = {
    ...passedProps,
    ...restProps,
  };

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

  const component = getComponent(
    componentDefinition,
    easyblocksProvider,
    isEditing
  );
  const isMissingComponent = compiled._template === "$MissingComponent";
  const isMissingInstance = component === undefined;
  const isMissing = isMissingComponent || isMissingInstance;

  if (isMissing) {
    console.warn(`Missing "${compiled._template}"`);

    if (!isEditing) {
      return null;
    }

    if (isMissingComponent) {
      return <MissingComponent error={true}>Missing</MissingComponent>;
    } else {
      return (
        <MissingComponent component={componentDefinition} error={true}>
          Missing
        </MissingComponent>
      );
    }
  }

  const Component = component;

  const renderabilityStatus = getRenderabilityStatus(
    compiled,
    meta,
    externalData
  );

  if (!renderabilityStatus.renderable) {
    const fieldsRequiredToRender = Array.from(
      renderabilityStatus.fieldsRequiredToRender
    );

    return (
      <MissingComponent component={componentDefinition}>
        {`Fill following fields to render the component: ${fieldsRequiredToRender.join(
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

  const shopstoryCompiledConfig = compiled as CompiledShopstoryComponentConfig;

  // Shopstory component
  const styled: { [key: string]: any } = buildBoxes(
    shopstoryCompiledConfig.styled,
    "",
    {},
    meta
  );

  // Styled
  componentDefinition.schema.forEach((schemaProp) => {
    if (
      isSchemaPropComponentOrComponentCollection(schemaProp) &&
      // !isSchemaPropAction(schemaProp) &&
      !isSchemaPropActionTextModifier(schemaProp) &&
      !isSchemaPropTextModifier(schemaProp)
    ) {
      const contextProps =
        shopstoryCompiledConfig.__editing?.components?.[schemaProp.prop] || {};

      const compiledChildren =
        shopstoryCompiledConfig.components[schemaProp.prop];

      styled[schemaProp.prop] = getCompiledSubcomponents(
        compiled._id,
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
  const { ref, ...restPassedProps } = allPassedProps || {};

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
    ...mapExternalProps(
      shopstoryCompiledConfig.props,
      shopstoryCompiledConfig._id,
      componentDefinition,
      externalData
    ),
    ...styled,
    path,
    isEditing,
    runtime,
    _id: shopstoryCompiledConfig._id,
  };

  return <Component {...componentProps} />;
}

function getComponent(
  componentDefinition: InternalComponentDefinition,
  easyblocksProvider: EasyblocksProviderContextValue,
  isEditing: boolean
) {
  let component: any;

  // We first try to find editor version of that component
  if (isEditing) {
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

  return component;
}

function mapExternalProps(
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

    if (
      schemaProp &&
      (isExternalSchemaProp(schemaProp) || schemaProp.type === "text")
    ) {
      const propValue = props[propName] as ResponsiveValue<
        LocalReference | ExternalReference
      >;

      if (
        schemaProp.type === "text" &&
        isLocalTextReference(propValue as LocalTextReference, "text")
      ) {
        resultsProps[propName] = (
          propValue as unknown as CompiledLocalTextReference
        ).value;
      } else if (
        isExternalSchemaProp(schemaProp) ||
        (schemaProp.type === "text" &&
          !isLocalTextReference(
            propValue as LocalReference | ExternalReference,
            "text"
          ))
      ) {
        resultsProps[propName] = resolveExternalValue(
          propValue as ExternalReference,
          configId,
          schemaProp as ExternalSchemaProp,
          externalData
        );
      }
    } else {
      resultsProps[propName] = props[propName];
    }
  }

  return resultsProps;
}

function resolveExternalValue(
  responsiveResource: ResponsiveValue<UnresolvedResource>,
  configId: string,
  schemaProp: ExternalSchemaProp,
  externalData: ExternalData
) {
  return responsiveValueMap(responsiveResource, (r, breakpointIndex) => {
    if (r.id) {
      // If resource field has `key` defined and its `id` starts with "$.", it means that it's a reference to the
      // root resource and we need to look for the resource with the same id as the root resource.
      const resourceId =
        r.key && r.id.startsWith("$.")
          ? r.id
          : getExternalReferenceLocationKey(
              configId,
              schemaProp.prop,
              breakpointIndex
            );
      const resource = externalData[resourceId];

      let resourceValue: ReturnType<typeof getExternalValue>;

      if (resource) {
        resourceValue = getExternalValue(resource);
      }

      if (resource === undefined || isEmptyRenderableContent(resourceValue)) {
        return;
      }

      if ("error" in resource) {
        return;
      }

      if (isCompoundExternalDataValue(resource)) {
        if (!r.key) {
          return;
        }

        const resolvedResourceValue = resource.value[r.key].value;

        if (!resolvedResourceValue) {
          return;
        }

        return resolvedResourceValue;
      }

      return resourceValue;
    }

    return;
  });
}

export default ComponentBuilder;
export type { ComponentBuilderComponent };

function getFieldStatus(
  externalReference: ResponsiveValue<ExternalReference>,
  externalData: ExternalData,
  configId: string,
  fieldName: string,
  devices: Devices
) {
  return responsiveValueReduce(
    externalReference,
    (currentStatus, value, deviceId) => {
      if (!deviceId) {
        if (!value.id) {
          return {
            isLoading: false,
            renderable: false,
          };
        }

        const externalValue = getResolvedExternalDataValue(
          externalData,
          configId,
          fieldName,
          value
        );

        return {
          isLoading: currentStatus.isLoading || externalValue === undefined,
          renderable: currentStatus.renderable && externalValue !== undefined,
        };
      }

      if (currentStatus.isLoading || !currentStatus.renderable) {
        return currentStatus;
      }

      const externalReferenceValue = responsiveValueGetDefinedValue(
        value,
        deviceId,
        devices
      );

      if (!externalReferenceValue || externalReferenceValue.id === null) {
        return {
          isLoading: false,
          renderable: false,
        };
      }

      const externalValue = getResolvedExternalDataValue(
        externalData,
        configId,
        fieldName,
        externalReferenceValue
      );

      return {
        isLoading: currentStatus.isLoading || externalValue === undefined,
        renderable: currentStatus.renderable && externalValue !== undefined,
      };
    },
    { renderable: true, isLoading: false },
    devices
  );
}

function getResolvedExternalDataValue(
  externalData: ExternalData,
  configId: string,
  fieldName: string,
  value: ExternalReferenceNonEmpty
) {
  const externalReferenceLocationKey = value.id.startsWith("$.")
    ? value.id
    : getExternalReferenceLocationKey(configId, fieldName);

  const externalValue = externalData[externalReferenceLocationKey];

  if (externalValue === undefined || "error" in externalValue) {
    return;
  }

  return externalValue;
}
