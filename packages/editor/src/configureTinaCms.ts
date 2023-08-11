import {
  BlockFieldPlugin,
  VariantsPlugin,
  FontTokenFieldPlugin,
  ExternalFieldPlugin,
  ProductPickerFieldPlugin,
  ResponsiveFieldPlugin,
  SliderFieldPlugin,
  SVGPickerFieldPlugin,
  IdentityFieldPlugin,
  TokenFieldPlugin,
} from "./tinacms/fields";
import { TinaCMS } from "./tinacms";

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

export { configureTinaCms };
