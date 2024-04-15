import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { EditorContextType } from "../_internals";
import {
  CompilationMetadata,
  CompiledShopstoryComponentConfig,
  FetchOutputResources,
} from "../types";

type EasyblocksCanvasState = {
  meta: CompilationMetadata | null;
  compiled: CompiledShopstoryComponentConfig | null;
  externalData: FetchOutputResources | null;
  formValues: EditorContextType["form"]["values"] | null;
  definitions: EditorContextType["definitions"] | null;
  locale: EditorContextType["contextParams"]["locale"] | null;
  locales: EditorContextType["locales"] | null;
  isEditing: EditorContextType["isEditing"];
  devices: EditorContextType["devices"] | null;
  focussedField: EditorContextType["focussedField"] | null;
};

const initialState: EasyblocksCanvasState = {
  meta: null,
  compiled: null,
  externalData: null,
  formValues: null,
  definitions: null,
  locale: null,
  locales: null,
  isEditing: false,
  devices: null,
  focussedField: null,
};

const EasyblocksCanvasContext = createContext<
  EasyblocksCanvasState | undefined
>(undefined);

type EasyblocksCanvasProviderProps = {
  children: ReactNode;
};

const EasyblocksCanvasProvider: React.FC<EasyblocksCanvasProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<EasyblocksCanvasState>(initialState);

  useEffect(() => {
    const handler = (event: any) => {
      if (event.data.type === "@easyblocks/canvas-data") {
        const data = JSON.parse(event.data.data);
        setState((prevState) => ({ ...prevState, ...data }));
      }
    };
    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  return (
    <EasyblocksCanvasContext.Provider value={state}>
      {children}
    </EasyblocksCanvasContext.Provider>
  );
};

const useEasyblocksCanvasContext = () => {
  const context = useContext(EasyblocksCanvasContext);
  if (!context) {
    throw new Error(
      "useEasyblocksCanvasContext must be used within a EasyblocksCanvasProvider"
    );
  }
  return context;
};

export { EasyblocksCanvasProvider, useEasyblocksCanvasContext };
