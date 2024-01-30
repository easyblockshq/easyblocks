"use client";

import { Image } from "@/app/easyblocks/components/Image/Image.client";
import { AppShell } from "./components/AppShell/AppShell.client";
import { AppShellFooter } from "./components/AppShell/AppShellFooter/AppShellFooter.client";
import { AppShellHeader } from "./components/AppShell/AppShellHeader/AppShellHeader.client";
import { AppShellSidebar } from "./components/AppShell/AppShellSidebar/AppShellSidebar.client";
import { SidebarItem } from "./components/AppShell/AppShellSidebar/SidebarItem/SidebarItem.client";
import { AssetLink } from "./components/AssetLink/AssetLink.client";
import { Button } from "./components/Button/Button.client";
import { ButtonsGroup } from "./components/ButtonsGroup/ButtonsGroup.client";
import { HorizontalLayout } from "./components/HorizontalLayout/HorizontalLayout.client";
import { MainArea } from "./components/MainArea/MainArea.client";
import { PanelCard } from "./components/MainArea/PanelCard/PanelCard.client";
import { PropertiesForm } from "./components/MainArea/PanelCard/PropertiesForm/PropertiesForm.client";
import {
  PropertiesFormBooleanField,
  PropertiesFormTextField,
} from "./components/MainArea/PanelCard/PropertiesForm/PropertiesFormField/PropertiesFormField.client";
import { SubmitButtonAction } from "./components/MainArea/PanelCard/PropertiesForm/SubmitButtonAction.client";
import { UpdateAssetFormAction } from "./components/MainArea/PanelCard/PropertiesForm/UpdateAssetFormAction.client";
import { PropertiesGroup } from "./components/MainArea/PanelCard/PropertiesGroup/PropertiesGroup.client";
import {
  PropertyBooleanItem,
  PropertyDateItem,
  PropertyTextItem,
} from "./components/MainArea/PanelCard/PropertiesGroup/PropertyItem/PropertyItem.client";
import { DialogContent } from "./components/OpenDialog/DialogContent/DialogContent.client";
import { OpenDialog } from "./components/OpenDialog/OpenDialog.client";
import { Separator } from "./components/Separator/Separator.client";
import { Stack } from "./components/Stack/Stack.client";
import { TriggerEvent } from "./components/TriggerEvent/TriggerEvent.client";

/**
 * Here we provide all the instances of components required to render content built with Easyblocks No-Code Components
 */
const easyblocksComponents = {
  WelcomeScreenContent: MainArea,
  AssetScreenContent: MainArea,
  AppShell,
  Stack,
  Separator,
  HorizontalLayout,
  AppShellHeader,
  AppShellFooter,
  AppShellSidebar,
  SidebarItem,
  MainArea,
  PanelCard,
  PropertiesGroup,
  PropertyTextItem,
  PropertyBooleanItem,
  PropertyDateItem,
  ButtonsGroup,
  Button,
  DialogContent,
  AssetLink,
  TriggerEvent,
  OpenDialog,
  Image,
  PropertiesForm,
  PropertiesFormTextField,
  PropertiesFormBooleanField,
  UpdateAssetFormAction,
  SubmitButtonAction,
};

export { easyblocksComponents };
