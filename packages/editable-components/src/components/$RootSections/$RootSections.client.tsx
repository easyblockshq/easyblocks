/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

function RootSections(props: any) {
  const React = props.__fromEditor.React;
  const data = props.__fromEditor.components.data;
  const itemWrappers = props.__fromEditor.components.ItemWrappers;

  return (
    <React.Fragment>
      {data.map((Item: any, index: number) => {
        const ItemWrapper = itemWrappers[index];

        return (
          <ItemWrapper key={index}>
            <Item />
          </ItemWrapper>
        );
      })}
    </React.Fragment>
  );
}

export default RootSections;
