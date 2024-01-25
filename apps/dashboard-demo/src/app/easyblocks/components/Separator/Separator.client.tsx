import { NoCodeActionComponentProps } from "../types";

function Separator({ Container, Separator }: NoCodeActionComponentProps) {
  return (
    <Container.type {...Container.props}>
      <Separator.type {...Separator.props} />
    </Container.type>
  );
}

export { Separator };
