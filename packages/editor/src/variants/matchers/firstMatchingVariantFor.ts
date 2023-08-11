import { ConfigComponent } from "@easyblocks/core";

const firstMatchingVariantFor =
  (audiences: string[] = []) =>
  ({ _audience }: ConfigComponent) =>
    audiences.includes(_audience);

export { firstMatchingVariantFor };
