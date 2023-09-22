import { isResolvedCompoundExternalDataValue } from "@easyblocks/app-utils";
import {
  ExternalDataCompoundResourceResolvedResult,
  getResourceId,
  Widget,
} from "@easyblocks/core";
import { Typography } from "@easyblocks/design-system";
import { assertDefined } from "@easyblocks/utils";
import React from "react";
import {
  CompoundResourceValueSelect,
  getBasicResourcesOfType,
} from "../tinacms/fields/plugins/ExternalField/ExternalField";
import { InternalWidgetComponentProps } from "../types";

function documentDataWidgetFactory(options: { type: string }): Widget {
  const DocumentDataWidgetComponent = createDocumentDataWidgetComponent(
    options.type
  );

  const documentDataWidget: Widget = {
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
  }: InternalWidgetComponentProps) {
    const { editorContext, externalData } = window.editorWindowAPI;

    const documentResourcesIds = assertDefined(
      editorContext.activeRootContainer.schema
    ).map((s) => getResourceId("$", s.prop));

    const documentCompoundResources = Object.entries(externalData).filter<
      [string, ExternalDataCompoundResourceResolvedResult]
    >((r): r is [string, ExternalDataCompoundResourceResolvedResult] => {
      const [externalId, externalDataValue] = r;
      return (
        documentResourcesIds.includes(externalId) &&
        isResolvedCompoundExternalDataValue(externalDataValue)
      );
    });

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
        options={documentCompoundResources.flatMap(
          ([externalId, externalDataValue]) =>
            getBasicResourcesOfType(externalDataValue.value, type).map((r) => {
              const resourceSchemaProp = assertDefined(
                editorContext.activeRootContainer.schema?.find(
                  (s) => s.prop === externalId.split(".")[1]
                )
              );

              return {
                id: externalId,
                key: r.key,
                label: `${
                  resourceSchemaProp.label ?? resourceSchemaProp.prop
                } > ${r.label ?? r.key}`,
              };
            })
        )}
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
