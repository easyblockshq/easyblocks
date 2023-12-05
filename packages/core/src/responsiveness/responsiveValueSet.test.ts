import { Devices } from "@easyblocks/core";
import { responsiveValueSet } from "./responsiveValueSet";

const devices: Devices = [
  {
    id: "b1",
    w: 100,
    h: 100,
    breakpoint: 150,
  },
  {
    id: "b2",
    w: 200,
    h: 200,
    breakpoint: 250,
  },
  {
    id: "b3",
    w: 300,
    h: 300,
    breakpoint: 350,
  },
  {
    id: "b4",
    w: 400,
    h: 400,
    breakpoint: 450,
  },
  {
    id: "b5",
    w: 500,
    h: 500,
    breakpoint: null,
  },
];

test("responsiveValueSet works for truly responsive values when setting new breakpoint to new value", () => {
  const newValue = responsiveValueSet(
    { $res: true, b1: 100, b4: 400 },
    "b3",
    300,
    devices
  );
  expect(newValue).toEqual({ $res: true, b1: 100, b3: 300, b4: 400 });
});

test("responsiveValueSet works for truly responsive values when setting new breakpoint to existing value, no normalization", () => {
  const newValue = responsiveValueSet(
    { $res: true, b1: 100, b4: 400 },
    "b3",
    400,
    devices
  );
  expect(newValue).toEqual({ $res: true, b1: 100, b3: 400, b4: 400 });
});

test("responsiveValueSet works for truly responsive values when setting existing breakpoint", () => {
  const newValue = responsiveValueSet(
    { $res: true, b1: 100, b4: 400 },
    "b4",
    200,
    devices
  );
  expect(newValue).toEqual({ $res: true, b1: 100, b4: 200 });
});

test("responsiveValueSet works for non-truly responsive values when setting existing breakpoint", () => {
  const newValue = responsiveValueSet(400, "b4", 200, devices);
  expect(newValue).toEqual({
    $res: true,
    b1: 400,
    b2: 400,
    b3: 400,
    b4: 200,
    b5: 400,
  });
});
