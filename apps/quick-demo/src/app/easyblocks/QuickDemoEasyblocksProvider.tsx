import { builtinEditableComponents } from "@easyblocks/editable-components";
import { EasyblocksProvider } from "@easyblocks/react";
import { ProductCard } from "@/components/ProductCard/ProductCard";

export const QuickDemoEasyblocksProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <EasyblocksProvider
      components={{ ...builtinEditableComponents(), ProductCard }}
    >
      {children}
    </EasyblocksProvider>
  );
};
