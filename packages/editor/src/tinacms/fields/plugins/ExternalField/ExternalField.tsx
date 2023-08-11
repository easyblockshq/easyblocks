import {
  AnyField,
  AnyTinaField,
  CustomResourceSchemaProp,
  CustomResourceWithVariantsSchemaProp,
  ExternalFieldCustom,
  ExternalFieldType,
  Field,
  UnresolvedResource,
} from "@easyblocks/core";
import { useToaster } from "@easyblocks/design-system";
import { toArray } from "@easyblocks/utils";
import { useUser } from "@supabase/auth-helpers-react";
import React, { useEffect, useRef } from "react";
import { css } from "styled-components";
import { useEditorContext } from "../../../../EditorContext";
import { useApiClient } from "../../../../infrastructure/ApiClientProvider";
import { FieldMixedValue } from "../../../../types";
import { FieldBuilder, FieldRenderProps } from "../../../form-builder";
import { isMixedFieldValue } from "../../components/isMixedFieldValue";
import { ResourceVariantsMenu } from "../ResponsiveField/ResponsiveFieldPlugin";
import { FieldMetaWrapper } from "../wrapFieldWithMeta";

/**
 * Custom field launcher is just a "function call".
 *
 * The field function (component) is surely not bundled together with Editor's React.
 * So if devs want to write it in React, they need to use separate ReactDOM.render.
 */
function CustomFieldLauncher(props: {
  field: {
    externalField: ExternalFieldCustom;
  };
  input: {
    value: UnresolvedResource;
    onChange: (value: UnresolvedResource) => void;
  };
}) {
  const apiClient = useApiClient();
  const editorContext = useEditorContext();
  const user = useUser();
  const toaster = useToaster();

  const externalField: ExternalFieldType = props.field.externalField;

  if (externalField.type !== "custom") {
    throw new Error("should never happen"); // type narrowing
  }

  const rootNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const maybeCleanup = props.field.externalField.component({
      root: rootNodeRef.current!,
      value: props.input.value,
      onChange: (value) => {
        props.input.onChange({
          ...props.input.value,
          ...value,
        });
      },
      apiClient:
        user !== null && !editorContext.isPlayground ? apiClient : undefined,
      projectId: editorContext.project?.id,
      notify: {
        error: (message) => {
          toaster.error(message);
        },
      },
    });

    return () => {
      if (maybeCleanup) {
        maybeCleanup();
      }
    };
  });

  return (
    <div
      ref={rootNodeRef}
      css={css`
        width: 100%;
      `}
    ></div>
  );
}

interface ExternalField
  extends Field<
    AnyField,
    CustomResourceSchemaProp | CustomResourceWithVariantsSchemaProp
  > {
  externalField: ExternalFieldType;
}

interface ExternalFieldProps
  extends FieldRenderProps<UnresolvedResource | FieldMixedValue, any> {
  field: ExternalField;
}

export const ExternalFieldComponent = (props: ExternalFieldProps) => {
  const { tinaForm, field, input } = props;
  const editorContext = useEditorContext();
  const fieldNames = toArray(field.name);

  const originalFormat = field.format ? field.format : (x: any) => x;
  const originalParse = field.parse ? field.parse : (x: any) => x;

  const externalField = props.field.externalField;

  let component: AnyTinaField["component"];
  const extraParams: Record<string, any> = {};

  // So far, we have 2 kinds of external fields, item-picker and custom
  if (externalField.type === "custom") {
    component = CustomFieldLauncher;
  } else if (externalField.type === "item-picker") {
    // this is legacy, but item-picker used to be "product picker". It turns out it's much more generic but old names stayed. To refactor.
    component = "product";
    extraParams.api = {
      products: externalField.getItems,
      product: externalField.getItemById,
    };
  } else {
    throw new Error("unknown type");
  }

  const content = (
    <FieldBuilder
      form={tinaForm}
      field={{
        ...field,
        component,
        ...extraParams,
        format: (x: any, name) => {
          return originalFormat(x, name, field);
        },
        parse: (value: UnresolvedResource, name) => {
          return originalParse(value, name, field);
        },
      }}
      noWrap={props.noWrap}
    />
  );

  const { value } = input;
  const { schemaProp } = field;

  return (
    // @ts-expect-error
    <FieldMetaWrapper
      {...props}
      form={tinaForm}
      layout="column"
      renderDecoration={
        !isMixedFieldValue(value) &&
        "variants" in schemaProp &&
        schemaProp.variants.length > 1
          ? () => {
              return (
                <ResourceVariantsMenu
                  resourceVariants={schemaProp.variants}
                  selectedVariantId={
                    value.variant ?? schemaProp.defaultVariantId
                  }
                  onChange={(variantId) => {
                    editorContext.actions.runChange(() => {
                      fieldNames.forEach((fieldName) => {
                        const newFieldValue: UnresolvedResource = {
                          id: null,
                          variant: variantId,
                        };

                        editorContext.form.change(fieldName, newFieldValue);
                      });
                    });
                  }}
                />
              );
            }
          : undefined
      }
    >
      {content}
    </FieldMetaWrapper>
  );
};

export const ExternalFieldPlugin = {
  name: "external",
  Component: ExternalFieldComponent,
};
