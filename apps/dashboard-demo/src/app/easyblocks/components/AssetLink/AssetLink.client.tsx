import { NoCodeActionComponentProps } from "../types";

function AssetLink({
  trigger: TriggerElement,
  asset,
}: NoCodeActionComponentProps) {
  const url = asset ? `/assets/${asset.id}` : "";

  return <TriggerElement.type {...TriggerElement.props} as="a" href={url} />;
}

export { AssetLink };
