import {
  ButtonPrimary,
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
      <ButtonPrimary
        onClick={() => {
          toaster.notify(text);
        }}
      >
        Notify
      </ButtonPrimary>
      <br />
      <ButtonPrimary
        onClick={() => {
          toaster.notify("Lorem ipsum");
        }}
      >
        Notify short text
      </ButtonPrimary>
      <br />
      <ButtonPrimary
        onClick={() => {
          toaster.success(text);
        }}
      >
        Success
      </ButtonPrimary>
      <br />
      <ButtonPrimary
        onClick={() => {
          toaster.error(text);
        }}
      >
        Error
      </ButtonPrimary>
    </div>
  );
}
