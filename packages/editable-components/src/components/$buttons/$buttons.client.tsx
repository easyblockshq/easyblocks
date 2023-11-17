import React, { ReactElement } from "react";

function Buttons(props: {
  ButtonsContainer: ReactElement;
  Buttons: Array<ReactElement>;
}) {
  const { ButtonsContainer, Buttons } = props;

  return (
    <ButtonsContainer.type {...ButtonsContainer.props}>
      {Buttons.map((Button, index) => (
        <Button.type {...Button.props} key={index} />
      ))}
    </ButtonsContainer.type>
  );
}

export default Buttons;
