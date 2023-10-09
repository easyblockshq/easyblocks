import { NavigationController, Typography } from "@easyblocks/design-system";

export function NavigationControllerStories() {
  return (
    <div>
      <Typography variant={"label"}>NavigationController</Typography>
      <br />

      <div
        style={{
          position: "relative",
          width: 400,
          height: 600,
          display: "grid",
        }}
      >
        <NavigationController
          panels={[
            {
              id: "panel-1",
              title: "Panel 1",
              element: (
                <div style={{ background: "red" }}>
                  {[...Array(50)].map((e, i) => (
                    <div>Item</div>
                  ))}
                </div>
              ),
            },
            {
              id: "panel-2",
              title: "Panel 2",
              element: (
                <div style={{ background: "blue" }}>
                  {[...Array(50)].map((e, i) => (
                    <div>Item</div>
                  ))}
                </div>
              ),
            },
            {
              id: "panel-3",
              title: "Panel 3",
              element: (
                <div style={{ background: "yellow" }}>
                  {[...Array(50)].map((e, i) => (
                    <div>Item</div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
