import { getDeviceWidthPairs } from "./getDeviceWidthPairs";
import { testDevices } from "./test-utils";

test("works properly for each width different", () => {
  const result = getDeviceWidthPairs(
    { $res: true, b1: 100, b2: 200, b3: 300, b4: 250, b5: 150 },
    testDevices
  );
  expect(result[0]).toEqual({ width: 100, deviceId: "b1" });
  expect(result[1]).toEqual({ width: 150, deviceId: "b5" });
  expect(result[2]).toEqual({ width: 200, deviceId: "b2" });
  expect(result[3]).toEqual({ width: 250, deviceId: "b4" });
  expect(result[4]).toEqual({ width: 300, deviceId: "b3" });
});

test("for equal widths, the breakpoints order is preserved ", () => {
  const result = getDeviceWidthPairs(
    { $res: true, b1: 100, b2: 100, b3: 100, b4: 100, b5: 100 },
    testDevices
  );
  expect(result[0]).toEqual({ width: 100, deviceId: "b1" });
  expect(result[1]).toEqual({ width: 100, deviceId: "b2" });
  expect(result[2]).toEqual({ width: 100, deviceId: "b3" });
  expect(result[3]).toEqual({ width: 100, deviceId: "b4" });
  expect(result[4]).toEqual({ width: 100, deviceId: "b5" });
});
