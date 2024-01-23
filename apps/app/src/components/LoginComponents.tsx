import { TextFieldInput } from "@radix-ui/themes";
import React from "react";

export function EmailAddressField() {
  return (
    <TextFieldInput
      size="3"
      name="email"
      autoComplete="email"
      placeholder="Email"
      aria-label="Email"
    />
  );
}

export function PasswordField(props: {
  autoComplete: "current-password" | "`-`";
}) {
  return (
    <TextFieldInput
      size="3"
      name="password"
      autoComplete={props.autoComplete}
      type="password"
      placeholder="Password"
      aria-label="Password"
    />
  );
}

export function FormError(props: { error: string }) {
  return (
    <div className="text-red-500 text-md" role="alert">
      {props.error}
    </div>
  );
}

export function OrSeparator() {
  return <div className="text-center text-md text-slate-500 py-3">or</div>;
}

export function FormContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 items-stretch">{props.children}</div>
  );
}
