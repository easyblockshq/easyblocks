import { box } from "../../box";

function styles(config: {
  backgroundColor: string;
  width: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  color: string;
  family: string;
  weight: string;
  size: string;
  letterSpacing: string;
  isUppercase: boolean;
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

  const Text = box({
    fontFamily: config.family,
    fontWeight: config.weight,
    maxWidth: 600,
    color: "black",
    fontSize: config.size,
    letterSpacing: config.letterSpacing,
    textTransform: config.isUppercase ? "uppercase" : "none",
  });

  return {
    Container,
    InnerContainer,
    Text,
  };
}

export default styles;
