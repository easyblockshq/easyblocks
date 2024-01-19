import { NoCodeComponentDefinition } from "@easyblocks/core";

export const debugSectionDefinition: NoCodeComponentDefinition = {
  id: "DebugSection",
  schema: [
    {
      prop: "inline_never",
      label: "Never",
      type: "debug_url_inline_never",
      group: "Inline",
    },
    {
      prop: "inline_optional_disabled",
      label: "Optional (off)",
      type: "debug_url_inline_optional",
      responsive: false,
      group: "Inline",
    },
    {
      prop: "inline_optional_enabled",
      label: "Optional (on)",
      type: "debug_url_inline_optional",
      responsive: true,
      group: "Inline",
    },
    {
      prop: "inline_always",
      label: "Always",
      type: "debug_url_inline_always",
      group: "Inline",
    },

    {
      prop: "token_never",
      label: "Never",
      type: "debug_url_token_never",
      group: "Token - custom",
    },
    {
      prop: "token_optional_disabled_custom",
      label: "Optional (off)",
      type: "debug_url_token_optional_custom",
      responsive: false,
      group: "Token - custom",
    },
    {
      prop: "token_optional_enabled_custom",
      label: "Optional (on)",
      type: "debug_url_token_optional_custom",
      responsive: true,
      group: "Token - custom",
    },
    {
      prop: "token_always_custom",
      label: "Always",
      type: "debug_url_token_always_custom",
      group: "Token - custom",
    },

    {
      prop: "token_optional_disabled_no_custom",
      label: "Optional (off)",
      type: "debug_url_token_optional_no_custom",
      responsive: false,
      group: "Token - no custom",
    },
    {
      prop: "token_optional_enabled_no_custom",
      label: "Optional (on)",
      type: "debug_url_token_optional_no_custom",
      responsive: true,
      group: "Token - no custom",
    },
    {
      prop: "token_always_no_custom",
      label: "Always",
      type: "debug_url_token_always_no_custom",
      group: "Token - no custom",
    },
  ],
  type: "section",
};
