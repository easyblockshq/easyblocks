"use client";

import { SSColors, Stack } from "@easyblocks/design-system";
import { Button, TextFieldInput } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthError, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Fragment, useState } from "react";
import styled from "styled-components";

function SignUpPage() {
  const supabaseClient = createClientComponentClient();

  const [formStatus, setFormStatus] = useState<
    | { status: "idle"; error: null }
    | { status: "loading"; error: null }
    | { status: "success"; error: null; email: string }
    | { status: "error"; error: AuthError }
  >({
    status: "idle",
    error: null,
  });

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();

        setFormStatus({
          status: "loading",
          error: null,
        });

        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        supabaseClient.auth
          .signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/api/auth/confirm`,
            },
          })
          .then((authResponse) => {
            if (authResponse.error) {
              setFormStatus({
                status: "error",
                error: authResponse.error,
              });
              return;
            }

            setFormStatus({
              status: "success",
              error: null,
              email,
            });
          });
      }}
    >
      {formStatus.status !== "success" && (
        <Fragment>
          <FormTitle>Create your Easyblocks account</FormTitle>

          <FormBody>
            <GoogleSignInButton
              supabaseClient={supabaseClient}
              onSignInError={(error) => {
                setFormStatus({
                  status: "error",
                  error,
                });
              }}
            />

            <SocialAndEmailProvidersSeparator />

            <EmailAddressField />

            <PasswordField autoComplete="new-password" />

            {formStatus.status === "error" && (
              <FormError error={formStatus.error.message} />
            )}
          </FormBody>

          <Stack gap={24}>
            <Button
              size="3"
              type="submit"
              disabled={formStatus.status === "loading"}
            >
              Create account
            </Button>

            <div
              css={`
                font-size: 12px;
                line-height: 1.4;
                color: #999999;
                text-align: center;

                & a {
                  color: #333333;
                  text-underline: none;

                  &:visited {
                    color: #333333;
                  }
                }
              `}
            >
              By joining, you agree to our{" "}
              <a
                href="https://www.shopstory.app/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://www.shopstory.app/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </div>
          </Stack>

          <FormSecondaryActions>
            <div>
              Already have an account?{" "}
              <FormLink href="/sign-in">Login</FormLink>
            </div>
          </FormSecondaryActions>
        </Fragment>
      )}

      {formStatus.status === "success" && (
        <Fragment>
          <Stack gap={24}>
            <FormTitle>Check your inbox</FormTitle>

            <div
              css={`
                text-align: center;
              `}
            >
              Click on the link we sent to{" "}
              <span
                css={`
                  font-weight: 700;
                `}
              >
                {formStatus.email}
              </span>{" "}
              to finish your account setup.
            </div>
          </Stack>

          <Stack gap={24}>
            <Button
              variant="outline"
              size="3"
              type="button"
              style={{ width: "100%" }}
              asChild
            >
              <a
                href="https://mail.google.com/mail/u/0/"
                target="_blank"
                rel="noopener nofollow noreferrer"
              >
                <svg
                  width="21"
                  height="16"
                  viewBox="0 0 21 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2221_11627)">
                    <path
                      d="M1.43182 15.875H4.77273V7.76136L0 4.18182V14.4432C0 15.2355 0.641932 15.875 1.43182 15.875Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M16.2271 15.875H19.568C20.3602 15.875 20.9998 15.2331 20.9998 14.4432V4.18182L16.2271 7.76136"
                      fill="#34A853"
                    />
                    <path
                      d="M16.2271 1.55682V7.76136L20.9998 4.18182V2.27273C20.9998 0.502045 18.9785 -0.507387 17.5634 0.554545"
                      fill="#FBBC04"
                    />
                    <path
                      d="M4.77295 7.76136V1.55682L10.5002 5.85227L16.2275 1.55682V7.76136L10.5002 12.0568"
                      fill="#EA4335"
                    />
                    <path
                      d="M0 2.27273V4.18182L4.77273 7.76136V1.55682L3.43636 0.554545C2.01886 -0.507387 0 0.502045 0 2.27273Z"
                      fill="#C5221F"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2221_11627">
                      <rect
                        width="21"
                        height="15.75"
                        fill="white"
                        transform="translate(0 0.125)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                Open Gmail
              </a>
            </Button>

            <Button
              variant="outline"
              size="3"
              type="button"
              style={{ width: "100%" }}
              asChild
            >
              <a
                href="https://outlook.live.com/mail/0/inbox"
                target="_blank"
                rel="noopener nofollow noreferrer"
              >
                <svg
                  width="22"
                  height="21"
                  viewBox="0 0 22 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2221_11613)">
                    <path
                      d="M21.1076 5.31801H8.71289V15.8208H21.1076V5.31801Z"
                      fill="white"
                    />
                    <path
                      d="M8.5009 4.87851C8.02962 4.87851 7.6499 5.25643 7.6499 5.72682L7.65349 15.4666C7.63015 15.9253 7.88868 16.3149 8.40754 16.3149H20.6528C21.1115 16.3149 21.5002 16.0555 21.4939 15.6381L21.5002 5.72682C21.5002 5.25643 21.1205 4.87851 20.6492 4.87851H8.5009ZM8.33034 5.58139H20.8125L20.8161 15.604H8.33393L8.33034 5.58139Z"
                      fill="#0071C5"
                    />
                    <path
                      d="M20.8516 6.01524L14.8677 10.8115V11.4597C14.9132 11.4696 14.9604 11.4689 15.0056 11.4575C15.0508 11.4462 15.0927 11.4245 15.128 11.3941L20.8516 6.80879V6.01524Z"
                      fill="#0071C5"
                    />
                    <path
                      d="M8.96823 6.01524L14.9521 10.8115V11.4597C14.9066 11.4696 14.8594 11.4689 14.8142 11.4575C14.769 11.4462 14.7271 11.4245 14.6918 11.3941L8.96823 6.80879V6.01524Z"
                      fill="#0071C5"
                    />
                    <path
                      d="M12.4912 20.3979V0.499992L0.5 2.48925V18.4078L12.4912 20.3979Z"
                      fill="url(#paint0_linear_2221_11613)"
                    />
                    <path
                      d="M6.18899 6.90115C5.13748 6.90115 3.42773 7.78275 3.42773 10.5565C3.42773 13.2716 5.1181 14.1379 6.16164 14.116C8.09454 14.0754 8.84358 12.1185 8.84358 10.4742C8.84358 8.69407 8.10658 6.90115 6.18899 6.90115ZM6.07971 8.28853C6.92151 8.28853 7.43339 9.14322 7.43339 10.4483C7.43339 11.6027 7.0043 12.6993 6.0926 12.6993C4.94503 12.6993 4.67031 11.3089 4.68402 10.469C4.68402 9.61543 5.05745 8.28853 6.07971 8.28853Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_2221_11613"
                      x1="12.491"
                      y1="10.449"
                      x2="0.500334"
                      y2="10.449"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#006BC2" />
                      <stop offset="1" stop-color="#0077C9" />
                    </linearGradient>
                    <clipPath id="clip0_2221_11613">
                      <rect
                        width="21"
                        height="19.8979"
                        fill="white"
                        transform="translate(0.5 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                Open Outlook
              </a>
            </Button>
          </Stack>

          <div>Can&apos;t find your email? Check your spam folder!</div>
        </Fragment>
      )}
    </Form>
  );
}

export default SignUpPage;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 44px;
`;

const FormTitle = styled.h2`
  font-size: 24px;
  line-height: 1.16;
  color: #000;
  text-align: center;
`;

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormSubmitButton = styled.button`
  all: unset;
  width: 100%;
  height: 44px;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  line-height: 1.13;
  font-weight: 700;
  font-family: Helvetica, sans-serif;
  cursor: pointer;
`;

const FormSecondaryActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const FormLink = styled(Link)`
  color: #0b75f0;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:visited {
    color: #0b75f0;
  }
`;

function EmailAddressField() {
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

function PasswordField(props: {
  autoComplete: "current-password" | "new-password";
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

function FormError(props: { error: string }) {
  return (
    <div
      css={`
        color: ${SSColors.red};
      `}
    >
      {props.error}
    </div>
  );
}

function SocialAndEmailProvidersSeparator() {
  return (
    <div
      css={`
        font-size: 16;
        line-height: 1.16;
        text-align: center;
        color: #999;
      `}
    >
      or
    </div>
  );
}

function GoogleSignInButton(props: {
  supabaseClient: SupabaseClient;
  onSignInError: (error: AuthError) => void;
}) {
  return (
    <Button
      variant="outline"
      size="3"
      type="button"
      onClick={() => {
        props.supabaseClient.auth
          .signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: window.location.origin,
            },
          })
          .then((authResponse) => {
            if (authResponse.error) {
              props.onSignInError(authResponse.error);
              return;
            }

            window.parent.postMessage(
              {
                type: "@shopstory-editor/auth/signed-in",
                payload: {
                  provider: "google",
                },
              },
              "*"
            );
          });
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="21px"
        height="21px"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        ></path>
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        ></path>
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
      </svg>
      Continue with Google
    </Button>
  );
}

export const dynamic = "force-dynamic";
