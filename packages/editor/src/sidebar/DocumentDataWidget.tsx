import {
  ExternalFieldCustomComponentProps,
  FetchOutputCompoundResources,
  Widget,
} from "@easyblocks/core";
import { Typography } from "@easyblocks/design-system";
import { assertDefined } from "@easyblocks/utils";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  CompoundResourceValueSelect,
  getBasicResourcesOfType,
} from "../tinacms/fields/plugins/ExternalField/ExternalField";

function documentDataWidgetFactory(options: { type: string }): Widget {
  const documentDataWidget: Widget = {
    id: "@easyblocks/document-data",
    label: "Document data",
    component: {
      type: "custom",
      component: (props) => {
        const reactRoot = ReactDOM.createRoot(props.root);

        reactRoot.render(
          <DocumentDataWidgetComponent
            value={props.value}
            onChange={props.onChange}
            type={options.type}
          />
        );
      },
    },
  };

  return documentDataWidget;
}

export { documentDataWidgetFactory };

function DocumentDataWidgetComponent({
  value,
  onChange,
  type,
}: Pick<ExternalFieldCustomComponentProps, "value" | "onChange"> & {
  type: string;
}) {
  const { editorContext, externalData } = window.editorWindowAPI;

  const documentResourcesIds = assertDefined(
    editorContext.activeRootContainer.schema
  ).map((s) => `$.${s.prop}`);

  const documentCompoundResources = Object.entries(externalData).filter<
    [string, Extract<FetchOutputCompoundResources[string], { error: null }>]
  >(
    (
      r
    ): r is [
      string,
      Extract<FetchOutputCompoundResources[string], { error: null }>
    ] => {
      const [externalId, externalDataValue] = r;
      return (
        documentResourcesIds.includes(externalId) &&
        externalDataValue.type === "object" &&
        "values" in externalDataValue &&
        externalDataValue.values !== undefined &&
        externalDataValue.error === null
      );
    }
  );

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
          getBasicResourcesOfType(externalDataValue.values, type).map((r) => {
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
        value.id === null
          ? {
              id: value.id,
              key: undefined,
            }
          : {
              id: value.id,
              key: value.key,
            }
      }
      onResourceKeyChange={(newId, newKey) => {
        editorContext.actions.runChange(() => {
          onChange({
            id: newId,
            key: newKey,
          });
        });
      }}
    />
  );
}
