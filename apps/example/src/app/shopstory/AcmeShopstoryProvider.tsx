import { builtinEditableComponents } from "@easyblocks/editable-components";
import { ShopstoryProvider } from "@easyblocks/react";
import { SimpleBanner } from "@/app/shopstory/SimpleBanner/SimpleBanner";

export const AcmeShopstoryProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <ShopstoryProvider
      components={{
        ...builtinEditableComponents(),
        SimpleBanner,
      }}
    >
      {children}
    </ShopstoryProvider>
  );
};
