"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { NoCodeActionComponentProps } from "../types";
import { Theme } from "@radix-ui/themes";

function OpenDialog({
  trigger: TriggerElement,
  Content,
}: NoCodeActionComponentProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TriggerElement.type {...TriggerElement.props} as={"button"} />
      </DialogTrigger>
      <DialogPortal>
        <Theme>
          <DialogOverlay className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50" />
          <DialogContent
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center"
            style={{ pointerEvents: "none" }}
          >
            <div className="grid pointer-events-auto">
              <Content.type {...Content.props} />
            </div>
          </DialogContent>
        </Theme>
      </DialogPortal>
    </Dialog>
  );
}

export { OpenDialog };
