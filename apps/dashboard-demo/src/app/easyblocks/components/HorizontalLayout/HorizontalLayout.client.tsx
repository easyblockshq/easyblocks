import { NoCodeComponentProps } from "../types";

function HorizontalLayout({
  Container,
  Items,
  itemWrappers,
}: NoCodeComponentProps) {
  return (
    <Container.type {...Container.props}>
      {Items.map((Item: any, index: number) => {
        const OuterWrapper = itemWrappers[index].OuterWrapper;
        const InnerWrapper = itemWrappers[index].InnerWrapper;
        return (
          <OuterWrapper.type key={index} {...OuterWrapper.props}>
            <InnerWrapper.type {...InnerWrapper.props}>
              <Item.type {...Item.props} />
            </InnerWrapper.type>
          </OuterWrapper.type>
        );
      })}
    </Container.type>
  );
}

export { HorizontalLayout };
