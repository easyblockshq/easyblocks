import { Button as RadixButton } from "@radix-ui/themes";
import Link from "next/link";
import { forwardRef } from "react";

const Button = forwardRef<
  HTMLButtonElement,
  {
    variant: "solid" | "soft" | "outline" | "ghost";
    size?: "1" | "2" | "3" | "4";
    children: string;
    onClick?: () => void;
    as?: "button" | "a";
    type?: "button" | "submit";
    href?: string;
  }
>(function ButtonRender(props, forwardedRef) {
  if (props.as === "a") {
    return (
      <RadixButton
        ref={forwardedRef}
        variant={props.variant}
        size={props.size}
        asChild
      >
        <Link href={props.href!}>{props.children}</Link>
      </RadixButton>
    );
  }

  return (
    <RadixButton
      ref={forwardedRef}
      variant={props.variant}
      size={props.size}
      onClick={props.onClick}
      type={props.type}
    >
      {props.children}
    </RadixButton>
  );
});

export { Button };
