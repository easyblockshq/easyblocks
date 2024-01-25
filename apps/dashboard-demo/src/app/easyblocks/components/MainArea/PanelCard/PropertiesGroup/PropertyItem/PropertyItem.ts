import { NoCodeComponentDefinition } from "@easyblocks/core";

const propertyTextItem: NoCodeComponentDefinition = {
  id: "PropertyTextItem",
  schema: [
    {
      prop: "property",
      label: "Property",
      type: "propertyText",
    },
  ],
  styles({ params }) {
    return {
      props: {
        variant: params.variant,
      },
    };
  },
};

const propertyBooleanItem: NoCodeComponentDefinition = {
  id: "PropertyBooleanItem",
  schema: [
    {
      prop: "property",
      label: "Property",
      type: "propertyBoolean",
    },
  ],
  styles({ params }) {
    return {
      props: {
        variant: params.variant,
      },
    };
  },
};

const propertyDateItem: NoCodeComponentDefinition = {
  id: "PropertyDateItem",
  schema: [
    {
      prop: "property",
      label: "Property",
      type: "propertyDate",
    },
  ],
  styles({ params }) {
    return {
      props: {
        variant: params.variant,
      },
    };
  },
};

export { propertyBooleanItem, propertyDateItem, propertyTextItem };
