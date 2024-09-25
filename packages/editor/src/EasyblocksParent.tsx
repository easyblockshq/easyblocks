import {
  Config,
  FetchOutputResources,
  InlineTypeWidgetComponentProps,
  WidgetComponentProps,
} from "@easyblocks/core";
import {
  ModalContext,
  GlobalModalStyles,
  Toaster,
  TooltipProvider,
} from "@easyblocks/design-system";
import isPropValid from "@emotion/is-prop-valid";
import React, { ComponentType, useMemo, memo } from "react";
import { ShouldForwardProp, StyleSheetManager } from "styled-components";

import { Editor } from "./Editor";
import { ColorTokenWidget } from "./sidebar/ColorTokenWidget";
import { GlobalStyles } from "./tinacms/styles";
import { SpaceTokenWidget } from "./sidebar/SpaceTokenWidget";
import { parseQueryParams } from "./parseQueryParams";
import { DocumentDataWidgetComponent } from "./sidebar/DocumentDataWidget";
import { ExternalDataChangeHandler } from "./EasyblocksEditorProps";
import { TemplatePicker } from "./TemplatePicker";
import { SectionPickerModal } from "./SectionPicker";
import { SearchableSmallPickerModal } from "./SearchableSmallPickerModal";

interface EasyblocksParentProps {
  config: Config;
  externalData: FetchOutputResources;
  onExternalDataChange: ExternalDataChangeHandler;
  widgets?: Record<
    string,
    | ComponentType<WidgetComponentProps<any>>
    | ComponentType<InlineTypeWidgetComponentProps<any>>
  >;
  components?: Record<string, ComponentType<any>>;
  pickers?: Record<string, TemplatePicker>;
}

const shouldForwardProp: ShouldForwardProp<"web"> = (propName, target) => {
  if (typeof target === "string") {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
};

const builtinWidgets: EasyblocksParentProps["widgets"] = {
  color: ColorTokenWidget,
  space: SpaceTokenWidget,
  "@easyblocks/document-data": DocumentDataWidgetComponent as any,
};

const builinPickers: EasyblocksParentProps["pickers"] = {
  large: SectionPickerModal,
  compact: SearchableSmallPickerModal,
  "large-3": SectionPickerModal,
};

function getModalContainer() {
  return document.querySelector("#modalContainer");
}

const modalStyle = {
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 100000,
} as const;
const toasterStyle = { zIndex: 100100 };

export const EasyblocksParent = memo<EasyblocksParentProps>((props) => {
  const editorSearchParams = useMemo(
    () => parseQueryParams(window.location.search),
    [window.location.search]
  );

  const widgets = useMemo(() => {
    return {
      ...builtinWidgets,
      ...props.widgets,
    };
  }, [props.widgets]);

  const pickers = useMemo(() => {
    return {
      ...builinPickers,
      ...props.pickers,
    };
  }, [props.pickers]);

  return (
    <StyleSheetManager
      shouldForwardProp={shouldForwardProp}
      enableVendorPrefixes
    >
      <ModalContext.Provider value={getModalContainer}>
        <GlobalStyles />

        <GlobalModalStyles />

        <TooltipProvider>
          <div id="modalContainer" style={modalStyle} />

          <Editor
            config={props.config}
            locale={editorSearchParams.locale ?? undefined}
            readOnly={editorSearchParams.readOnly ?? true}
            documentId={editorSearchParams.documentId}
            rootComponentId={editorSearchParams.rootComponentId ?? null}
            rootTemplateId={editorSearchParams.rootTemplateId}
            externalData={props.externalData}
            onExternalDataChange={props.onExternalDataChange}
            widgets={widgets}
            components={props.components}
            pickers={pickers}
          />
        </TooltipProvider>

        <Toaster containerStyle={toasterStyle} />
      </ModalContext.Provider>
    </StyleSheetManager>
  );
});
