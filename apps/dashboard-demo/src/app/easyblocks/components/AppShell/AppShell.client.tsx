import { NoCodeComponentProps } from "@easyblocks/core";

function AppShell({
  Header,
  Main,
  Sidebar,
  isSidebarHidden,
}: NoCodeComponentProps & Record<string, any>) {
  return (
    <div
      className="min-h-screen grid"
      style={{ gridTemplateRows: "auto 1fr auto" }}
    >
      <Header.type {...Header.props} />
      <main className="flex">
        {!isSidebarHidden && <Sidebar.type {...Sidebar.props} />}

        <div className="p-4 grow">
          {Main ? (
            <Main.type {...Main.props} />
          ) : (
            <div className="grid place-items-center w-full h-full">
              Main content placeholder
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export { AppShell };
