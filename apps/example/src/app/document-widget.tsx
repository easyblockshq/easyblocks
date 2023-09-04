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

const DocumentWidget: React.FC<{
  document: any;
  onSave: (document: any) => void;
}> = ({ document, onSave }) => {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editorIframeNode, setEditorIframeNode] =
    useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data.type === "@easyblocks/closed") {
        window.removeEventListener("message", handleMessage);
        setIsDialogOpen(false);
        router.refresh();
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

  let canvasUrl = `${
    window.location.origin
  }/shopstory-canvas?rootContainer=content&mode=app&source=sales-app&contextParams=${JSON.stringify(
    { locale: "en-US" }
  )}`;

  if (document) {
    canvasUrl += `&documentId=${document.id}`;
  }

  return (
    <div>
      {document && (
        <div
          className={"bg-gray-950 aspect-square max-w-[400px] relative mb-2"}
        >
          <img
            src={generatePreviewUrl({
              ...document,
              accessToken: process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN,
              contextParams: { locale: "en-US" },
              canvasUrl: `${window.location.origin}/shopstory-canvas`,
            })}
            className={"object-contain absolute top-0 left-0 w-full h-full"}
          />
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
        }}
      >
        <DialogTrigger asChild>
          <button className="bg-blue-500 hover:bg-blue-600 duration-100 text-white font-medium rounded-2xl py-1.5 px-4 min-w-[100px]">
            Edit
          </button>
        </DialogTrigger>

        <DialogPortal>
          <DialogOverlay className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50" />
          <DialogContent
            className="fixed top-[50%] left-[50%] w-[calc(100vw-48px)] h-[calc(100vh-48px)] bg-white translate-x-[-50%] translate-y-[-50%] shadow-xl"
            onPointerDownOutside={(event) => {
              // Prevent closing the editor when clicking outside the iframe
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

export { DocumentWidget };
