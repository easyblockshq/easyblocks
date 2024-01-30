import { ReactElement } from "react";
import { NoCodeComponentProps } from "../types";

function MainArea({
  HeaderStack,
  Panels,
  PanelsGrid,
  panelWrappers,
}: NoCodeComponentProps) {
  return (
    <section className="container mx-auto">
      <div className="mb-5">
        <HeaderStack.type {...HeaderStack.props} />
      </div>
      <PanelsGrid.type {...PanelsGrid.props}>
        {(Panels as Array<ReactElement>).map((Panel, index) => {
          const PanelWrapper = panelWrappers[index];

          return (
            <PanelWrapper.type key={index} {...PanelWrapper.props}>
              <Panel.type {...Panel.props} />
            </PanelWrapper.type>
          );
        })}
      </PanelsGrid.type>
    </section>
  );
}

export { MainArea };
