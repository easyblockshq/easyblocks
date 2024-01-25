import { NoCodeComponentProps } from "../types";

function ButtonsGroup({ ButtonsContainer, Buttons }: NoCodeComponentProps) {
  return (
    <ButtonsContainer.type {...ButtonsContainer.props}>
      {Buttons.map((Button: any, index: number) => (
        <Button.type {...Button.props} key={index} />
      ))}
    </ButtonsContainer.type>
  );
}

export { ButtonsGroup };
