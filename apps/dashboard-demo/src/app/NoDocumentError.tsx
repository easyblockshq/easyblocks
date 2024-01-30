import Link from "next/link";

export const NoDocumentError: React.FC<{ documentName: string }> = (props) => {
  return (
    <main className="grid place-items-center h-screen w-screen">
      <div className={"text-center"}>
        <p className={"mb-4"}>
          To render this screen you must build UI for &quot;{props.documentName}
          &quot;.
        </p>
        <p>
          Go to{" "}
          <Link
            href={"/edit"}
            className={"underline hover:opacity-70 text-blue-500"}
          >
            /edit
          </Link>{" "}
          to build UI.
        </p>
      </div>
    </main>
  );
};
