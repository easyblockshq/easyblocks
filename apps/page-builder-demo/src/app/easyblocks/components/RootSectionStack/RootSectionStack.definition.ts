import {
  ChildComponentEditingInfo,
  EditingField,
  NoCodeComponentDefinition,
  Config,
} from "@easyblocks/core";
import { rootSectionStackStyles } from "./RootSectionStack.styles";
import { productWidget } from "@/app/easyblocks/externalData/product/productWidget";

const rootSectionStackDefinitionBase: NoCodeComponentDefinition = {
  id: "RootSectionStack",
  styles: rootSectionStackStyles,
  editing: ({ editingInfo }) => {
    const data = editingInfo.components
      .data as Array<ChildComponentEditingInfo>;

    return {
      components: {
        data: data.map((item, index) => {
          let fields = item.fields;

          if (index > 0) {
            fields = [
              {
                ...(data[index - 1].fields[1] as EditingField),
                label: "Top",
              },
              fields[1],
            ];
          }

          return {
            fields,
          };
        }),
      },
    };
  },
  schema: [
    {
      prop: "data",
      label: "data",
      type: "component-collection",
      picker: "large",
      accepts: ["section"],
      itemFields: [
        {
          prop: "topMargin", // property only for first value!
          label: "Top",
          type: "space",
          group: "Section margins",
          defaultValue: {
            tokenId: "32",
          },
          params: {
            autoConstant: 24,
          },
        },
        {
          prop: "bottomMargin",
          label: "Bottom",
          type: "space",
          group: "Section margins",
          defaultValue: {
            tokenId: "32",
          },
          params: {
            autoConstant: 24,
          },
        },
      ],
    },
  ],
};

function rootSectionStackDefinition(args: {
  id: string;
  label?: string;
  rootParams?: NoCodeComponentDefinition["rootParams"];
}): NoCodeComponentDefinition {
  const { id, label, rootParams } = args;

  return {
    ...rootSectionStackDefinitionBase,
    id,
    label,
    rootParams,
  };
}

export const productPageDefinition = rootSectionStackDefinition({
  id: "ProductPage",
  label: "Product Page",
  rootParams: [
    {
      prop: "product",
      label: "Product",
      widgets: [productWidget],
    },
    {
      prop: "fallbackProduct",
      label: "Second Product",
      widgets: [productWidget],
    },
  ],
});

export const standardPageDefinition = rootSectionStackDefinition({
  id: "StandardPage",
  label: "Page",
});
