import { box } from "../../box";

function styles(config: {
  backgroundColor: string;
  width: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
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

  return {
    Container,
    InnerContainer,
    Component: {
      fitW: true,
    },
  };
}

export default styles;
