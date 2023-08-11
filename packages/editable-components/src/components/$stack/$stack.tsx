/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function Stack(props: any) {
  const { StackContainer, Items, itemWrappers } = props.__fromEditor.components;

  return (
    <StackContainer>
      {Items.map((Item: any, index: number) => {
        const StackItemOuter = itemWrappers[index].StackItemOuter;
        const StackItemInner = itemWrappers[index].StackItemInner;
        return (
          <StackItemOuter key={index}>
            <StackItemInner>
              <Item />
            </StackItemInner>
          </StackItemOuter>
        );
      })}
    </StackContainer>
  );
}

export default Stack;
