"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DocumenWidget, Document } from "@/app/DocumenWidget";

const DOCUMENT_KEY = "easyblocksQuickDemoDocumentId";

export default function MainPage() {
  const [document, setDocument] = useState<null | undefined | Document>(
    undefined
  );
  const [isOpen, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const documentRaw = localStorage.getItem(DOCUMENT_KEY);

    if (!documentRaw) {
      setDocument(null);
    } else {
      setDocument(JSON.parse(documentRaw));
    }

    // setTimeout(() => {
    //   setOpen(true);
    // }, 1000);
  }, []);

  if (document === undefined) {
    return null;
  }

  return (
    <div
      className={
        "p-8 min-h-screen relative flex justify-center items-center bg-white-1"
      }
    >
      <div
        className={
          "shadow w-[600px] min-h-[600px] bg-[#ffffff] p-8 flex flex-col items-center justify-center"
        }
      >
        <h2 className={"text-3xl mb-4 text-center"}>Easyblocks demo</h2>
        <p className={"text-xl mb-5 text-center text-black-2 max-w-lg"}>
          This is Easyblocks demo. Click the button below to open the editor
        </p>

        {document === null && <div></div>}
        {document !== null && <div></div>}

        <DocumenWidget
          isOpen={isOpen}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
          }}
          document={document}
          onSave={(document) => {
            setDocument(document);
            localStorage.setItem(DOCUMENT_KEY, JSON.stringify(document));
          }}
        />
      </div>
    </div>
  );
}
