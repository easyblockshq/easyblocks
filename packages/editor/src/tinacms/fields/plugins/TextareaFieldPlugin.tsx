import React from "react";
import { InputProps, TextArea } from "../components";
import { parse } from "./textFormat";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";

export const TextareaField = wrapFieldsWithMeta<{ input: InputProps }>(
  ({ input }) => <TextArea {...input} />
);
export const TextareaFieldPlugin = {
  name: "textarea",
  Component: TextareaField,
  parse,
};
