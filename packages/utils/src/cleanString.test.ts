import { cleanString } from "./cleanString";

test("removes special characters", () => {
  expect(cleanString("Lorem \u2028ipsum")).toBe("Lorem ipsum");
});
