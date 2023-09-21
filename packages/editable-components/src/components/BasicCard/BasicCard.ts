import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import {
  BooleanSchemaProp,
  ComponentSchemaProp,
  EditingFunctionInput,
  SchemaProp,
} from "@easyblocks/core";
import { borderSchemaProps } from "../../borderHelpers";
import {
  arePaddingFieldsSeparate,
  basicCardController,
} from "./BasicCard.controller";
import basicCardStyles from "./BasicCard.styles";
import { BasicCardCompiledValues } from "./BasicCard.types";

export const basicCardDefinition: InternalRenderableComponentDefinition<"$BasicCard"> =
  {
    id: "$BasicCard",
    tags: ["notrace"],
    pasteSlots: ["Stack"],
    styles: basicCardStyles,
    // @ts-expect-error
    editing: ({
      values,
      editingInfo,
    }: EditingFunctionInput<BasicCardCompiledValues>) => {
      const {
        paddingFields,
        hideContent,
        noBorders,
        enableContent,
        ignoreSize,
      } = basicCardController(values);

      const fields = Object.fromEntries(
        editingInfo.fields.map((f) => [f.path, f])
      );

      if (/*noBackground || */ ignoreSize) {
        fields.size.visible = false;
      }

      fields.paddingLeft.visible = false;
      fields.paddingRight.visible = false;
      fields.paddingTop.visible = false;
      fields.paddingBottom.visible = false;
      fields.paddingTopExternal.visible = false;
      fields.paddingBottomExternal.visible = false;
      fields.paddingLeftExternal.visible = false;
      fields.paddingRightExternal.visible = false;

      fields.cornerRadius.visible = !noBorders;
      borderSchemaProps("whatever").forEach((schemaProp) => {
        if (noBorders) {
          fields[schemaProp.prop].visible = false;
        }
      });

      if (arePaddingFieldsSeparate(paddingFields.vertical)) {
        if (paddingFields.vertical.start === "internal") {
          fields.paddingTop.visible = true;
        } else if (paddingFields.vertical.start === "external") {
          fields.paddingTopExternal.visible = true;
        }

        if (paddingFields.vertical.end === "internal") {
          fields.paddingBottom.visible = true;
        } else if (paddingFields.vertical.end === "external") {
          fields.paddingBottomExternal.visible = true;
        }
      } else {
        if (paddingFields.vertical.both === "internal") {
          fields.paddingTop.visible = true;
          fields.paddingTop.label = "Padding vertical";
        } else if (paddingFields.vertical.both === "external") {
          fields.paddingTopExternal.visible = true;
          fields.paddingTopExternal.label = "Padding vertical";
        }
      }

      if (arePaddingFieldsSeparate(paddingFields.horizontal)) {
        if (paddingFields.horizontal.start === "internal") {
          fields.paddingLeft.visible = true;
        } else if (paddingFields.horizontal.start === "external") {
          fields.paddingLeftExternal.visible = true;
        }

        if (paddingFields.horizontal.end === "internal") {
          fields.paddingRight.visible = true;
        } else if (paddingFields.horizontal.end === "external") {
          fields.paddingRightExternal.visible = true;
        }
      } else {
        if (paddingFields.horizontal.both === "internal") {
          fields.paddingLeft.visible = true;
          fields.paddingLeft.label = "Padding horizontal";
        } else if (paddingFields.horizontal.both === "external") {
          fields.paddingLeftExternal.visible = true;
          fields.paddingLeftExternal.label = "Padding horizontal";
        }
      }

      const myFields = [...editingInfo.fields];

      // If hideContent, we must hide the switch
      if (hideContent) {
        fields.enableContent.visible = false;
      }

      if (hideContent || !enableContent) {
        editingInfo.fields.forEach((field) => {
          if (field.group === "Stack" && field.path !== "enableContent") {
            field.visible = false;
          }
        });
      }

      return {
        fields: myFields,
        components: {
          Background: {
            selectable: false,
          },
          Stack: {
            selectable: false,
          },
        },
      };
    },
    schema: [
      {
        prop: "size", // main image size
        label: "Size",
        type: "stringToken",
        tokenId: "aspectRatios",
        extraValues: ["grid-baseline", "fit-content", "fit-background"],
        group: "General",
      },
      {
        prop: "Background",
        label: "Background",
        type: "component",
        componentTypes: ["image"],
        visible: true,
        group: "Background",
      },

      ...borderSchemaProps("Border and shadow"),

      {
        prop: "cornerRadius",
        label: "Corner radius",
        type: "select$",
        options: Array.from(Array(30).keys()).map((x) => x.toString()),
        group: "Border and shadow",
      },

      {
        prop: "enableContent",
        label: "Visible",
        type: "boolean",
        defaultValue: true,
        group: "Stack",
        visible: false,
      },

      {
        prop: "position",
        label: "Position",
        type: "select$",
        options: [
          "top-left",
          "top-center",
          "top-right",
          "center-left",
          "center-center",
          "center-right",
          "bottom-left",
          "bottom-center",
          "bottom-right",
        ],
        group: "Stack",
      },

      // Standard offsets
      {
        prop: "paddingLeft",
        label: "Padding left",
        type: "space",
        group: "Stack",
        defaultValue: {
          value: "24px",
          ref: "24",
        },
      },
      {
        prop: "paddingRight",
        label: "Padding right",
        type: "space",
        group: "Stack",
        defaultValue: {
          value: "24px",
          ref: "24",
        },
      },
      {
        prop: "paddingTop",
        label: "Padding top",
        type: "space",
        group: "Stack",
        defaultValue: {
          value: "24px",
          ref: "24",
        },
      },
      {
        prop: "paddingBottom",
        label: "Padding bottom",
        type: "space",
        group: "Stack",
        defaultValue: {
          value: "24px",
          ref: "24",
        },
      },
      {
        prop: "paddingLeftExternal",
        label: "Padding left",
        type: "space",
        group: "Stack",
        defaultValue: {
          value: "0px",
          ref: "0",
        },
      },
      {
        prop: "paddingRightExternal",
        label: "Padding right",
        type: "space",
        group: "Stack",
        defaultValue: {
          value: "0px",
          ref: "0",
        },
      },
      {
        prop: "paddingTopExternal",
        label: "Padding top",
        type: "space",
        group: "Stack",
        defaultValue: {
          value: "0px",
          ref: "0",
        },
      },
      {
        prop: "paddingBottomExternal",
        label: "Padding bottom",
        type: "space",
        group: "Stack",
        defaultValue: {
          value: "0px",
          ref: "0",
        },
      },

      {
        prop: "edgeMarginProtection",
        label: "Snap to container margin",
        type: "boolean$",
        defaultValue: true,
        group: "Stack",
      },

      // {
      //   prop: "edgeMargin",
      //   label: "Edge margin",
      //   type: "space",
      //   extraValues: ["edge"],
      //   group: "Properties",
      // },

      {
        prop: "Stack",
        label: "Stack",
        type: "component-fixed",
        componentType: "$stack",
      },
    ],
  };

// Let's build basic background card schema
const basicBackgroundCardSchema: SchemaProp[] = [...basicCardDefinition.schema];

// extra values don't have "fit-background"
// const sizeSchemaProp = basicBackgroundCardSchema.find(
//   (schemaProp) => schemaProp.prop === "size"
// ) as StringTokenSchemaProp;
// sizeSchemaProp.extraValues = ["grid-baseline", "fit-background"];

// background is required
const backgroundSchemaPropIndex = basicBackgroundCardSchema.findIndex(
  (schemaProp) => schemaProp.prop === "Background"
);

basicBackgroundCardSchema[backgroundSchemaPropIndex] = {
  ...basicBackgroundCardSchema[backgroundSchemaPropIndex],
  required: true,
} as ComponentSchemaProp;

// enable content
const enableContentSchemaPropIndex = basicBackgroundCardSchema.findIndex(
  (schemaProp) => schemaProp.prop === "enableContent"
);

basicBackgroundCardSchema[enableContentSchemaPropIndex] = {
  ...basicBackgroundCardSchema[enableContentSchemaPropIndex],
  visible: true,
  defaultValue: true,
} as BooleanSchemaProp;

export const basicBackgroundCardDefinition: InternalRenderableComponentDefinition<"$BasicCardBackground"> =
  {
    ...basicCardDefinition,
    id: "$BasicCardBackground",
    schema: basicBackgroundCardSchema,
    label: "Banner cover",
  };
