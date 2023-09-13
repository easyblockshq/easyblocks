import {
  ExternalFieldCustomComponentProps,
  FetchCompoundResourceResultValues,
  ResolvedResource,
  Widget,
} from "@easyblocks/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { CompoundResourceValueSelect } from "../tinacms/fields/plugins/ExternalField/ExternalField";

function rootResourceWidgetFactory(options: { type: string }): Widget {
  const rootResourceWidget: Widget = {
    id: "@easyblocks/linkedResource",
    label: "Root resource",
    component: {
      type: "custom",
      component: (props) => {
        const reactRoot = ReactDOM.createRoot(props.root);

        reactRoot.render(
          <RootResourceWidgetComponent
            value={props.value}
            onChange={props.onChange}
            type={options.type}
          />
        );
      },
    },
  };

  return rootResourceWidget;
}

export { rootResourceWidgetFactory };

function RootResourceWidgetComponent({
  value,
  onChange,
  type,
}: Pick<ExternalFieldCustomComponentProps, "value" | "onChange"> & {
  type: string;
}) {
  const { editorContext } = window.editorWindowAPI;
  const rootResourceId = `$.rootResource`;
  const rootResource = editorContext.resources.find<
    ResolvedResource<FetchCompoundResourceResultValues>
  >(
    (r): r is ResolvedResource<FetchCompoundResourceResultValues> =>
      r.id === rootResourceId && r.status === "success" && r.type === "object"
  );

  if (!rootResource) {
    return null;
  }

  return (
    <CompoundResourceValueSelect
      resource={rootResource}
      resourceKey={value.id ? value.key ?? "" : ""}
      resourceType={type}
      onResourceKeyChange={(newKey) => {
        editorContext.actions.runChange(() => {
          onChange({
            id: rootResourceId,
            key: newKey,
          });
        });
      }}
    />
  );
}
