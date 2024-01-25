import { NoCodeComponentProps } from "../types";

function Stack({
  StackContainer,
  Items,
  outerItemWrappers,
  innerItemWrappers,
}: NoCodeComponentProps) {
  return (
    <StackContainer.type {...StackContainer.props}>
      {Items.map((Item: any, index: number) => {
        const StackItemOuter = outerItemWrappers[index];
        const StackItemInner = innerItemWrappers[index];

        return (
          <StackItemOuter.type {...StackItemOuter.props} key={index}>
            <StackItemInner.type {...StackItemInner.props}>
              <Item.type {...Item.props} />
            </StackItemInner.type>
          </StackItemOuter.type>
        );
      })}
    </StackContainer.type>
  );
}

export { Stack };
