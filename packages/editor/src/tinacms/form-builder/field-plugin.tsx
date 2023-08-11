import { InternalField } from "@easyblocks/app-utils";
import React from "react";

export interface FieldPlugin {
  __type: "field";
  name: string;
  Component: React.FC<any>;
  type?: string;
  validate?(
    value: any,
    allValues: any,
    meta: any,
    field: InternalField
  ): string | object | undefined;
  parse?: (value: any, name: string, field: InternalField) => any;
  format?: (value: any, name: string, field: InternalField) => any;
  defaultValue?: any;
}
