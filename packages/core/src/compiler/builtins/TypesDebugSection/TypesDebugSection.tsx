import React from "react";

function TypesDebugSection({
  inline_never,
  inline_optional_disabled,
  inline_optional_enabled,
  inline_always,
  token_never,
  token_optional_disabled_no_custom,
  token_optional_enabled_no_custom,
  token_optional_disabled_custom,
  token_optional_enabled_custom,
  token_always_no_custom,
  token_always_custom,
}: Record<string, any>) {
  return (
    <div>
      <pre>
        {JSON.stringify(
          {
            inline_never,
            inline_optional_disabled,
            inline_optional_enabled,
            inline_always,
            token_never,
            token_optional_disabled_no_custom,
            token_optional_enabled_no_custom,
            token_optional_disabled_custom,
            token_optional_enabled_custom,
            token_always_no_custom,
            token_always_custom,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}

export { TypesDebugSection };
