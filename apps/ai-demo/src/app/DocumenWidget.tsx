"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generatePreviewUrl } from "@/utils/generatePreviewUrl";

export type Document = { id: string; rootContainer: string };

const DocumenWidget: React.FC<{
  document?: Document | null;
  onSave: (document: Document) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ document, onSave, onOpenChange, isOpen }) => {
  const router = useRouter();

  const [editorIframeNode, setEditorIframeNode] =
    useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data.type === "@easyblocks/closed") {
        window.removeEventListener("message", handleMessage);
        router.refresh();
        onOpenChange(false);
      }

      if (event.data.type === "@easyblocks/content-saved") {
        onSave(event.data.document);
      }
    }

    editorIframeNode?.contentWindow?.addEventListener("message", handleMessage);

    return () => {
      editorIframeNode?.contentWindow?.removeEventListener(
        "message",
        handleMessage
      );
    };
  }, [editorIframeNode, router]);

  const rootContainer = document?.rootContainer ?? "content";

  let canvasUrl = `${
    window.location.origin
  }/easyblocks-editor?rootContainer=${rootContainer}&mode=app&source=sales-app&contextParams=${JSON.stringify(
    {
      locale: "en-US",
    }
  )}`;

  if (document) {
    canvasUrl += `&documentId=${document.id}`;
  }

  return (
    <div>
      {/*{document && (*/}
      {/*  <div*/}
      {/*    className={"bg-gray-950 aspect-square max-w-[400px] relative mb-2"}*/}
      {/*  >*/}
      {/*    <img*/}
      {/*      src={generatePreviewUrl({*/}
      {/*        ...document,*/}
      {/*        accessToken: process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN,*/}
      {/*        contextParams: { locale: "en-US" },*/}
      {/*        canvasUrl: `${window.location.origin}/easyblocks-editor`,*/}
      {/*      })}*/}
      {/*      className={"object-contain absolute top-0 left-0 w-full h-full"}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*)}*/}

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <button className="bg-black-1 text-white-1 hover:bg-blue-600 duration-100 text-white font-medium rounded-2xl py-1.5 px-4 min-w-[100px]">
            Open editor
          </button>
        </DialogTrigger>

        <DialogPortal>
          <DialogOverlay className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50" />
          <DialogContent
            className="fixed top-[50%] left-[50%] w-[calc(100vw-48px)] h-[calc(100vh-48px)] bg-white translate-x-[-50%] translate-y-[-50%] shadow-xl"
            onPointerDownOutside={(event) => {
              event.preventDefault();
            }}
          >
            <iframe
              ref={setEditorIframeNode}
              src={canvasUrl}
              className="w-full h-full"
            ></iframe>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export { DocumenWidget };
