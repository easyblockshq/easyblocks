import { ReactElement } from "react";

type SimpleBannerProps = {
  Root: ReactElement;
  Title: ReactElement;
  Wrapper: ReactElement;
  Buttons: ReactElement[];
  ButtonsWrapper: ReactElement;
};

export function SimpleBanner(props: SimpleBannerProps) {
  const { Root, Title, Wrapper, Buttons, ButtonsWrapper } = props;

  return (
    <Root.type {...Root.props}>
      <Wrapper.type {...Wrapper.props}>
        <Title.type {...Title.props} />
        <ButtonsWrapper.type {...ButtonsWrapper.props}>
          {Buttons.map((Button, index) => (
            <Button.type {...Button.props} key={index} />
          ))}
        </ButtonsWrapper.type>
      </Wrapper.type>
    </Root.type>
  );
}
