import { isTracingSchemaProp } from "./isTracingSchemaProp";

test.each`
  prop                  | expectedResult
  ${"traceId"}          | ${true}
  ${"traceClicks"}      | ${true}
  ${"traceImpressions"} | ${true}
  ${""}                 | ${false}
  ${"asd"}              | ${false}
  ${undefined}          | ${false}
`("isTracingSchemaProp", ({ prop, expectedResult }) => {
  expect(isTracingSchemaProp(prop)).toEqual(expectedResult);
});
