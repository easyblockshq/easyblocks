import { createButtonComponent } from "@/app/easyblocks/components/createButtonComponent";
import {
  EnvelopeOpenIcon,
  GearIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { forwardRef } from "react";
import { NoCodeComponentProps } from "../../../types";

const SidebarItemIcons = {
  Home: HomeIcon,
  EnvelopeOpen: EnvelopeOpenIcon,
  Heart: HeartIcon,
  Person: PersonIcon,
  Gear: GearIcon,
  MagnifyingGlass: MagnifyingGlassIcon,
};

export const SidebarItem = createButtonComponent(
  // eslint-disable-next-line react/display-name
  forwardRef(
    ({ as, label, icon, onClick, href }: NoCodeComponentProps, ref) => {
      const IconComponent =
        SidebarItemIcons[icon as keyof typeof SidebarItemIcons];

      const Element = as ?? "div";

      return (
        <Element
          className="flex gap-2 items-center p-2 block bg-transparent hover:text-blue-500 cursor-pointer"
          ref={ref}
          onClick={onClick}
          {...(as === "a" && { href })}
        >
          <IconComponent /> {label}
        </Element>
      );
    }
  )
);
