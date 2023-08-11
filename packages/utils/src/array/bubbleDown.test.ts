import { bubbleDown } from "./bubbleDown";

test.each`
  data                    | matcher                                 | expectedResult
  ${[]}                   | ${() => true}                           | ${[]}
  ${[]}                   | ${() => false}                          | ${[]}
  ${[1, 2, 3, 4]}         | ${(x: number) => x % 2 === 0}           | ${[1, 3, 2, 4]}
  ${["a", "b", "C", "d"]} | ${(x: string) => x.charCodeAt(0) >= 97} | ${["C", "a", "b", "d"]}
`(
  "Moves specific items to the end of the array $data -> $expectedResult",
  ({ data, matcher, expectedResult }) => {
    expect(bubbleDown(matcher, data)).toEqual(expectedResult);
  }
);
