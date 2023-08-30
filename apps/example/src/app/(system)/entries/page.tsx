"use client";

import { Fragment, useEffect } from "react";
import { useMockService } from "@/data/MockData/useMockService";
import Link from "next/link";

export default function EntriesPage() {
  const service = useMockService();

  if (!service) {
    return null;
  }

  const entries = service.getEntries();

  const cellClasses = "p-2 text-left border border-gray-200 leading-none";

  return (
    <Fragment>
      <div className={"container mx-auto"}>
        <h2 className={"text-2xl mb-16"}>System entries</h2>

        <table className={"border-collapse border border-gray-200 w-full"}>
          <thead>
            <tr>
              <th className={cellClasses}>Name</th>
              <th className={cellClasses}>Id</th>
              <th className={cellClasses}>Last modified</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className={cellClasses}>
                  <Link
                    href={`/entries/${entry.id}`}
                    className={"underline text-blue-500 hover:opacity-70"}
                  >
                    {entry.name}
                  </Link>
                </td>
                <td className={cellClasses}>{entry.id}</td>
                <td className={cellClasses}>
                  {entry.updatedAt.toDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export const revalidate = 0;
