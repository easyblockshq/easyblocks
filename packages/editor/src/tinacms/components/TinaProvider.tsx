import React, { useEffect, useState } from "react";
import { ModalProvider } from "../../tinacms/react-modals";
import { Theme } from "../../tinacms/styles";
import {
  BlockFieldPlugin,
  ExternalFieldPlugin,
  FontTokenFieldPlugin,
  IdentityFieldPlugin,
  ProductPickerFieldPlugin,
  ResponsiveFieldPlugin,
  SliderFieldPlugin,
  SVGPickerFieldPlugin,
  TokenFieldPlugin,
  VariantsPlugin,
} from "../fields";
import { CMSContext } from "../react-core";
import { TinaCMS } from "../tina-cms";

export interface TinaProviderProps {
  children: React.ReactNode;
  hidden?: boolean;
  styled?: boolean;
  rootContainerNode?: HTMLElement;
}

export const INVALID_CMS_ERROR =
  "The `cms` prop must be an instance of `TinaCMS`.";

function configureTinaCms() {
  const tinaCms = new TinaCMS({ enabled: true });

  tinaCms.fields.add(ProductPickerFieldPlugin);
  tinaCms.fields.add(BlockFieldPlugin);
  tinaCms.fields.add(VariantsPlugin);
  tinaCms.fields.add(SliderFieldPlugin);
  tinaCms.fields.add(SVGPickerFieldPlugin);
  tinaCms.fields.add(ResponsiveFieldPlugin);
  tinaCms.fields.add(ExternalFieldPlugin);
  tinaCms.fields.add(TokenFieldPlugin);
  tinaCms.fields.add(IdentityFieldPlugin);
  tinaCms.fields.add(FontTokenFieldPlugin);

  return tinaCms;
}

export const TinaProvider: React.FC<TinaProviderProps> = ({
  children,
  styled = true,
  rootContainerNode,
}) => {
  const [cms] = useState(() => configureTinaCms());
  const [enabled, setEnabled] = useState(cms.enabled);

  useEffect(() => {
    return cms.events.subscribe("cms", () => {
      setEnabled(cms.enabled);
    });
  }, []);

  if (!(cms instanceof TinaCMS)) {
    throw new Error(INVALID_CMS_ERROR);
  }

  return (
    <CMSContext.Provider value={cms}>
      <ModalProvider rootContainerNode={rootContainerNode}>
        {enabled && styled && <Theme />}
        {children}
      </ModalProvider>
    </CMSContext.Provider>
  );
};

/**
 * @deprecated This has been renamed to `TinaProvider`.
 */
export const Tina = TinaProvider;

/**
 * @deprecated This has been renamed to `TinaProviderProps`.
 */
export type TinaProps = TinaProviderProps;
