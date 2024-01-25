"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Document = { id: string; rootContainer: string };

function EasyblocksEditorDialog({
  documentId,
  rootComponentId,
  cookieId,
}: {
  documentId?: string;
  rootComponentId: string;
  cookieId: string;
}) {
  const [iframeNode, setIframeNode] = useState<HTMLIFrameElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let savingRequest: Promise<Response> | undefined;

    function handleMessage(event: MessageEvent) {
      if (event.data.type === "@easyblocks/closed") {
        const closingBlockingRequest = savingRequest
          ? savingRequest
          : Promise.resolve();

        closingBlockingRequest.then(() => {
          setIsOpen(false);
          router.refresh();
        });
      }

      if (event.data.type === "@easyblocks/content-saved") {
        savingRequest = fetch("/api/documents", {
          method: "POST",
          body: JSON.stringify({ ...event.data.document, cookieId }),
        });
      }
    }

    iframeNode?.contentWindow?.addEventListener("message", handleMessage);

    return () => {
      iframeNode?.contentWindow?.removeEventListener("message", handleMessage);
    };
  }, [cookieId, iframeNode, router]);

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {documentId ? "Edit" : "Create"}
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50" />
        <DialogContent
          className="fixed top-[50%] left-[50%] w-[calc(100vw-48px)] h-[calc(100vh-48px)] bg-white translate-x-[-50%] translate-y-[-50%] box-shadow-xl"
          onPointerDownOutside={(event) => {
            event.preventDefault();
          }}
        >
          <iframe
            ref={setIframeNode}
            src={`/easyblocks-editor?readOnly=false&rootComponent=${rootComponentId}${
              documentId ? `&document=${documentId}` : ""
            }`}
            className="w-full h-full"
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export { EasyblocksEditorDialog };
