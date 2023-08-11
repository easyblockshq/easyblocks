import { box } from "../../box";

function styles(config: { gridBaseLineHeight: string }) {
  const color = "#eaeaea";

  const Image = box({
    height: config.gridBaseLineHeight,
    background: color,
  });

  const Title = box({
    marginTop: 16,
    height: 24,
    width: "70%",
    background: color,
  });

  const Desc = box({
    marginTop: 12,
    height: 16,
    width: "50%",
    background: color,
  });

  return {
    Image,
    Title,
    Desc,
  };
}

export default styles;
