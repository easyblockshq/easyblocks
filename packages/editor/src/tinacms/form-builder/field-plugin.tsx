import { InternalField } from "@easyblocks/core/_internals";
import React from "react";

export interface FieldPlugin {
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
