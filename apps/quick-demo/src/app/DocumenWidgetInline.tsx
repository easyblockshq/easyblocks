"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type Document = { id: string; updatedAt: number };

export const DocumentWidgetInline: React.FC<{
  document?: Document | null;
  onSave: (document: Document) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ document, onSave, onOpenChange, isOpen }) => {
  const router = useRouter();

  const [editorIframeNode, setEditorIframeNode] =
    useState<HTMLIFrameElement | null>(null);

  const searchParams = useSearchParams();
  const locale = searchParams.get("locale");

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data.type === "@easyblocks/closed") {
        window.removeEventListener("message", handleMessage);
        router.refresh();
        onOpenChange(false);
      }

      if (event.data.type === "@easyblocks/content-saved") {
        console.log("ON SAVE", event.data.document);
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

  // canvas URL must be calculated once
  const [canvasUrl] = useState(() => {
    let canvasUrl = `${window.location.origin}/easyblocks-editor?rootTemplate=StarterTemplate&readOnly=false`;

    if (document) {
      canvasUrl += `&document=${document.id}`;
    }

    if (locale) {
      canvasUrl += `&locale=${locale}`;
    }

    return canvasUrl;
  });

  if (!isOpen) {
    return null;
  }

  return (
    <iframe
      ref={setEditorIframeNode}
      src={canvasUrl}
      className="w-full h-full"
    ></iframe>
  );
};
