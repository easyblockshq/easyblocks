import { NoCodeComponentDefinition } from "../../..";

const typesDebugSectionDefinition: NoCodeComponentDefinition = {
  id: "TypesDebugSection",
  schema: [
    {
      prop: "inline_never",
      label: "Never",
      type: "url_inline_never",
      group: "Inline",
    },
    {
      prop: "inline_optional_disabled",
      label: "Optional (off)",
      type: "url_inline_optional",
      responsive: false,
      group: "Inline",
    },
    {
      prop: "inline_optional_enabled",
      label: "Optional (on)",
      type: "url_inline_optional",
      responsive: true,
      group: "Inline",
    },
    {
      prop: "inline_always",
      label: "Always",
      type: "url_inline_always",
      group: "Inline",
    },
    {
      prop: "token_never",
      label: "Never",
      type: "url_token_never",
      group: "Token",
    },
    {
      prop: "token_optional_disabled_no_custom",
      label: "Optional (off,no custom)",
      type: "url_token_optional_no_custom",
      responsive: false,
      group: "Token",
    },
    {
      prop: "token_optional_enabled_no_custom",
      label: "Optional (on,no custom)",
      type: "url_token_optional_no_custom",
      responsive: true,
      group: "Token",
    },
    {
      prop: "token_optional_disabled_custom",
      label: "Optional (off)",
      type: "url_token_optional_custom",
      responsive: false,
      group: "Token",
    },
    {
      prop: "token_optional_enabled_custom",
      label: "Optional (on)",
      type: "url_token_optional_custom",
      responsive: true,
      group: "Token",
    },
    {
      prop: "token_always_no_custom",
      label: "Always (no custom)",
      type: "url_token_always_no_custom",
      group: "Token",
    },
    {
      prop: "token_always_custom",
      label: "Always",
      type: "url_token_always_custom",
      group: "Token",
    },
  ],
  type: "section",
};

export { typesDebugSectionDefinition };
