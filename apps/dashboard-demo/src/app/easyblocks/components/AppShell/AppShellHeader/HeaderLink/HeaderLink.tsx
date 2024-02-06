import { createButtonComponent } from "../../../createButtonComponent";
import { ActionTriggerType } from "../../../types";

export const HeaderLinkActionTrigger: ActionTriggerType<{ label: string }> = (
  props
) => {
  const { as, __easyblocks, label, ...restProps } = props;
  const Element = as ?? "div";

  const activeClass =
    "text-blue-500 underline hover:opacity-50 bg-transparent cursor-pointer";
  const nonActiveClass = "text-black";

  const isActive = as === "div" || as === undefined;

  return (
    <Element {...restProps} className={isActive ? nonActiveClass : activeClass}>
      {label}
    </Element>
  );
};

export const HeaderLink = createButtonComponent(HeaderLinkActionTrigger);
