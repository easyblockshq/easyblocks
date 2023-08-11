/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function Buttons(props: any) {
  const { ButtonsContainer, Buttons } = props.__fromEditor.components;

  return (
    <ButtonsContainer>
      {Buttons.map((Button: any, index: number) => (
        <Button key={index} />
      ))}
    </ButtonsContainer>
  );
}

export default Buttons;
