import { SSProductPicker, SSProductPickerAPI } from "@easyblocks/design-system";
import React from "react";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";

type ProductPickerFieldProps = {
  api: SSProductPickerAPI;
};

const ProductPickerField = wrapFieldsWithMeta<any, ProductPickerFieldProps>(
  ({ input, field }) => {
    return (
      <SSProductPicker
        value={input.value}
        onChange={(newId) => {
          input.onChange({
            ...input.value,
            ...newId,
          });
        }}
        api={field.api}
        clearable={true}
      />
    );
  },
  { layout: "column", noWrap: true }
);

export const ProductPickerFieldPlugin = {
  __type: "field",
  name: "product",
  Component: ProductPickerField,
};
