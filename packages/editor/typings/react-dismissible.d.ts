import { ReactNode } from "react";
import { Props } from "react-dismissible";

declare module "react-dismissible" {
  export declare const Dismissible: React.FC<Props & { children: ReactNode }>;
}
