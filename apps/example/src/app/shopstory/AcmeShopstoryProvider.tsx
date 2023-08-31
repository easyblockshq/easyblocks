import { builtinEditableComponents } from "@easyblocks/editable-components";
import { ShopstoryProvider } from "@easyblocks/react";
import { SimpleBanner } from "@/app/shopstory/SimpleBanner/SimpleBanner";
import { SimpleBanner2 } from "@/app/shopstory/SimpleBanner2/SimpleBanner2";

export const AcmeShopstoryProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <ShopstoryProvider
      components={{
        ...builtinEditableComponents(),
        SimpleBanner,
        SimpleBanner2,
      }}
    >
      {children}
    </ShopstoryProvider>
  );
};
