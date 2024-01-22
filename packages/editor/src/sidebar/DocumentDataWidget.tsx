import {
  getExternalReferenceLocationKey,
  isResolvedCompoundExternalDataValue,
  type ExternalDataCompoundResourceResolvedResult,
} from "@easyblocks/core";
import { Typography } from "@easyblocks/design-system";
import { assertDefined } from "@easyblocks/utils";
import React from "react";
import { EditorContextType } from "../EditorContext";
import {
  CompoundResourceValueSelect,
  getBasicResourcesOfType,
} from "../tinacms/fields/plugins/ExternalField/ExternalField";
import type { InternalWidgetComponentProps } from "../types";

type ExternalWidget = NonNullable<
  Extract<
    EditorContextType["types"][string],
    { type: "external" }
  >["widgets"][number]
>;

function documentDataWidgetFactory(options: { type: string }): ExternalWidget {
  const DocumentDataWidgetComponent = createDocumentDataWidgetComponent(
    options.type
  );

  const documentDataWidget: ExternalWidget = {
    id: "@easyblocks/document-data",
    label: "Document data",
    component: DocumentDataWidgetComponent,
  };

  return documentDataWidget;
}

export { documentDataWidgetFactory };

function createDocumentDataWidgetComponent(type: string) {
  return function DocumentDataWidgetComponent({
    id,
    onChange,
    resourceKey,
    path,
  }: InternalWidgetComponentProps) {
    if (id !== null && typeof id !== "string") {
      return (
        <Typography
          css={`
            white-space: normal;
          `}
        >
          Unsupported type of identifier for document data widget. Expected
          "string", but got "{typeof id}".
        </Typography>
      );
    }

    const { editorContext, externalData } = window.editorWindowAPI;

    const schema = editorContext.rootComponent.rootParams;

    const documentExternalLocationKeys = assertDefined(schema).map((s) =>
      getExternalReferenceLocationKey("$", s.prop)
    );

    const documentCompoundResources = Object.entries(externalData).filter<
      [string, ExternalDataCompoundResourceResolvedResult]
    >((r): r is [string, ExternalDataCompoundResourceResolvedResult] => {
      const [externalId, externalDataValue] = r;
      return (
        documentExternalLocationKeys.includes(externalId) &&
        isResolvedCompoundExternalDataValue(externalDataValue)
      );
    });

    const options = documentCompoundResources.flatMap(
      ([externalId, externalDataValue]) =>
        getBasicResourcesOfType(externalDataValue.value, type).map((r) => {
          const resourceSchemaProp = assertDefined(
            schema?.find((s) => s.prop === externalId.split(".")[1])
          );

          return {
            id: externalId,
            key: r.key,
            label: `${resourceSchemaProp.label ?? resourceSchemaProp.prop} > ${
              r.label ?? r.key
            }`,
          };
        })
    );

    if (options.length === 1 && !id && path) {
      // We perform form change manually to avoid storing this change in editor's history
      editorContext.form.change(path, {
        id: options[0].id,
        key: options[0].key,
        widgetId: "@easyblocks/document-data",
      });
    }

    if (!documentCompoundResources.length) {
      return (
        <Typography
          css={`
            white-space: normal;
          `}
        >
          Please select at least one non optional external data for document.
        </Typography>
      );
    }

    return (
      <CompoundResourceValueSelect
        options={options}
        resource={
          id === null
            ? {
                id,
                key: undefined,
              }
            : {
                id,
                key: resourceKey,
              }
        }
        onResourceKeyChange={(newId, newKey) => {
          onChange(newId, newKey);
        }}
      />
    );
  };
}
