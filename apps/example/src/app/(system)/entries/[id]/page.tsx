"use client";

import { Fragment, useEffect } from "react";
import { useMockService } from "@/data/MockData/useMockService";
import { DocumentWidget } from "@/app/document-widget";
import Link from "next/link";
import { notFound } from "next/navigation";

export type EntryPageParams = {
  id: string;
};
export default function EntryPage({
  params: { id },
}: {
  params: EntryPageParams;
}) {
  const mockService = useMockService();

  if (!mockService) {
    return null;
  }

  const entry = mockService.getEntryById(id);

  if (!entry) {
    notFound();
  }

  return (
    <Fragment>
      <div className={"container mx-auto"}>
        <Link
          href={"/entries"}
          className={"underline text-blue-500 hover:opacity-70"}
        >
          ← All Entries
        </Link>
        <h2 className={"text-2xl mb-16 mt-4"}>
          {entry.name}
          <Link
            href={`/entries/${id}/preview`}
            className="border border-blue-50 text-black text-sm font-medium rounded-2xl py-1.5 px-4 min-w-[100px]"
          >
            Preview
          </Link>
        </h2>

        <div className={"mb-6"}>
          <div className={"font-bold"}>ID</div>
          <div>{entry.id}</div>
        </div>

        <div className={"mb-6"}>
          <div className={"font-bold"}>Name</div>
          <div>{entry.name}</div>
        </div>

        <div className={"mb-6"}>
          <div className={"font-bold"}>Description</div>
          <div>{entry.description}</div>
        </div>

        <div className={"mb-6"}>
          <div className={"font-bold"}>Last modified</div>
          <div>{entry.updatedAt.toString()}</div>
        </div>

        <div className={"mb-6"}>
          <div className={"font-bold"}>Created at</div>
          <div>{entry.createdAt.toString()}</div>
        </div>

        <div className={"mb-6"}>
          <div className={"font-bold"}>Page</div>
          <div className={"mt-3"}>
            <DocumentWidget
              document={{
                ...entry.page,
                rootContainer: entry.page?.rootContainer ?? entry.type,
              }}
              onSave={(document) => {
                mockService.updateEntry({
                  ...entry,
                  page: document,
                });
              }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export const revalidate = 0;
