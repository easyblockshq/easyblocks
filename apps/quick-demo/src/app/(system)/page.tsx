"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DocumenWidgetInline, Document } from "@/app/DocumenWidgetInline";

const DOCUMENT_KEY = "easyblocksQuickDemoDocumentId";

export default function MainPage() {
  const [document, setDocument] = useState<null | undefined | Document>(
    undefined
  );
  const [isOpen, setOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const documentRaw = localStorage.getItem(DOCUMENT_KEY);

    if (!documentRaw) {
      setDocument(null);
    } else {
      // On this date we've introduced a change for names of text and rich text component.
      // This change is not backwards compatible, so we need to reset the saved document.
      const date = new Date("2023-11-23:00:00:00");
      const parsedDocument = JSON.parse(documentRaw);

      if (parsedDocument.updatedAt < date.getTime()) {
        setDocument(null);
        localStorage.removeItem(DOCUMENT_KEY);
      } else {
        setDocument(parsedDocument);
      }
    }

    setOpen(true);
  }, []);

  if (document === undefined) {
    return null;
  }

  const linkClasses =
    "underline text-[#4f46e5] inline-flex items-center hover:no-underline";

  return (
    <div className={"relative w-full h-screen flex flex-row"}>
      {!sidebarOpen && (
        <div
          className={
            "basis-8 border-r-neutral-200 border-r flex flex-col items-center px-2 pt-[7px]"
          }
        >
          <button
            type="button"
            className="hover:border border-neutral-200 rounded-sm w-[28px] h-[28px] flex justify-center items-center text-black-1 active:bg-neutral-200"
            onClick={() => {
              setSidebarOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className={"w-5 h-5"}
            >
              <path d="m531.692-480-184-184L376-692.308 588.308-480 376-267.692 347.692-296l184-184Z" />
            </svg>
          </button>

          <h2
            className={"text-md font-semibold mt-6"}
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            Easyblocks demo
          </h2>
        </div>
      )}

      {sidebarOpen && (
        <div
          className={
            "basis-72 px-3 pt-[7px] pb-3 border-r-neutral-200 border-r flex flex-col justify-between"
          }
        >
          <div className={"flex flex-col"}>
            <button
              type="button"
              className="hover:border border-neutral-200 rounded-sm w-[28px] h-[28px] flex items-center justify-center text-black-1 active:bg-neutral-200 mr-[-4px] self-end"
              onClick={() => {
                setSidebarOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className={"w-5 h-5"}
              >
                <path d="M560-267.692 347.692-480 560-692.308 588.308-664l-184 184 184 184L560-267.692Z" />
              </svg>
            </button>

            <h2 className={"text-xl font-semibold  mb-8 mt-10"}>
              Easyblocks demo
            </h2>

            <p className={"text-sm mb-4 text-black-2 max-w-lg"}>
              On the right side you see a demo of an embeddable Easyblocks
              editor configured for building simple landing page content.
            </p>

            <p className={"text-sm mb-4 text-black-2 max-w-lg"}>
              The most important{" "}
              <a
                href={"https://docs.easyblocks.io/#no-code-components"}
                target={"_blank"}
                className={linkClasses}
              >
                No-Code Components
              </a>{" "}
              in this example are: Hero Banner, Collection, Two Cards section,
              Basic Card and a very simple Product Card.
            </p>

            <div
              className={"max-w-lg h-[1px] bg-neutral-200 mb-5 mt-5 mt-10"}
            ></div>

            <p className={"text-sm mb-4 text-black-2 max-w-lg"}>
              Easyblocks is a super-flexible visual builder framework. It helps
              developers build completely customized visual builders in weeks
              instead of years. Check the docs link below for more info.
            </p>

            <p className={"text-sm mb-4 text-black-2 max-w-lg"}>
              <a
                href={"https://docs.easyblocks.io/"}
                target={"_blank"}
                className={linkClasses}
              >
                Easyblocks documentation
                <ArrowRightIcon />
              </a>
            </p>
          </div>

          <div>
            {document && (
              <div>
                <p
                  className={
                    "text-sm mb-0.5 text-black-2 max-w-lg font-semibold"
                  }
                >
                  Last content update
                </p>
                <p className={"text-sm text-black-2 max-w-lg mb-1"}>
                  {formatDate(new Date(document.updatedAt))}
                </p>
                {document && (
                  <p className={"text-sm text-black-2 max-w-lg"}>
                    <a
                      href={`${window.location.origin}/page/${document.id}`}
                      target={"_blank"}
                      className={linkClasses}
                    >
                      Preview link
                      <ArrowRightIcon />
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          {/*<div className={"max-w-lg h-[1px] bg-neutral-200 mb-4 mt-10"}></div>*/}

          {/*<p className={"text-sm mb-3 text-black-2 max-w-lg"}>*/}
          {/*  For the purpose of this demo the content is stored in Local Storage.*/}
          {/*</p>*/}
        </div>
      )}

      <div className={"flex-auto grid bg-white-1"}>
        <DocumenWidgetInline
          isOpen={isOpen}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
          }}
          document={document}
          onSave={(document) => {
            setDocument(document);
            localStorage.setItem(DOCUMENT_KEY, JSON.stringify(document));
          }}
        />

        {!isOpen && (
          <div className={"justify-self-center self-center"}>
            <button
              className="bg-black-1 hover:bg-black-2 duration-100 text-white-1 font-medium rounded-2xl py-3 px-5 min-w-[100px]"
              onClick={() => {
                setOpen(true);
              }}
            >
              Open Editor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + "" + ampm;
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    "  " +
    strTime
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={"ml-1"}
    >
      <path
        d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
