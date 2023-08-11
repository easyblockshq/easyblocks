/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as React from "react";
import { useCallback, useState } from "react";

export type ModalProviderProps = {
  children: React.ReactNode;
  rootContainerNode?: HTMLElement;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({
  children,
  rootContainerNode,
}) => {
  const [modalRootContainerRef, setModalRootContainerRef] =
    useState<HTMLElement | null>(null);

  const setModalRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setModalRootContainerRef(node);
    }
  }, []);

  const content = (
    <>
      <div id="modal-root" ref={setModalRef} />
      <ModalContainerContext.Provider
        value={{ portalNode: rootContainerNode || modalRootContainerRef }}
      >
        {children}
      </ModalContainerContext.Provider>
    </>
  );

  return content;
};

export interface ModalContext {
  portalNode: Element | null;
}

const ModalContainerContext = React.createContext<ModalContext | null>(null);

export function useModalContainer(): ModalContext {
  const modalContainer = React.useContext(ModalContainerContext);

  if (!modalContainer) {
    throw new Error("No Modal Container context provided");
  }

  return modalContainer;
}
