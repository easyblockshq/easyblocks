import { SSRangeSlider, Typography } from "@easyblocks/design-system";

export function RangeSliderStories() {
  return (
    <div>
      <Typography variant={"label"}>Range slider</Typography>
      <br />
      <SSRangeSlider min={0} max={10} step={1} />
    </div>
  );
}
