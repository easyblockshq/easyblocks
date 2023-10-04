import { SSColors } from "@easyblocks/design-system";
import React, { useEffect, useState } from "react";
import { TypographyStories } from "../src/TypographyStories";
import { ColorStories } from "../src/ColorStories";
import { ButtonStories } from "@/src/ButtonStories";
import { InputStories } from "@/src/InputStories";
import { ToggleStories } from "@/src/ToggleStories";
import { ModalStories } from "@/src/ModalStories";
import { FormStories } from "@/src/FormStories";
import { ToastStories } from "@/src/ToastStories";
import { RangeSliderStories } from "@/src/RangeSliderStories";
import { SelectStories } from "@/src/SelectStories";
import { ToggleButtonStories } from "@/src/ToggleButtonStories";
import { MultiSelectStories } from "@/src/MultiSelectStories";
import { BasicRowStories } from "@/src/BasicRowStories";
import { NavigationControllerStories } from "@/src/NavigationControllerStories";

function Separator() {
  return (
    <div
      style={{
        width: "100%",
        height: "1px",
        background: SSColors.black20,
        marginTop: "32px",
        marginBottom: "16px",
      }}
    ></div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false); // Disable SSR

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <TypographyStories />
      <Separator />
      <ColorStories />
      <Separator />
      <ButtonStories />
      <Separator />
      <InputStories />
      <Separator />
      <ToggleStories />
      <Separator />
      <ModalStories />
      <Separator />
      <FormStories />
      <Separator />
      <ToastStories />
      <Separator />
      <RangeSliderStories />
      <Separator />
      <SelectStories />
      <Separator />
      <ToggleButtonStories />
      <Separator />
      <MultiSelectStories />
      <Separator />
      <BasicRowStories />
      <Separator />
      <NavigationControllerStories />

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}
