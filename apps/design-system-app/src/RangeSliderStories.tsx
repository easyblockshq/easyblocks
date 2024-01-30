import { RangeSlider, Typography } from "@easyblocks/design-system";

export function RangeSliderStories() {
  return (
    <div>
      <Typography variant={"label"}>Range slider</Typography>
      <br />
      <RangeSlider min={0} max={10} step={1} />
    </div>
  );
}
