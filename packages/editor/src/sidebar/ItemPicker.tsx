import { PickerItem } from "@easyblocks/core";
import { ProductPicker } from "@easyblocks/design-system";
import React from "react";

type ItemPickerProps = {
  value: string | null;
  onChange: (id: string | null) => void;
  getItems: (query: string) => Promise<Array<PickerItem>>;
  getItemById: (id: string) => Promise<PickerItem>;
  placeholder?: string;
};

function ItemPicker({
  value,
  onChange,
  getItemById,
  getItems,
  placeholder,
}: ItemPickerProps) {
  return (
    <ProductPicker
      value={value}
      onChange={onChange}
      api={{
        products: getItems,
        product: getItemById,
        placeholder,
      }}
    />
  );
}

export { ItemPicker };
