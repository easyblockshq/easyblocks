import {
  SSButtonGhost,
  SSButtonGhostColor,
  SSButtonPrimary,
  SSButtonSecondary,
  SSIcons,
  Typography,
} from "@easyblocks/design-system";

export function ButtonStories() {
  return (
    <div>
      <Typography variant={"label"}>Buttons</Typography>
      <br />

      <SSButtonPrimary
        onClick={() => {
          alert("clicked");
        }}
      >
        Click me to show alert
      </SSButtonPrimary>
      <br />
      <SSButtonPrimary variant={"standard"}>Standard size</SSButtonPrimary>
      <br />
      <SSButtonPrimary variant={"large"}>Large size</SSButtonPrimary>
      <br />
      <SSButtonPrimary variant={"tiny"}>Tiny size</SSButtonPrimary>
      <br />
      <SSButtonPrimary icon={SSIcons.Add}>With Add icon</SSButtonPrimary>
      <br />
      <SSButtonPrimary height={"80px"}>Custom height</SSButtonPrimary>
      <br />
      <SSButtonPrimary disabled={true}>Disabled</SSButtonPrimary>
      <br />
      <SSButtonPrimary isLoading={true}>Loading</SSButtonPrimary>
      <br />
      <SSButtonPrimary isLoading={true} disabled={true}>
        Loading disabled
      </SSButtonPrimary>
      <br />

      <SSButtonSecondary>Button Secondary</SSButtonSecondary>
      <br />
      <SSButtonSecondary disabled={true}>Secondary disabled</SSButtonSecondary>
      <br />
      <SSButtonSecondary isLoading={true}>Loading</SSButtonSecondary>
      <br />
      <SSButtonSecondary isLoading={true} disabled={true}>
        Loading disabled
      </SSButtonSecondary>
      <br />

      <SSButtonGhost>Button Ghost</SSButtonGhost>
      <br />
      <SSButtonGhostColor>Button Ghost Color</SSButtonGhostColor>
      <br />
      <SSButtonGhost noPadding={true}>Ghost button no padding</SSButtonGhost>
      <br />
    </div>
  );
}
