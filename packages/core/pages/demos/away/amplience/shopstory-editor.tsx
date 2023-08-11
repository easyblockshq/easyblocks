import { Canvas } from "../../../../src/editor/Canvas";
import { ShopstoryProvider } from "../../../../src/Shopstory";
import { amplienceConfig } from "../../../../src/cms/amplience/config";

function ShopstoryEditorPage() {
  return (
    <ShopstoryProvider>
      <Canvas config={amplienceConfig} />
    </ShopstoryProvider>
  );
}

export default ShopstoryEditorPage;
