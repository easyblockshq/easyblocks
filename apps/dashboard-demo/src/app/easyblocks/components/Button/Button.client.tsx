import { Button as ButtonUI } from "@/app/components/Button";
import { createButtonComponent } from "@/app/easyblocks/components/createButtonComponent";
import { forwardRef } from "react";

export const Button = createButtonComponent(
  // eslint-disable-next-line react/display-name
  forwardRef(({ label, variant, size, ...restProps }: any, ref) => {
    return (
      <ButtonUI variant={variant} size={size} ref={ref} {...restProps}>
        {label}
      </ButtonUI>
    );
  })
);
