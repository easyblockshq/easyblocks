/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import React from "react";
import styled, { keyframes } from "styled-components";
import Draggable from "react-draggable";

const ModalPopupKeyframes = keyframes`
  0% {
    transform: translate3d( 0, -2rem, 0 );
    opacity: 0;
  }

  100% {
    transform: translate3d( 0, 0, 0 );
    opacity: 1;
  }
`;

const PopupModalStyled = styled.div`
  display: block;
  z-index: var(--tina-z-index-0);
  overflow: visible; /* Keep this as "visible", select component needs to overflow */
  background-color: var(--tina-color-grey-1);
  border-radius: var(--tina-radius-small);
  margin: 40px auto;
  width: 460px;
  max-width: 90%;
  animation: ${ModalPopupKeyframes} 150ms ease-out 1;
  box-shadow: 0 14px 28px rgb(0 0 0 / 15%), 0 10px 10px rgb(0 0 0 / 12%);
`;

export const PopupModal = (props: any) => {
  const { draggable, ...restProps } = props;

  if (draggable) {
    return (
      <Draggable>
        <PopupModalStyled {...restProps} />
      </Draggable>
    );
  }

  return <PopupModalStyled {...restProps} />;
};

/**
 * @alias [PopupModal]
 * @deprecated
 */
export const ModalPopup = PopupModal;
