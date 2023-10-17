import {
  EditableComponentToComponentConfig,
  findPathOfFirstAncestorOfType,
  InternalRenderableComponentDefinition,
} from "@easyblocks/app-utils";
import { AnyEditingField, CompiledComponentConfigBase } from "@easyblocks/core";
import { RichTextEditingFunction } from "../$richText.types";
import richTextPartStyles from "./$richTextPart.styles";

const editing: RichTextEditingFunction = ({
  editingInfo,
  __SECRET_INTERNALS__,
}) => {
  if (!__SECRET_INTERNALS__) {
    throw new Error("Missing __SECRET_INTERNALS__");
  }

  const { pathPrefix, editorContext } = __SECRET_INTERNALS__;
  const resultFields: Array<AnyEditingField> = [];

  const richTextPath = findPathOfFirstAncestorOfType(
    pathPrefix,
    "$richText",
    editorContext.form
  );

  const richTextBlockPath = findPathOfFirstAncestorOfType(
    pathPrefix,
    "$richTextBlockElement",
    editorContext.form
  );

  resultFields.push(
    {
      type: "fields",
      path: richTextPath,
      filters: {
        group: ["Size", "Margins"],
      },
    },
    ...editingInfo.fields,
    {
      type: "field",
      path: `${richTextBlockPath}.type`,
    },
    {
      type: "field",
      path: `${richTextPath}.isListStyleAuto`,
    },
    {
      type: "field",
      path: `${richTextPath}.mainFont`,
    },
    {
      type: "field",
      path: `${richTextPath}.mainColor`,
    },
    {
      type: "fields",
      path: richTextPath,
      filters: {
        group: ["Accessibility and SEO"],
      },
    }
  );

  try {
    // We add fields from inline-wrapper to show current values of filtered fields and any additional field within
    // sidebar when text is selected.
    const inlineWrapperPath = findPathOfFirstAncestorOfType(
      pathPrefix,
      "$richTextInlineWrapperElement",
      editorContext.form
    );

    resultFields.push({ type: "fields", path: inlineWrapperPath });
  } catch (error) {
    // When $richTextPart is outside of wrapper element, we add field for displaying action schema prop to allow
    // to add action to selected text without putting it into schemas of $richTextPart.
    resultFields.push({
      type: "field",
      path: `$action`,
    });

    // if (
    //   process.env.NEXT_PUBLIC_SHOPSTORY_FEATURE_RICH_TEXT_TEXT_MODIFIERS ===
    //   "enabled"
    // ) {
    //   const textModifierField = getTinaField(
    //     {
    //       ...optionalTextModifierSchemaProp,
    //       prop: "$textModifier",
    //       definition: findComponentDefinitionById(
    //         "$richTextInlineWrapperElement",
    //         editorContext
    //       )!,
    //       defaultValue: [],
    //       visible: true,
    //     },
    //     editorContext
    //   );

    //   resultFields.push({
    //     ...textModifierField,
    //     name: `${pathPrefix}.$textModifier`,
    //   });
    // }
  }

  return {
    fields: resultFields,
  };
};

const richTextPartEditableComponent: InternalRenderableComponentDefinition<"$richTextPart"> =
  {
    id: "$richTextPart",
    label: "Text",
    schema: [
      {
        prop: "value",
        type: "string",
        visible: false,
        group: "Text",
      },
      {
        prop: "font",
        label: "Style",
        type: "font",
        group: "Text",
      },
      {
        prop: "color",
        label: "Color",
        type: "color",
        group: "Text",
      },
    ],
    editing,
    styles: richTextPartStyles,
  };

type RichTextPartComponentConfig = EditableComponentToComponentConfig<
  typeof richTextPartEditableComponent
> & {
  value: string;
  color: Record<string, any>;
  font: Record<string, any>;
};

type RichTextPartCompiledComponentConfig = CompiledComponentConfigBase<
  RichTextPartComponentConfig["_template"],
  {
    value: string;
    color: Record<string, any>;
    font: Record<string, any>;
  }
> & {
  styled: Omit<ReturnType<typeof richTextPartStyles>, "__props">;
  components: {
    Text: Record<string, any>;
  };
};

export { richTextPartEditableComponent };
export type {
  RichTextPartComponentConfig,
  RichTextPartCompiledComponentConfig,
};
