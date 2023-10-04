import React from "react";
import styled from "styled-components";

export type NavigationControllerPanel = {
  id: string;
  title: string;
  element: React.ReactElement;
};

const Root = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
`;

const PanelRoot = styled.div<{ index: number }>`
  grid-row: 1 / span 1;
  grid-column: 1 / span 1;
  position: relative;
  display: grid;
  overflow-y: auto;
  transform: translateX(${(p) => p.index * 30}px);
`;

export type NavigationControllerProps = {
  panels: NavigationControllerPanel[];
};

export const NavigationController: React.FC<NavigationControllerProps> = ({
  panels,
}) => {
  return (
    <Root>
      {panels.map(({ id, title, element }, index) => (
        <PanelRoot index={index}>{element}</PanelRoot>
      ))}
    </Root>
  );
};
