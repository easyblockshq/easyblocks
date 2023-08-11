import { createConfig } from "../../utils/tests";
import { byId } from "./byId";

test.each`
  id       | configId | expectedResult
  ${"1"}   | ${"1"}   | ${true}
  ${"asd"} | ${"xyz"} | ${false}
`(
  "Should return $expectedResult when id=$id and configId=$configId ",
  ({ id, configId, expectedResult }) => {
    expect(byId(id)(createConfig({ _id: configId }))).toBe(expectedResult);
  }
);
