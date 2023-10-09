import {
  SSButtonPrimary,
  Toaster,
  Typography,
  useToaster,
} from "@easyblocks/design-system";

export function ToastStories() {
  const toaster = useToaster();
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.";
  return (
    <div>
      <Typography variant={"label"}>Toast</Typography>
      <br />
      <Toaster />
      <SSButtonPrimary
        onClick={() => {
          toaster.notify(text);
        }}
      >
        Notify
      </SSButtonPrimary>
      <br />
      <SSButtonPrimary
        onClick={() => {
          toaster.notify("Lorem ipsum");
        }}
      >
        Notify short text
      </SSButtonPrimary>
      <br />
      <SSButtonPrimary
        onClick={() => {
          toaster.success(text);
        }}
      >
        Success
      </SSButtonPrimary>
      <br />
      <SSButtonPrimary
        onClick={() => {
          toaster.error(text);
        }}
      >
        Error
      </SSButtonPrimary>
    </div>
  );
}
