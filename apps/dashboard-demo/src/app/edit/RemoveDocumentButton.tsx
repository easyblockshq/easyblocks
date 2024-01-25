"use client";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

function RemoveDocumentButton({ cookieId }: { cookieId: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => {
        fetch("/api/documents", {
          method: "DELETE",
          body: JSON.stringify({ cookieId }),
        }).then(() => {
          router.refresh();
        });
      }}
    >
      Remove
    </Button>
  );
}

export { RemoveDocumentButton };
