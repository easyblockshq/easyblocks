import { NoCodeActionComponentProps } from "../types";

function TriggerEvent({
  trigger: TriggerElement,
  message,
}: NoCodeActionComponentProps) {
  return (
    <TriggerElement.type
      {...TriggerElement.props}
      as="button"
      onClick={() => {
        window.postMessage({
          type: "triggerEvent",
          message,
        });
      }}
    />
  );
}

export { TriggerEvent };
