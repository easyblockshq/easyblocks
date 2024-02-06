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
import { headerLinkDefinition } from "./components/AppShell/AppShellHeader/HeaderLink/HeaderLink.definition";
import { linkDefinition } from "./components/Link/Link";

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
      { id: "neutral-950", value: "#0a0a0a", isDefault: true },
      { id: "orange", value: "#f76a14" },
      { id: "red", value: "#e5484e" },
      { id: "blue", value: "#3f63dd" },
      { id: "green", value: "#31a46c" },
    ],
    space: [
      {
        id: "0",
        label: "0",
        value: "0px",
        isDefault: true,
      },
      {
        id: "1",
        label: "1",
        value: "1px",
      },
      {
        id: "2",
        label: "2",
        value: "2px",
      },
      {
        id: "4",
        label: "4",
        value: "4px",
      },
      {
        id: "6",
        label: "6",
        value: "6px",
      },
      {
        id: "8",
        label: "8",
        value: "8px",
      },
      {
        id: "12",
        label: "12",
        value: "12px",
      },
      {
        id: "16",
        label: "16",
        value: "16px",
      },
      {
        id: "24",
        label: "24",
        value: "24px",
      },
      {
        id: "32",
        label: "32",
        value: "32px",
      },
      {
        id: "48",
        label: "48",
        value: "48px",
      },
      {
        id: "64",
        label: "64",
        value: "64px",
      },
      {
        id: "96",
        label: "96",
        value: "96px",
      },
      {
        id: "128",
        label: "128",
        value: "128px",
      },
      {
        id: "160",
        label: "160",
        value: "160px",
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
        isDefault: true,
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
    },
    propertyBoolean: {
      type: "external",
    },
    propertyDate: {
      type: "external",
    },
    formAction: {
      type: "external",
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
    linkDefinition,
    assetLinkDefinition,
    triggerEventDefinition,
    openDialogDefinition,
    imageComponentDefinition,
    propertiesFormDefinition,
    propertiesFormTextField,
    propertiesFormBooleanField,
    updateAssetFormAction,
    submitButton,
    headerLinkDefinition,
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
