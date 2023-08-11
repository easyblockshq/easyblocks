import { useTooltipTrigger } from "@react-aria/tooltip";
import { MouseEvent, useState } from "react";
import { usePopper } from "react-popper";

interface TooltipOptions {
  isDisabled?: boolean;
  onClick?: () => void;
}

function useTooltip({ isDisabled, onClick }: TooltipOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(
    null
  );
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

  const { styles, attributes } = usePopper(triggerElement, tooltipElement, {
    strategy: "absolute",
    placement: "bottom",
    modifiers: [
      { name: "arrow", options: { element: arrowElement, padding: 6 } },
    ],
  });

  const tooltipTrigger = useTooltipTrigger(
    {
      isDisabled,
      delay: 0,
    },
    {
      isOpen,
      open: () => {
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
      },
    },
    { current: triggerElement }
  );

  const triggerProps = {
    ref: setTriggerElement,
    ...tooltipTrigger.triggerProps,
    onClick:
      onClick === undefined
        ? tooltipTrigger.tooltipProps.onClick
        : (event: MouseEvent<HTMLButtonElement>) => {
            tooltipTrigger.tooltipProps.onClick?.(event);
            onClick();
          },
  };

  const tooltipProps = {
    ref: setTooltipElement,
    style: styles.popper,
    ...attributes.popper,
    ...tooltipTrigger.tooltipProps,
  };

  const arrowProps = {
    ref: setArrowElement,
    style: styles.arrow,
  };

  return {
    isOpen,
    triggerProps,
    tooltipProps,
    arrowProps,
  };
}

export { useTooltip };
