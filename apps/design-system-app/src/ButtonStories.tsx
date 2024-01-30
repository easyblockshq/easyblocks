import {
  ButtonGhost,
  ButtonGhostColor,
  ButtonPrimary,
  ButtonSecondary,
  Icons,
  Typography,
} from "@easyblocks/design-system";

export function ButtonStories() {
  return (
    <div>
      <Typography variant={"label"}>Buttons</Typography>
      <br />

      <ButtonPrimary
        onClick={() => {
          alert("clicked");
        }}
      >
        Click me to show alert
      </ButtonPrimary>
      <br />
      <ButtonPrimary variant={"standard"}>Standard size</ButtonPrimary>
      <br />
      <ButtonPrimary variant={"large"}>Large size</ButtonPrimary>
      <br />
      <ButtonPrimary variant={"tiny"}>Tiny size</ButtonPrimary>
      <br />
      <ButtonPrimary icon={Icons.Add}>With Add icon</ButtonPrimary>
      <br />
      <ButtonPrimary height={"80px"}>Custom height</ButtonPrimary>
      <br />
      <ButtonPrimary disabled={true}>Disabled</ButtonPrimary>
      <br />
      <ButtonPrimary isLoading={true}>Loading</ButtonPrimary>
      <br />
      <ButtonPrimary isLoading={true} disabled={true}>
        Loading disabled
      </ButtonPrimary>
      <br />

      <ButtonSecondary>Button Secondary</ButtonSecondary>
      <br />
      <ButtonSecondary disabled={true}>Secondary disabled</ButtonSecondary>
      <br />
      <ButtonSecondary isLoading={true}>Loading</ButtonSecondary>
      <br />
      <ButtonSecondary isLoading={true} disabled={true}>
        Loading disabled
      </ButtonSecondary>
      <br />

      <ButtonGhost>Button Ghost</ButtonGhost>
      <br />
      <ButtonGhostColor>Button Ghost Color</ButtonGhostColor>
      <br />
      <ButtonGhost noPadding={true}>Ghost button no padding</ButtonGhost>
      <br />
    </div>
  );
}
