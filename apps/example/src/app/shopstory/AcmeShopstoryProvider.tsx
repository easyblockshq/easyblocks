import { builtinEditableComponents } from "@easyblocks/editable-components";
import { ShopstoryProvider } from "@easyblocks/react";

export const AcmeShopstoryProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <ShopstoryProvider components={builtinEditableComponents()}>
      {children}
    </ShopstoryProvider>
  );
};
