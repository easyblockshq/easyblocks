import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";

function styles({
  values,
}: NoCodeComponentStylesFunctionInput<{
  gridBaseLineHeight: string;
}>): NoCodeComponentStylesFunctionResult {
  const color = "#eaeaea";

  const Image = {
    height: values.gridBaseLineHeight,
    background: color,
  };

  const Title = {
    marginTop: 16,
    height: 24,
    width: "70%",
    background: color,
  };

  const Desc = {
    marginTop: 12,
    height: 16,
    width: "50%",
    background: color,
  };

  return {
    styled: {
      Image,
      Title,
      Desc,
    },
  };
}

export default styles;
