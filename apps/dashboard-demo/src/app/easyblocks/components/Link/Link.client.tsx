import { NoCodeActionComponentProps } from "../types";

function Link({ trigger: TriggerElement, url }: NoCodeActionComponentProps) {
  return <TriggerElement.type {...TriggerElement.props} as="a" href={url} />;
}

export { Link };
