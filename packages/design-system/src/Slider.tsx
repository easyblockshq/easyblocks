import React from "react";
import styled from "styled-components";

import { Colors } from "./colors";

export type RangeSliderProps = React.InputHTMLAttributes<HTMLInputElement> & {
  max: number;
  min: number;
  step?: number;
};

const trackHeight = "1px";
const thumbSize = "11px";
const thumbRadius = "50%";
const trackColor = Colors.black10;
const trackColorHover = "black";
const thumbColor = "black";

const Root = styled.div`
  input[type="range"] {
    width: 100%;
    margin: 5px 0;
    height: 20px;
    -webkit-appearance: none;
    cursor: pointer;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    background: ${trackColor};
    border: 0;
    width: 100%;
    height: ${trackHeight};
    transition: all 0.1s;
  }
  input[type="range"]::-webkit-slider-thumb {
    margin-top: -5px;
    width: ${thumbSize};
    height: ${thumbSize};
    border-radius: ${thumbRadius};
    background: ${thumbColor};
    -webkit-appearance: none;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: ${trackColor};
  }

  input[type="range"]:hover::-webkit-slider-runnable-track {
    background: ${trackColorHover};
  }

  input[type="range"]::-moz-range-track {
    background: ${trackColor};
    border: 0;
    width: 100%;
    height: ${trackHeight};
    transition: all 0.1s;
  }
  input[type="range"]::-moz-range-thumb {
    width: ${thumbSize};
    height: ${thumbSize};
    border-radius: ${thumbRadius};
    background: ${thumbColor};
    border: none;
  }

  input[type="range"]:hover::-moz-range-track {
    background: ${trackColorHover};
  }

  input[type="range"]::-ms-track {
    background: transparent;
    border-color: transparent;
    border-width: 0px 0;
    color: transparent;
    width: 100%;
    height: ${trackHeight};
  }
  input[type="range"]::-ms-fill-lower {
    background: #000080;
    border: 0;
  }
  input[type="range"]::-ms-fill-upper {
    background: ${trackColor};
    border: 0;
  }
  input[type="range"]::-ms-thumb {
    width: ${thumbSize};
    height: ${thumbSize};
    border-radius: ${thumbRadius};
    background: ${thumbColor};
    margin-top: 0px;
    /*Needed to keep the Edge thumb centred*/
  }

  input[type="range"]:focus::-ms-fill-lower {
    background: ${trackColor};
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: ${trackColor};
  }
`;

const SliderStyled = styled.input``;

export const RangeSlider: React.FC<RangeSliderProps> = (props) => {
  return (
    <Root>
      <SliderStyled {...props} type={"range"} />
    </Root>
  );
};
