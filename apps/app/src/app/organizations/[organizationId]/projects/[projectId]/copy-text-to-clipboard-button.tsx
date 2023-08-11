"use client";
import { Button } from "@radix-ui/themes";

function CopyTextToClipboardButton({ text }: { text: string }) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        window.navigator.clipboard.writeText(text).then(() => {
          alert("Copied to clipboard");
        });
      }}
    >
      Copy
    </Button>
  );
}

export { CopyTextToClipboardButton };
