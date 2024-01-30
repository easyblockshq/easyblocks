import { Config } from "@easyblocks/core";

const validate = (value: any) => {
  return (
    typeof value === "string" &&
    (value.startsWith("http://") || value.startsWith("https://"))
  );
};

export const debugTypes: Config["types"] = {
  debug_url_inline_never: {
    type: "inline",
    defaultValue: "https://google.com",
    responsiveness: "never",
    widget: { id: "debug_url", label: "Debug URL" },
    validate,
  },
  debug_url_inline_optional: {
    type: "inline",
    defaultValue: "https://google.com",
    responsiveness: "optional",
    widget: { id: "debug_url", label: "Debug URL" },
    validate,
  },
  debug_url_inline_always: {
    type: "inline",
    defaultValue: "https://google.com",
    responsiveness: "always",
    widget: { id: "debug_url", label: "Debug URL" },
    validate,
  },
  debug_url_token_never: {
    type: "token",
    token: "debug_urls",
    responsiveness: "never",
    defaultValue: { tokenId: "google" },
    widget: { id: "debug_url", label: "Debug URL" },
    allowCustom: false,
    validate,
  },
  debug_url_token_optional_no_custom: {
    type: "token",
    token: "debug_urls",
    responsiveness: "optional",
    defaultValue: { tokenId: "google" },
    widget: { id: "debug_url", label: "Debug URL" },
    allowCustom: false,
    validate,
  },
  debug_url_token_optional_custom: {
    type: "token",
    token: "debug_urls",
    responsiveness: "optional",
    defaultValue: { tokenId: "google" },
    widget: { id: "debug_url", label: "Debug URL" },
    allowCustom: true,
    validate,
  },
  debug_url_token_always_no_custom: {
    type: "token",
    token: "debug_urls",
    responsiveness: "always",
    defaultValue: { tokenId: "google" },
    widget: { id: "debug_url", label: "Debug URL" },
    allowCustom: false,
    validate,
  },
  debug_url_token_always_custom: {
    type: "token",
    token: "debug_urls",
    responsiveness: "always",
    defaultValue: { tokenId: "google" },
    widget: { id: "debug_url", label: "Debug URL" },
    allowCustom: true,
    validate,
  },
};
