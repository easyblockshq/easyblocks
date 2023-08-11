import { box } from "../../box";

function styles(config: {
  backgroundColor: string;
  width: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  color: string;
}) {
  const Container = box({
    backgroundColor: "#E5E5E5",
    display: "flex",
    justifyContent: "center",
  });

  const InnerContainer = box({
    backgroundColor: config.backgroundColor,
    width: config.width,
    paddingTop: config.paddingTop,
    paddingBottom: config.paddingBottom,
    paddingLeft: config.paddingLeft,
    paddingRight: config.paddingRight,
    minHeight: 1,
  });

  const ColorBox = box({
    width: 50,
    height: 50,
    border: "1px dashed black",
    backgroundColor: config.color,
  });

  return {
    Container,
    InnerContainer,
    ColorBox,
  };
}

export default styles;
