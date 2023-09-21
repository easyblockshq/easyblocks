import { builtinEditableComponents } from "@easyblocks/editable-components";
import { EasyblocksProvider } from "@easyblocks/react";

export const AcmeEasyblocksProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <EasyblocksProvider components={builtinEditableComponents()}>
      {children}
    </EasyblocksProvider>
  );
};
