import {
  AnyTemplate,
  configMap,
  findComponentDefinition,
  findComponentDefinitionById,
  InternalComponentDefinition,
  isSpecialTemplate,
  isTemplate,
} from "@easyblocks/app-utils";
import { normalize } from "@easyblocks/compiler";
import {
  ConfigComponent,
  CustomComponent,
  getDefaultLocale,
  Template,
  IApiClient,
  isNoCodeComponentOfType,
  UserDefinedTemplate,
  InternalTemplate,
} from "@easyblocks/core";
import { EditorContextType } from "../EditorContext";
import { controlButton } from "./builtinTemplates/controlButton";
import { icon } from "./builtinTemplates/icon";
import { standardButton } from "./builtinTemplates/standardButton";
import { getRemoteUserTemplates } from "./getRemoteUserTemplates";
import { generateTextTemplate } from "./generateTextTemplate";
import { getBuiltInTemplates } from "./getBuiltinTemplates";

function getDefaultTemplateForDefinition(
  def: InternalComponentDefinition
): InternalTemplate {
  return {
    // id: def.id,
    label: def.label ?? def.id,
    thumbnail: def.previewImage,
    config: {
      _template: def.id,
    },
    isUserDefined: false,
    // label: "Default",
    // group: "My library",
  };
}

function findMappedTemplate(
  masterId: string,
  templates: Template[]
): Template | undefined {
  return templates.find((template) => {
    const mapToArray = Array.isArray(template.mapTo)
      ? template.mapTo
      : typeof template.mapTo === "string"
      ? [template.mapTo]
      : [];
    return mapToArray.includes(masterId);
  });
}

function findTemplatesOfType(
  templates: Template[],
  type: string,
  editorContext: EditorContextType
): Template[] {
  return templates.filter((template) => {
    const definition = findComponentDefinition(template.config, editorContext);

    if (!definition) {
      return false;
    }

    return isNoCodeComponentOfType(definition, type);
  });
}

function getMyLibraryTemplates(
  definitions: InternalComponentDefinition[],
  templates: Template[],
  editorContext: EditorContextType,
  filterType: string
): Template[] {
  // User defined templates from config
  const userDefinedTemplatesFromConfig: Template[] = findTemplatesOfType(
    templates,
    filterType,
    editorContext
  );
  const defaultTemplatesForDefinitions: Template[] = [];

  // We must also add default templates for components that don't have any template at all
  definitions
    .filter(
      (component) =>
        isNoCodeComponentOfType(component, filterType) &&
        !component.id.startsWith("$") &&
        !(component as CustomComponent).hidden
    )
    .forEach((definition) => {
      if (
        !userDefinedTemplatesFromConfig.find(
          (template) => template.config._template === definition.id
        )
      ) {
        defaultTemplatesForDefinitions.push(
          getDefaultTemplateForDefinition(definition)
        );
      }
    });

  const myLibraryTemplates: Template[] = [
    ...userDefinedTemplatesFromConfig,
    ...defaultTemplatesForDefinitions,
  ];

  return myLibraryTemplates.map((template) => ({
    ...template,
    group: "My library",
    previewImage:
      template.previewImage ??
      (filterType === "button" ? BUTTON_THUMBNAIL : undefined),
  }));
}

const BUTTON_THUMBNAIL =
  "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_button.png";

const VIDEO_THUMBNAIL =
  "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_video.png";

export async function getTemplates(
  editorContext: EditorContextType,
  apiClient: IApiClient,
  configTemplates: InternalTemplate[] = []
): Promise<Template[]> {
  let remoteUserDefinedTemplates: UserDefinedTemplate[] = [];

  const TEST = await getBuiltInTemplates(false);
  console.log("@@@@@@@", TEST);

  if (!editorContext.isPlayground && !editorContext.disableCustomTemplates) {
    const project = editorContext.project;
    if (!project) {
      throw new Error(
        "Trying to access templates API without project id. This is an unexpected error state."
      );
    }
    remoteUserDefinedTemplates = await await getRemoteUserTemplates(
      apiClient,
      project.id
    );
  }

  return getTemplatesInternal(
    editorContext,
    configTemplates,
    remoteUserDefinedTemplates
  );
}

function getNecessaryDefaultTemplates(
  components: InternalComponentDefinition[],
  templates: Template[]
) {
  const result: InternalTemplate[] = [];

  components.forEach((component) => {
    const componentTemplates = templates.filter(
      (template) => template.config._template === component.id
    );
    if (componentTemplates.length === 0) {
      result.push(getDefaultTemplateForDefinition(component));
    }
  });

  return result;
}

function normalizeTextLocales(
  config: ConfigComponent,
  editorContext: EditorContextType
) {
  return configMap(config, editorContext, ({ value, schemaProp }) => {
    if (schemaProp.type === "text") {
      const firstDefinedValue = Object.values(value.value).filter(
        (x) => x !== null && x !== undefined
      )[0];

      return {
        ...value,
        value: {
          [getDefaultLocale(editorContext.locales).code]: firstDefinedValue,
        },
      };
    } else if (schemaProp.type === "component-collection-localised") {
      const firstDefinedValue = Object.values(value).filter(
        (x) => x !== null && x !== undefined
      )[0];

      return {
        [getDefaultLocale(editorContext.locales).code]: firstDefinedValue,
      };
    }

    return value;
  });
}

export function getTemplatesInternal(
  editorContext: EditorContextType,
  configTemplates: InternalTemplate[],
  remoteUserDefinedTemplates: UserDefinedTemplate[]
): Template[] {
  // If a component doesn't have a template, here's one added
  const allBuiltinTemplates = [
    ...configTemplates,
    ...getNecessaryDefaultTemplates(
      editorContext.definitions.components,
      configTemplates
    ),
    ...getNecessaryDefaultTemplates(
      editorContext.definitions.links,
      configTemplates
    ),
    ...getNecessaryDefaultTemplates(
      editorContext.definitions.actions,
      configTemplates
    ),
    ...getNecessaryDefaultTemplates(
      editorContext.definitions.textModifiers,
      configTemplates
    ),
  ];

  const allUserTemplates = [
    ...remoteUserDefinedTemplates,
    ...allBuiltinTemplates,
  ];

  return allUserTemplates
    .filter((template) => {
      return template.config._itemProps
        ? Object.keys(template.config._itemProps).every((componentId) =>
            findComponentDefinitionById(componentId, editorContext)
          )
        : true;
    })
    .map((template) => {
      return {
        ...template,
        config: normalizeTextLocales(
          normalize(template.config, editorContext),
          editorContext
        ),
      };
    });

  // /**
  //  * MASTER CONFIGS
  //  */
  // // Default master templates
  // const masterConfigs: Record<string, ConfigComponent> = {
  //   buttonSliderLeft: controlButton(
  //     editorContext,
  //     icon("$sliderLeft", "$dark"),
  //     "Previous",
  //     40,
  //     24,
  //     "#D8D8D880"
  //   ),
  //   buttonSliderRight: controlButton(
  //     editorContext,
  //     icon("$sliderRight", "$dark"),
  //     "Next",
  //     40,
  //     24,
  //     "#D8D8D880"
  //   ),
  //   buttonSliderLeftDark: controlButton(
  //     editorContext,
  //     icon("$sliderLeft", "$light"),
  //     "Previous",
  //     40,
  //     24,
  //     "#00000080"
  //   ),
  //   buttonSliderRightDark: controlButton(
  //     editorContext,
  //     icon("$sliderRight", "$light"),
  //     "Next",
  //     40,
  //     24,
  //     "#00000080"
  //   ),
  //   buttonVideoPlay: controlButton(
  //     editorContext,
  //     icon("$play", "$light"),
  //     "Play",
  //     32,
  //     20,
  //     "#36363680"
  //   ),
  //   buttonVideoPause: controlButton(
  //     editorContext,
  //     icon("$pause", "$light"),
  //     "Pause",
  //     32,
  //     20,
  //     "#36363680"
  //   ),
  //   buttonVideoMute: controlButton(
  //     editorContext,
  //     icon("$mute", "$light"),
  //     "Mute",
  //     32,
  //     20,
  //     "#36363680"
  //   ),
  //   buttonVideoUnmute: controlButton(
  //     editorContext,
  //     icon("$unmute", "$light"),
  //     "Unmute",
  //     32,
  //     20,
  //     "#36363680"
  //   ),
  //   buttonLight: standardButton("$dark", "$light"),
  //   buttonDark: standardButton("$light", "$dark"),
  //   buttonTextLight: standardButton("$light", null),
  //   buttonTextDark: standardButton("$dark", null),
  //   productCard: {
  //     _template: "$CardPlaceholder",
  //   },
  //   actionTextModifierDefault: {
  //     _template: "$StandardActionStyles",
  //     isColorOverwriteEnabled: true,
  //     color: {
  //       $res: true,
  //       [editorContext.breakpointIndex]: {
  //         value: "#0166cc",
  //       },
  //     },
  //     hoverColor: {
  //       $res: true,
  //       [editorContext.breakpointIndex]: {
  //         ref: "black",
  //         value: "black",
  //       },
  //     },
  //     isHoverColorEnabled: false,
  //     underline: "enabled",
  //     opacity: "1",
  //     hoverOpacity: "1",
  //     hoverOpacityAnimationDuration: "100ms",
  //   },
  // };
  //
  // // video defined here because it uses above master configs (video buttons)
  // masterConfigs.video = {
  //   _template: "$video",
  //   enableControls: false,
  //   margin: {
  //     $res: true,
  //     [editorContext.mainBreakpointIndex]: {
  //       ref: "8",
  //       value: "8",
  //     },
  //   },
  //   gap: {
  //     $res: true,
  //     [editorContext.mainBreakpointIndex]: {
  //       ref: "8",
  //       value: "8",
  //     },
  //   },
  //   controlsPosition: {
  //     $res: true,
  //     [editorContext.mainBreakpointIndex]: "bottom-right",
  //   },
  //   PlayButton: [masterConfigs.buttonVideoPlay],
  //   PauseButton: [masterConfigs.buttonVideoPause],
  //   MuteButton: [masterConfigs.buttonVideoMute],
  //   UnmuteButton: [masterConfigs.buttonVideoUnmute],
  // };
  //
  // // Add _master property to all master configs
  // Object.keys(masterConfigs).forEach((id) => {
  //   masterConfigs[id]._master = id;
  // });
  //
  //
  //
  //
  // /**
  //  * SHARED TEMPLATES
  //  */
  // const gridCard4 = {
  //   _template: "$GridCard",
  //
  //   rightArrowPlacement: {
  //     $res: true,
  //     [editorContext.mainBreakpointIndex]: "center",
  //   },
  //   leftArrowPlacement: {
  //     $res: true,
  //     [editorContext.mainBreakpointIndex]: "center",
  //   },
  //   RightArrow: [masterConfigs.buttonSliderRight],
  //   LeftArrow: [masterConfigs.buttonSliderLeft],
  // };
  //
  // const gridCard2 = {
  //   _template: "$GridCard",
  //   rightArrowPlacement: {
  //     $res: true,
  //     [editorContext.mainBreakpointIndex]: "center",
  //   },
  //   leftArrowPlacement: {
  //     $res: true,
  //     [editorContext.mainBreakpointIndex]: "center",
  //   },
  //   RightArrow: [masterConfigs.buttonSliderRight],
  //   LeftArrow: [masterConfigs.buttonSliderLeft],
  //   numberOfItems: {
  //     ref: "2",
  //   },
  //   shouldSliderItemsBeVisibleOnMargin: false,
  // };
  //
  // // Cards
  // const myLibraryCards = getMyLibraryTemplates(
  //   editorContext.definitions.components,
  //   allUserTemplates,
  //   editorContext,
  //   "card"
  // );
  //
  // const allCards: InternalTemplate[] = [];
  //
  // if (editorContext.isMaster) {
  //   allCards.push({
  //     label: "(Master) Product Card",
  //     thumbnail: "https://shopstory.s3.eu-central-1.amazonaws.com/placeholder_banner_card.png", // temporary absolute path
  //     config: masterConfigs.productCard,
  //     isUserDefined: false
  //   });
  // }
  //
  // allCards.push(...myLibraryCards);
  //
  // if (editorContext.isMaster) {
  //   allCards.push({
  //     label: "Banner card",
  //     thumbnail: "https://shopstory.s3.eu-central-1.amazonaws.com/placeholder_banner_card.png", // temporary absolute path
  //     config: {
  //       _template: "$BannerCard2",
  //       mode: {
  //         $res: true,
  //         [editorContext.mainBreakpointIndex]: "none",
  //       },
  //       Card2: [
  //         {
  //           _template: "$BasicCardBackground",
  //           Background: [
  //             {
  //               _template: "$image",
  //             },
  //           ],
  //         },
  //       ],
  //       Card1: [
  //         {
  //           _template: "$BasicCard",
  //           size: {
  //             $res: true,
  //             [editorContext.mainBreakpointIndex]: {
  //               value: "fit-content",
  //             },
  //           },
  //         },
  //       ],
  //     },
  //     group: "Raw",
  //   });
  //
  //   allCards.push({
  //     label: "Grid / Slider",
  //     previewImage:
  //       "https://shopstory.s3.eu-central-1.amazonaws.com/placeholder_banner_card.png", // temporary absolute path
  //     config: gridCard2,
  //   });
  //
  //   if (process.env.NODE_ENV === "development") {
  //     allCards.push({
  //       label: "Legacy Banner card",
  //       previewImage:
  //         "https://shopstory.s3.eu-central-1.amazonaws.com/placeholder_banner_card.png", // temporary absolute path
  //       config: {
  //         _template: "$BannerCard",
  //         sideImagePosition: {
  //           $res: true,
  //           [editorContext.mainBreakpointIndex]: "top",
  //         },
  //         SideImage: [
  //           {
  //             _template: "$image",
  //           },
  //         ],
  //       },
  //     });
  //   }
  // }
  //
  // // Image, video
  //
  // const imageTemplate = {
  //   type: "Image",
  //   previewImage:
  //     "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_image.png",
  //   config: {
  //     _template: "$image",
  //   },
  // };
  //
  // const templatesDict: Record<string, AnyTemplate[]> = {
  //   item: [],
  //   section: [],
  //   card: [],
  //   button: [],
  //   action: [],
  //   actionTextModifier: [],
  //   symbol: [],
  //   image: [],
  // };
  //
  // // Items
  //
  // const myLibraryItems = getMyLibraryTemplates(
  //   editorContext.definitions.components,
  //   allUserTemplates,
  //   editorContext,
  //   "item"
  // );
  //
  // if (
  //   [
  //     "$richText",
  //     "$richTextBlockElement",
  //     "$richTextInlineWrapperElement",
  //     "$richTextLineElement",
  //     "$richTextPart",
  //   ].every((componentId) =>
  //     findComponentDefinitionById(componentId, editorContext)
  //   )
  // ) {
  //   templatesDict.item.push({
  //     type: "Text",
  //     previewImage:
  //       "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_text.png",
  //     config: normalize(generateTextTemplate(editorContext), editorContext),
  //   });
  //
  //   // always add empty button group
  //   templatesDict.item.push({
  //     type: "Button Group",
  //     previewImage:
  //       "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_button_group.png",
  //     config: {
  //       _template: "$buttons",
  //       gap: {
  //         $res: true,
  //         [editorContext.mainBreakpointIndex]: {
  //           ref: "12",
  //           value: "12px",
  //         },
  //       },
  //     },
  //   });
  // }
  //
  // templatesDict.item.push(imageTemplate);
  //
  // /**
  //  * Exception
  //  *
  //  * 1. This function takes care of the MAIN VIDEO ENTRY in the item list.
  //  * 2. Main video entry is always high in the list and has only one instance. It's the DEFAULT.
  //  * 3. The rest of templates will be later in the list.
  //  * 4. It assumes that the video is always of $video type. If someone added custom video type as main, it would be impossible to add custom $video types. We should later research this to make it more consistent.
  //  *
  //  * WARNING: this function returns the main video type and also, if possible, removes the old one from the list (if it was mapped to the main one).
  //  *
  //  */
  // function getVideoTemplate(myLibraryTemplates: Template[]): Template {
  //   if (editorContext.isMaster) {
  //     return {
  //       type: "Video",
  //       label: "(Master) Shopstory default",
  //       previewImage: VIDEO_THUMBNAIL,
  //       config: masterConfigs.video,
  //     };
  //   } else {
  //     // Let's find the default video template in the list and put it here in the major position
  //     const customDefaultVideo = findMappedTemplate(
  //       "video",
  //       myLibraryTemplates
  //     );
  //
  //     if (customDefaultVideo) {
  //       const index = myLibraryTemplates.indexOf(customDefaultVideo);
  //       myLibraryTemplates.splice(index, 1);
  //
  //       return {
  //         ...customDefaultVideo,
  //         type: "Video",
  //         previewImage: VIDEO_THUMBNAIL,
  //       };
  //     } else {
  //       return {
  //         type: "Video",
  //         previewImage: VIDEO_THUMBNAIL,
  //         config: {
  //           ...masterConfigs.video,
  //           _master: undefined,
  //         },
  //       };
  //     }
  //   }
  // }
  //
  // templatesDict.item.push(getVideoTemplate(myLibraryItems));
  //
  // templatesDict.item.push({
  //   type: "Grid / Slider",
  //   config: gridCard2,
  // });
  //
  // // always add two items
  // templatesDict.item.push({
  //   type: "Horizontal layout",
  //   previewImage:
  //     "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_horizontal_layout.png",
  //   config: {
  //     _template: "$twoItems",
  //   },
  // });
  //
  // // always add separator
  // templatesDict.item.push({
  //   type: "Separator",
  //   previewImage:
  //     "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_separator.png",
  //   config: {
  //     _template: "$separator",
  //   },
  // });
  //
  // templatesDict.item.push({
  //   type: "Vimeo Player",
  //   previewImage:
  //     "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_video.png",
  //
  //   config: {
  //     _template: "$vimeoPlayer",
  //   },
  // });
  //
  // templatesDict.item.push({
  //   type: "Card",
  //   specialRole: "card",
  // });
  //
  // templatesDict.item.push(...myLibraryItems);
  // // templatesDict.item.push(...allCards);
  //
  // if (
  //   [
  //     "$richText",
  //     "$richTextBlockElement",
  //     "$richTextInlineWrapperElement",
  //     "$richTextLineElement",
  //     "$richTextPart",
  //   ].every((componentId) =>
  //     findComponentDefinitionById(componentId, editorContext)
  //   )
  // ) {
  //   // All font instances to the bottom (to be searchable)
  //   Object.entries(editorContext.theme.fonts).forEach(([key, value]) => {
  //     if (key.startsWith("__")) {
  //       return;
  //     }
  //
  //     templatesDict.item.push({
  //       label: value.label ?? key,
  //       type: "Text",
  //       previewImage:
  //         "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_text.png",
  //       config: normalize(generateTextTemplate(editorContext, { fontToken: key }), editorContext),
  //     });
  //   });
  // }
  //
  // if (
  //   process.env.NODE_ENV === "development" &&
  //   findComponentDefinitionById("$text", editorContext)
  // ) {
  //   templatesDict.item.push({
  //     label: "Legacy text",
  //     type: "Font",
  //     previewImage:
  //       "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_text.png",
  //     config: normalize(
  //       { _template: "$text", color: "black", font: { ref: "$body" } },
  //       editorContext
  //     ),
  //   });
  // }
  //
  // // Sections
  //
  // const myLibrarySections = getMyLibraryTemplates(
  //   editorContext.definitions.components,
  //   allUserTemplates,
  //   editorContext,
  //   "section"
  // );
  // templatesDict.section.push(...myLibrarySections);
  //
  // // Raw
  // if (editorContext.isMaster) {
  //   templatesDict.section.push({
  //     type: "Section",
  //     label: "Banner 2",
  //     previewImage:
  //       "https://shopstory.s3.eu-central-1.amazonaws.com/placeholder_banner.png", // temporary absolute path
  //     group: "Raw",
  //     config: {
  //       _template: "$BannerSection2",
  //       Component: [
  //         {
  //           _template: "$BannerCard2",
  //           Card2: [
  //             {
  //               _template: "$BasicCardBackground",
  //               Background: [
  //                 {
  //                   _template: "$image",
  //                 },
  //               ],
  //             },
  //           ],
  //           Card1: [
  //             {
  //               _template: "$BasicCard",
  //               size: {
  //                 $res: true,
  //                 [editorContext.mainBreakpointIndex]: {
  //                   value: "fit-content",
  //                 },
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   });
  //
  //   templatesDict.section.push({
  //     type: "Section",
  //     label: "Grid / Slider",
  //     previewImage:
  //       "https://shopstory.s3.eu-central-1.amazonaws.com/placeholder_slider_grid.png", // temporary absolute path
  //     config: {
  //       _template: "$Grid",
  //       Component: [gridCard4],
  //     },
  //     group: "Raw",
  //   });
  //
  //   templatesDict.section.push({
  //     type: "Section",
  //     label: "Two Cards",
  //     previewImage:
  //       "https://shopstory.s3.eu-central-1.amazonaws.com/placeholder_banner.png", // temporary absolute path
  //     config: {
  //       _template: "$TwoCards",
  //     },
  //     group: "Raw",
  //   });
  // }
  //
  // // card
  // templatesDict.card.push(...allCards);
  //
  // // button
  // if (editorContext.isMaster) {
  //   templatesDict.button.push({
  //     label: "(Master) Button dark",
  //     previewImage: BUTTON_THUMBNAIL,
  //     config: masterConfigs.buttonDark,
  //     group: "Master templates",
  //   });
  //
  //   templatesDict.button.push({
  //     label: "(Master) Button light",
  //     previewImage: BUTTON_THUMBNAIL,
  //     config: masterConfigs.buttonLight,
  //     group: "Master templates",
  //   });
  //
  //   templatesDict.button.push({
  //     label: "(Master) Text Button dark",
  //     previewImage: BUTTON_THUMBNAIL,
  //     config: masterConfigs.buttonTextDark,
  //     group: "Master templates",
  //   });
  //
  //   templatesDict.button.push({
  //     label: "(Master) Text Button light",
  //     previewImage: BUTTON_THUMBNAIL,
  //     config: masterConfigs.buttonTextLight,
  //     group: "Master templates",
  //   });
  //
  //   templatesDict.button.push({
  //     label: "(Master) Button slider right - light",
  //     previewImage: BUTTON_THUMBNAIL,
  //     config: masterConfigs.buttonSliderRight,
  //     group: "Master templates",
  //   });
  //
  //   templatesDict.button.push({
  //     label: "(Master) Button slider left - light",
  //     previewImage: BUTTON_THUMBNAIL,
  //     config: masterConfigs.buttonSliderLeft,
  //   });
  //
  //   templatesDict.button.push({
  //     label: "(Master) Button slider right - dark",
  //     previewImage: BUTTON_THUMBNAIL,
  //     config: masterConfigs.buttonSliderRightDark,
  //     group: "Master templates",
  //   });
  //
  //   templatesDict.button.push({
  //     label: "(Master) Button slider left - dark",
  //     previewImage: BUTTON_THUMBNAIL,
  //     config: masterConfigs.buttonSliderLeftDark,
  //     group: "Master templates",
  //   });
  // }
  //
  // const myLibraryButtons = getMyLibraryTemplates(
  //   editorContext.definitions.components,
  //   allUserTemplates,
  //   editorContext,
  //   "button"
  // );
  //
  // templatesDict.button.push(...myLibraryButtons);
  //
  // templatesDict.button.push({
  //   label: "Default",
  //   previewImage:
  //     "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_button.png",
  //   config: standardButton("$light", "$dark"),
  // });
  //
  // templatesDict.button.push({
  //   label: "Text",
  //   previewImage:
  //     "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_button.png",
  //   config: {
  //     _template: "$StandardButton",
  //     hasBackground: false,
  //     hasBorder: false,
  //     underline: "on",
  //   },
  // });
  //
  // templatesDict.button.push({
  //   label: "Default",
  //   previewImage:
  //     "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_button.png",
  //   config: controlButton(
  //     editorContext,
  //     icon("$sliderLeft", "$dark"),
  //     "Slider left",
  //     32,
  //     24,
  //     "#D8D8D880"
  //   ),
  // });
  //
  // // actions and links
  // const myLibraryActions = getMyLibraryTemplates(
  //   editorContext.definitions.actions,
  //   allUserTemplates,
  //   editorContext,
  //   "action"
  // );
  //
  // const myLibraryLinks = getMyLibraryTemplates(
  //   editorContext.definitions.links,
  //   allUserTemplates,
  //   editorContext,
  //   "actionLink"
  // );
  //
  // templatesDict.action = [...myLibraryActions, ...myLibraryLinks];
  // templatesDict.action.push({
  //   config: {
  //     _template: "$StandardLink",
  //     url: {
  //       id: "local.96b6f39a-916f-43a5-bfdd-d78ca8f0b72d",
  //       value: {
  //         en: "https://google.com",
  //       },
  //     },
  //     shouldOpenInNewWindow: true,
  //     _itemProps: {
  //       $BannerCard: {
  //         action: {},
  //       },
  //     },
  //     traceId: "$StandardLink-8e01dd26",
  //   },
  // });
  //
  // // text modifiers
  // const myLibraryTextModifiers = getMyLibraryTemplates(
  //   editorContext.definitions.textModifiers,
  //   allUserTemplates,
  //   editorContext,
  //   "actionTextModifier"
  // );
  //
  // if (editorContext.isMaster) {
  //   templatesDict.actionTextModifier.push({
  //     label: "(MASTER) Default link styling",
  //     config: masterConfigs.actionTextModifierDefault,
  //     isDefaultTextModifier: true,
  //   });
  // } else {
  //   templatesDict.actionTextModifier.push(...myLibraryTextModifiers);
  //
  //   const defaultTemplate = findMappedTemplate(
  //     "actionTextModifierDefault",
  //     templatesDict.actionTextModifier.filter(isTemplate)
  //   );
  //
  //   if (defaultTemplate) {
  //     defaultTemplate.isDefaultTextModifier = true;
  //   }
  //
  //   templatesDict.actionTextModifier.push({
  //     label: "Shopstory default - blue link",
  //     config: {
  //       ...masterConfigs.actionTextModifierDefault,
  //       _master: undefined, // just default text modifier available in the list for user
  //     },
  //     isDefaultTextModifier: defaultTemplate === undefined,
  //   });
  // }
  //
  // // symbols
  // templatesDict.symbol.push({
  //   label: "Icon",
  //   previewImage:
  //     "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_button.png",
  //   config: icon("$sliderLeft", "$dark"),
  // });
  //
  // // background
  // const myLibraryBackgrounds = getMyLibraryTemplates(
  //   editorContext.definitions.components,
  //   allUserTemplates,
  //   editorContext,
  //   "image"
  // );
  //
  // templatesDict.image.push({
  //   type: "Solid color",
  //   config: {
  //     _template: "$backgroundColor",
  //   },
  // });
  //
  // templatesDict.image.push(imageTemplate);
  //
  // templatesDict.image.push(getVideoTemplate(myLibraryBackgrounds));
  // templatesDict.image.push(...myLibraryBackgrounds);
  //
  // templatesDict.image.push({
  //   type: "Vimeo Player",
  //   previewImage:
  //     "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_video.png",
  //
  //   config: {
  //     _template: "$vimeoPlayer",
  //   },
  // });
  //
  // // let templates = templatesDict[componentType];
  // const allTemplates: AnyTemplate[] = [];
  //
  // Object.values(templatesDict).forEach((categoryTemplates) => {
  //   allTemplates.push(...categoryTemplates);
  // });
  //
  // /**
  //  * MASTER TEMPLATE MAPPING
  //  */
  //
  // function replaceMasterTemplates(val: any): any {
  //   if (Array.isArray(val)) {
  //     return val.map((item) => replaceMasterTemplates(item));
  //   } else if (typeof val === "object" && val !== null) {
  //     const isMasterConfig =
  //       typeof val._template === "string" && typeof val._master === "string";
  //
  //     if (isMasterConfig) {
  //       const mappedConfig = findMappedTemplate(
  //         val._master,
  //         allTemplates.filter(isTemplate)
  //       )?.config;
  //
  //       if (mappedConfig) {
  //         return {
  //           ...mappedConfig,
  //           _itemProps: val._itemProps,
  //         };
  //       }
  //     }
  //
  //     const newObj: any = {};
  //     for (const key in val) {
  //       newObj[key] = replaceMasterTemplates(val[key]);
  //     }
  //
  //     delete newObj._master;
  //     return newObj;
  //   }
  //   return val;
  // }
  //
  // for (const key in templatesDict) {
  //   if (!editorContext.isMaster) {
  //     // in user environment we first exclude all the master templates, then replace all masters to mapped templates
  //     templatesDict[key] = templatesDict[key].map((template) => {
  //       if (isSpecialTemplate(template)) {
  //         return template;
  //       }
  //
  //       return {
  //         ...template,
  //         config: replaceMasterTemplates(template.config),
  //       };
  //     });
  //   }
  //
  //   /**
  //    * NORMALIZE TEMPLATES
  //    */
  //   templatesDict[key] = templatesDict[key]
  //     .filter(
  //       (template) =>
  //         !isSpecialTemplate(template) &&
  //         findComponentDefinitionById(
  //           template.config._template,
  //           editorContext
  //         ) &&
  //         (template.config._itemProps
  //           ? Object.keys(template.config._itemProps).every((componentId) =>
  //               findComponentDefinitionById(componentId, editorContext)
  //             )
  //           : true)
  //     )
  //     .map((template) => {
  //       if (isSpecialTemplate(template)) {
  //         return template;
  //       }
  //
  //       return {
  //         ...template,
  //         config: normalize(template.config, editorContext),
  //       };
  //     });
  //
  //   /**
  //    * NORMALIZE LOCALES
  //    */
  //
  //   /**
  //    * This counter is for the sake of adding consistent template ids when they're not available.
  //    * The thing is that when templates are presented in a list, we need to set a key. Key must be unique per template.
  //    * As we don't have ids we must fill them with sth. But if we used uniqueId then each re-render would trigger new ids and re-render.
  //    * This is far from perfect but for now it's fine.
  //    */
  //   let counter = 0;
  //
  //   templatesDict[key] = templatesDict[key].map((template) => {
  //     let id = template.id;
  //
  //     if (!id) {
  //       id = "template." + counter;
  //       counter++;
  //     }
  //
  //     if (isSpecialTemplate(template)) {
  //       return {
  //         ...template,
  //         id,
  //       };
  //     }
  //
  //     return {
  //       ...template,
  //       id,
  //       config: configMap(
  //         template.config,
  //         editorContext,
  //         ({ value, schemaProp }) => {
  //           if (schemaProp.type === "text") {
  //             const firstDefinedValue = Object.values(value.value).filter(
  //               (x) => x !== null && x !== undefined
  //             )[0];
  //
  //             return {
  //               ...value,
  //               value: {
  //                 [getDefaultLocale(editorContext.locales).code]:
  //                   firstDefinedValue,
  //               },
  //             };
  //           } else if (schemaProp.type === "component-collection-localised") {
  //             const firstDefinedValue = Object.values(value).filter(
  //               (x) => x !== null && x !== undefined
  //             )[0];
  //
  //             return {
  //               [getDefaultLocale(editorContext.locales).code]:
  //                 firstDefinedValue,
  //             };
  //           }
  //
  //           return value;
  //         }
  //       ),
  //     };
  //   });
  // }
  //
  // return templatesDict;
}
