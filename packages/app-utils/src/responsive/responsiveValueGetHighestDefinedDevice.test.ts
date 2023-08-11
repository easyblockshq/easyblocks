import { Devices } from "@easyblocks/core";
import { responsiveValueGetHighestDefinedDevice } from "./responsiveValueGetHighestDefinedDevice";

const b1Device = {
  id: "b1",
  w: 100,
  h: 100,
  breakpoint: 150,
};

const b2Device = {
  id: "b2",
  w: 200,
  h: 200,
  breakpoint: 250,
};

const b3Device = {
  id: "b3",
  w: 300,
  h: 300,
  breakpoint: 350,
};

const b4Device = {
  id: "b4",
  w: 400,
  h: 400,
  breakpoint: 450,
};

const b5Device = {
  id: "b5",
  w: 500,
  h: 500,
  breakpoint: null,
};

const devices: Devices = [b1Device, b2Device, b3Device, b4Device, b5Device];

describe("getDefaultBreakpoint", () => {
  test("works", () => {
    expect(
      responsiveValueGetHighestDefinedDevice(
        {
          b1: 10,
          $res: true,
        },
        devices
      )
    ).toEqual(b1Device);

    expect(
      responsiveValueGetHighestDefinedDevice(
        {
          b1: 10,
          b2: 20,
          $res: true,
        },
        devices
      )
    ).toEqual(b2Device);

    expect(
      responsiveValueGetHighestDefinedDevice(
        {
          b1: 10,
          b2: 20,
          b5: 50,
          $res: true,
        },
        devices
      )
    ).toEqual(b5Device);

    expect(
      responsiveValueGetHighestDefinedDevice(
        {
          b4: "lightgrey",
          $res: true,
        },
        devices
      )
    ).toEqual(b4Device);
  });
});
