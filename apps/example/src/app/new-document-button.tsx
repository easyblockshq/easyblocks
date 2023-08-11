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
import { accessToken } from "./lib/apiClient";

function NewDocument() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editorIframeNode, setEditorIframeNode] =
    useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data.type === "@shopstory-editor/closed") {
        window.removeEventListener("message", handleMessage);
        setIsDialogOpen(false);
        router.refresh();
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

  const canvasUrl = `/shopstory-canvas?rootContainer=content&mode=app&source=sales-app&contextParams=${JSON.stringify(
    { locale: "en-US" }
  )}`;

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <button className="border-blue-600 border-2 rounded p-2">
          New document
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50" />
        <DialogContent className="fixed top-[50%] left-[50%] w-[calc(100vw-48px)] h-[calc(100vh-48px)] bg-white translate-x-[-50%] translate-y-[-50%] shadow-xl">
          <iframe
            ref={setEditorIframeNode}
            src={canvasUrl}
            className="w-full h-full"
          ></iframe>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export { NewDocument };
