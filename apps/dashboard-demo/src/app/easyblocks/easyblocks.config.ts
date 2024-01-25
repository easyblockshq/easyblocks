import { imageComponentDefinition } from "@/app/easyblocks/components/Image/Image";
import { Config, EasyblocksBackend } from "@easyblocks/core";
import { appShellDefinition } from "./components/AppShell/AppShell";
import { appShellFooterDefinition } from "./components/AppShell/AppShellFooter/AppShellFooter";
import { appShellHeaderDefinition } from "./components/AppShell/AppShellHeader/AppShellHeader";
import { appShellSidebarDefinition } from "./components/AppShell/AppShellSidebar/AppShellSidebar";
import { sidebarItemDefinition } from "./components/AppShell/AppShellSidebar/SidebarItem/SidebarItem";
import { assetLinkDefinition } from "./components/AssetLink/AssetLink";
import { buttonDefinition } from "./components/Button/Button";
import { buttonsGroupDefinition } from "./components/ButtonsGroup/ButtonsGroup";
import { horizontalLayoutDefinition } from "./components/HorizontalLayout/HorizontalLayout";
import { mainAreaDefinition } from "./components/MainArea/MainArea";
import { panelCardDefinition } from "./components/MainArea/PanelCard/PanelCard";
import { propertiesFormDefinition } from "./components/MainArea/PanelCard/PropertiesForm/PropertiesForm";
import {
  propertiesFormBooleanField,
  propertiesFormTextField,
} from "./components/MainArea/PanelCard/PropertiesForm/PropertiesFormField/PropertiesFormField";
import { submitButton } from "./components/MainArea/PanelCard/PropertiesForm/SubmitButtonAction";
import { updateAssetFormAction } from "./components/MainArea/PanelCard/PropertiesForm/UpdateAssetFormAction";
import { propertiesGroupDefinition } from "./components/MainArea/PanelCard/PropertiesGroup/PropertiesGroup";
import {
  propertyBooleanItem,
  propertyDateItem,
  propertyTextItem,
} from "./components/MainArea/PanelCard/PropertiesGroup/PropertyItem/PropertyItem";
import { dialogContentDefinition } from "./components/OpenDialog/DialogContent/DialogContent";
import { openDialogDefinition } from "./components/OpenDialog/OpenDialog";
import { separatorDefinition } from "./components/Separator/Separator";
import { stackDefinition } from "./components/Stack/Stack";
import { triggerEventDefinition } from "./components/TriggerEvent/TriggerEvent";
import { assetScreenContentDefinition } from "./components/AssetScreenContent/AssetsScreenContent.definition";
import { welcomeScreenContentDefinition } from "./components/WelcomeScreenContent/WelcomeScreenContent.definition";

const MAIN_FONT_FAMILY = `"Inter", font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;

const easyblocksConfig: Config = {
  backend: new EasyblocksBackend({
    accessToken: process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN!,
  }),

  locales: [
    // easyblocks is localised, in this case we allow only for one locale "en"
    {
      code: "en",
      isDefault: true,
    },
  ],

  tokens: {
    colors: [
      { id: "neutral-50", value: "#fafafa" },
      { id: "neutral-100", value: "#f5f5f5" },
      { id: "neutral-200", value: "#e5e5e5" },
      { id: "neutral-300", value: "#d4d4d4" },
      { id: "neutral-400", value: "#a3a3a3" },
      { id: "neutral-500", value: "#737373" },
      { id: "neutral-600", value: "#525252" },
      { id: "neutral-700", value: "#404040" },
      { id: "neutral-800", value: "#262626" },
      { id: "neutral-900", value: "#171717" },
      { id: "neutral-950", value: "#0a0a0a" },
      { id: "orange", value: "#f76a14" },
      { id: "red", value: "#e5484e" },
      { id: "blue", value: "#3f63dd" },
      { id: "green", value: "#31a46c" },
    ],
    space: [
      {
        id: "containerMargin.default",
        value: "0px",
      },
    ],
    fonts: [
      {
        id: "body",
        value: {
          fontFamily: MAIN_FONT_FAMILY,
          fontSize: 16,
          lineHeight: 1.5,
        },
      },
      {
        id: "heading-1",
        value: {
          fontFamily: MAIN_FONT_FAMILY,
          fontSize: 36,
          lineHeight: 1.2,
        },
      },
      {
        id: "heading-2",
        value: {
          fontFamily: MAIN_FONT_FAMILY,
          fontSize: 30,
          lineHeight: 1.2,
        },
      },
      {
        id: "heading-3",
        value: {
          fontFamily: MAIN_FONT_FAMILY,
          fontSize: 24,
          lineHeight: 1.2,
        },
      },
    ],
    aspectRatios: [
      {
        id: "panoramic",
        label: "Panoramic (2:1)",
        value: "2:1",
      },
      {
        id: "landscape",
        label: "Landscape (16:9)",
        value: "16:9",
      },
      {
        id: "portrait",
        label: "Portrait (4:5)",
        value: "4:5",
      },
      {
        id: "square",
        label: "Square (1:1)",
        value: "1:1",
      },
      {
        id: "panoramic",
        label: "Panoramic (2:1)",
        value: "2:1",
      },
    ],
  },
  types: {
    asset: {
      type: "external",
      widgets: [
        {
          id: "asset",
          label: "Asset",
        },
      ],
    },
    image: {
      type: "external",
      // we use name image_ because "image" is temporarily reserved by Easyblocks (this is gonna be fixed soon)
      widgets: [
        {
          id: "asset",
          label: "Asset",
        },
      ],
    },
    propertyText: {
      type: "external",
      widgets: [],
    },
    propertyBoolean: {
      type: "external",
      widgets: [],
    },
    propertyDate: {
      type: "external",
      widgets: [],
    },
    formAction: {
      type: "external",
      widgets: [],
    },
  },
  components: [
    welcomeScreenContentDefinition,
    assetScreenContentDefinition,
    stackDefinition,
    separatorDefinition,
    horizontalLayoutDefinition,
    appShellDefinition,
    appShellHeaderDefinition,
    appShellFooterDefinition,
    appShellSidebarDefinition,
    sidebarItemDefinition,
    mainAreaDefinition,
    panelCardDefinition,
    propertiesGroupDefinition,
    propertyTextItem,
    propertyBooleanItem,
    propertyDateItem,
    buttonDefinition,
    buttonsGroupDefinition,
    dialogContentDefinition,
    assetLinkDefinition,
    triggerEventDefinition,
    openDialogDefinition,
    imageComponentDefinition,
    propertiesFormDefinition,
    propertiesFormTextField,
    propertiesFormBooleanField,
    updateAssetFormAction,
    submitButton,
    {
      id: "Collection",
      schema: [
        {
          prop: "ItemRenderer",
          label: "Item renderer",
          type: "component",
          accepts: ["ItemRenderer"],
        },
      ],
      type: "item",
      styles({ values }) {
        return {
          props: {
            isRendererSelected: values.ItemRenderer.length > 0,
          },
        };
      },
    },
    {
      id: "ItemRenderer",
      schema: [],
    },
  ],
  templates: [
    // default PanelCard template
    {
      id: "PanelCard_default",
      entry: {
        _id: "b1e16724-3ccb-4f7e-8ee1-38e138f5b9d6",
        _component: "PanelCard",
        traceId: "PanelCard-0abc795e",
        _itemProps: {
          MainArea: {
            Panels: {
              size: "1x1",
            },
          },
        },
        HeaderStack: [
          {
            _id: "607a0434-adcf-4305-ab7d-b3ec998242b2",
            _component: "Stack",
            traceId: "Stack-20db12c3",
            Items: [],
          },
        ],
        Items: [],
        isEditable: true,
        Buttons: [
          {
            _id: "ba7fdba7-9b35-4bd6-8ecd-40f9dfe8afe5",
            _component: "ButtonsGroup",
            traceId: "ButtonsGroup-f0125b6f",
            Buttons: [
              {
                _id: "f3358b5f-e056-44c7-a3ee-a541dee97b5e",
                _component: "Button",
                traceId: "Button-ddcbf2ce",
                _itemProps: { ButtonsGroup: { Buttons: {} } },
                variant: "solid",
                size: "2",
                label: {
                  id: "local.32f49045-e7eb-452b-bc64-4801ac4809cf",
                  value: { en: "Action" },
                  widgetId: "@easyblocks/local-text",
                },
                Action: [],
              },
            ],
            gap: { $res: true, xl: { ref: "12", value: "12px" } },
          },
        ],
      },
    },
    // Default ButtonsGroup template
    {
      id: "ButtonsGroup_empty",
      entry: {
        _id: "c0b75635-f744-4863-9d7c-fd74c26186f5",
        _component: "ButtonsGroup",
        gap: {
          $res: true,
          xl: {
            ref: "12",
            value: "12px",
          },
        },
        Buttons: [
          {
            _id: "whatever",
            _component: "Button",
          },
        ],
      },
    },
    // Default RichText template. Please ignore this, this one will be gone in future versions.
    {
      id: "RichText_body-typography",
      entry: {
        _id: "20149cea-df28-4d5f-a085-3938c5ad3a08",
        _component: "@easyblocks/rich-text",
        elements: {
          en: [
            {
              _id: "56386a14-b91f-48f4-a3aa-6d34a3d2e71c",
              _component: "@easyblocks/rich-text-block-element",
              traceId: "$richTextBlockElement-e908698d",
              type: "paragraph",
              elements: [
                {
                  _id: "cdaf3bb2-6648-4845-8c57-358a6ac8c3af",
                  _component: "@easyblocks/rich-text-line-element",
                  traceId: "$richTextLineElement-407fc206",
                  elements: [
                    {
                      _id: "f8864077-9d1e-4186-a0a1-7b71e842aad6",
                      _component: "@easyblocks/rich-text-part",
                      traceId: "$richTextPart-50021cf2",
                      value: "Lorem ipsum",
                      font: {
                        $res: true,
                        xl: {
                          ref: "body",
                          value: {
                            $res: true,
                            "2xl": {
                              fontFamily:
                                '"Inter", font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                              fontSize: 16,
                              lineHeight: 1.5,
                            },
                          },
                        },
                      },
                      color: {
                        $res: true,
                        xl: {
                          ref: "neutral-950",
                          value: "#0a0a0a",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        align: {
          $res: true,
          xl: "left",
        },
        accessibilityRole: "div",
        isListStyleAuto: true,
        mainFont: {
          $res: true,
          xl: {
            value: {
              fontFamily: "sans-serif",
              fontSize: "16px",
            },
          },
        },
        mainColor: {
          $res: true,
          xl: {
            value: "#000000",
          },
        },
      },
    },
    // Default SimpleText template. Please ignore this, this one will be gone in future versions.
    {
      id: "DefaultSimpleText",
      entry: {
        _id: "49af13d4-baf8-441c-b8b0-4b0088d3a4df",
        _component: "@easyblocks/text",
        traceId: "$text-31f5d455",
        _itemProps: {
          Stack: {
            Items: {
              width: { $res: true, xl: "512px" },
              marginBottom: { $res: true, xl: { value: "0px", ref: "0" } },
              align: { $res: true, xl: "left" },
            },
          },
        },
        value: {
          id: "local.8c49847f-d4a1-4401-b97c-ae6eef0830ed",
          value: { en: "Lorem ipsum" },
          widgetId: "@easyblocks/local-text",
        },
        color: { $res: true, xl: { ref: "neutral-950", value: "#0a0a0a" } },
        font: {
          $res: true,
          xl: {
            ref: "body",
            value: {
              $res: true,
              "2xl": {
                fontFamily:
                  '"Inter", font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                fontSize: 16,
                lineHeight: 1.5,
              },
            },
          },
        },
        accessibilityRole: "p",
      },
    },
    {
      id: "DefaultPropertiesForm",
      entry: {
        _id: "40226ffc-5c00-4dc1-86ad-624bf36c2f23",
        _component: "PropertiesForm",
        traceId: "PropertiesForm-d7c9d94e",
        _itemProps: {
          Stack: {
            Items: {
              width: {
                $res: true,
                xl: "max",
              },
              marginBottom: {
                $res: true,
                xl: {
                  value: "0px",
                  ref: "0",
                },
              },
              align: {
                $res: true,
                xl: "left",
              },
            },
          },
        },
        Fields: [],
        Action: [],
        Buttons: [
          {
            _id: "b7c1f32c-6c7a-45d6-983f-6d445e03c08d",
            _component: "ButtonsGroup",
            traceId: "ButtonsGroup-0b9557b2",
            Buttons: [],
            gap: {
              $res: true,
              xl: {
                ref: "16",
                value: "16px",
              },
            },
          },
        ],
      },
    },
  ],
};

export { easyblocksConfig };
